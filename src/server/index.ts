import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import crypto from "crypto";
import Razorpay from "razorpay";
import { connectDB, Product, Payment, ProcessedEvent } from "./db.js";
import { uploadImage } from "./cloudinary.js";


dotenv.config();

// Enforce environment validation at startup
const requiredEnv = ["JWT_SECRET", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "ADMIN_PASSWORD", "MONGODB_URI"];
for (const envName of requiredEnv) {
  if (!process.env[envName]) {
    console.error(`FATAL CONFIGURATION ERROR: Environment variable ${envName} is not defined.`);
    process.exit(1);
  }
}

export const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_EXPIRY = "1h";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});


// Security Headers with strict Content Security Policy (CSP)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
}));

// CORS Configuration with origin whitelisting
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://vayusnetworks.com",
  "https://www.vayusnetworks.com"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    return callback(new Error("CORS policy violation: origin not allowed"), false);
  },
  credentials: true,
}));

// Reduced Payload Limits to prevent DoS
app.use(express.json({ 
  limit: "5mb",
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 failed attempts per window
  message: { error: "Too many authentication attempts, please try again later." },
});

app.use("/api", generalLimiter);

// Connect to MongoDB
connectDB();

// JWT Authentication Middleware
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if ((decoded as any).role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// API Routes
app.get("/api/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", authenticateAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const { name, description, price, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ error: "Name, price, and quantity are required" });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload to Cloudinary
    const imageUrl = await uploadImage(dataURI);

    // Save to MongoDB
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      quantity: Number(quantity), // Cast quantity to number for numeric stock count
      imageUrl,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.delete("/api/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.post("/api/products/:id/click", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to track click" });
  }
});

// Payment API endpoints
app.get("/api/payments/key", (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID! });
});

// Helper function to complete payment transaction securely
async function completePayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
  // Atomically transition status using findOneAndUpdate to prevent race conditions (double execution)
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId, status: { $ne: "paid" } },
    { 
      status: "paid",
      razorpayPaymentId,
      razorpaySignature
    },
    { new: true }
  );

  if (!payment) {
    // If not found, it either doesn't exist, or was already concurrently processed to "paid" state.
    // Fetch it to return the current record.
    const alreadyProcessed = await Payment.findOne({ razorpayOrderId });
    if (!alreadyProcessed) {
      throw new Error("Payment transaction not found in database");
    }
    return alreadyProcessed;
  }

  // Atomically deduct product stock (only once since transition succeeded)
  if (payment.productId) {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: payment.productId, quantity: { $gte: payment.quantity } },
      { $inc: { quantity: -payment.quantity } },
      { new: true }
    );
    if (!updatedProduct) {
      console.warn(`[STOCK WARNING] Stock decrement failed for product ${payment.productId}. Insufficient stock.`);
    }
  }

  return payment;
}

app.post("/api/payments/order", async (req: express.Request, res: express.Response) => {
  try {
    const { productId, customerName, customerEmail, customerPhone, shippingAddress, quantity } = req.body;

    if (!productId || !customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return res.status(400).json({ error: "Missing required checkout fields" });
    }

    const qty = Number(quantity) || 1;
    if (qty <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Verify stock availability
    if (product.quantity < qty) {
      return res.status(400).json({ error: "Out of stock / Insufficient stock available" });
    }

    const totalAmount = product.price * qty;

    // Duplicate transaction window lock (5 minutes)
    const duplicateCheck = await Payment.findOne({
      productId: product._id,
      customerEmail,
      amount: totalAmount,
      status: "pending",
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    });

    if (duplicateCheck) {
      return res.status(409).json({ 
        error: "Duplicate request", 
        message: "An identical checkout session is already pending. Please wait 5 minutes." 
      });
    }

    // Create Razorpay Order
    const options = {
      amount: Math.round(totalAmount * 100), // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const rzpOrder = await razorpay.orders.create(options);

    // Save pending payment record in DB
    const newPayment = new Payment({
      razorpayOrderId: rzpOrder.id,
      productId: product._id,
      productName: product.name,
      amount: totalAmount,
      quantity: qty,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      status: "pending",
    });

    await newPayment.save();

    res.json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      payment: newPayment,
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to initiate payment", message: error.message });
  }
});

app.post("/api/payments/verify", async (req: express.Request, res: express.Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay payment parameters" });
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest === razorpay_signature) {
      const payment = await completePayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      res.json({ success: true, message: "Payment verified successfully", payment });
    } else {
      // Payment failed verification
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );
      res.status(400).json({ error: "Invalid payment signature verification failed" });
    }
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Payment verification failed", message: error.message });
  }
});

// Secure Webhook signature validation for status synchronization
app.post("/api/payments/webhook", async (req: express.Request, res: express.Response) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    if (!signature) {
      return res.status(400).json({ error: "Missing signature header" });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured on the server");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const rawBody = (req as any).rawBody;
    if (!rawBody) {
      return res.status(400).json({ error: "Missing raw body buffer" });
    }

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(rawBody);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    // Replay Attack Protection: Ensure the webhook event is not processed multiple times
    const eventId = req.body.event_id;
    if (eventId) {
      try {
        await ProcessedEvent.create({ eventId });
      } catch (err) {
        // Event was already processed, ignore but return 200 OK so Razorpay knows we received it
        return res.status(200).json({ success: true, message: "Webhook event already processed" });
      }
    }

    const event = req.body.event;
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = req.body.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      await completePayment(orderId, paymentId, signature);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Webhook error", message: error.message });
  }
});

// Paginated admin payments query
app.get("/api/admin/payments", authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments for admin:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// Admin endpoint to transition order status and manage inventory restorations
app.patch("/api/admin/payments/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "paid", "failed", "processing", "shipped", "delivered", "refunded", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status state transition" });
    }

    // Retrieve original payment to verify original status and prevent double restorations
    const originalPayment = await Payment.findById(id);
    if (!originalPayment) {
      return res.status(404).json({ error: "Transaction record not found" });
    }

    // Transition status atomically if not already set to avoid double triggers
    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: id, status: { $ne: status } },
      { status },
      { new: true }
    );

    if (updatedPayment) {
      // If we transitioned to cancelled or refunded from a stock-deducted state (paid, processing, shipped)
      const isStockDeductedState = ["paid", "processing", "shipped"].includes(originalPayment.status);
      const isStockRefundState = ["cancelled", "refunded"].includes(status);

      if (isStockDeductedState && isStockRefundState && updatedPayment.productId) {
        // Restore inventory stock atomically
        await Product.findByIdAndUpdate(updatedPayment.productId, {
          $inc: { quantity: updatedPayment.quantity }
        });
      }
    }

    res.json({ success: true, payment: updatedPayment || originalPayment });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status", message: error.message });
  }
});

app.post("/api/admin/login", authLimiter, (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD!;
  const salt = crypto.createHash("sha256").update(JWT_SECRET).digest();
  const inputHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
  const actualHash = crypto.pbkdf2Sync(adminPassword, salt, 100000, 64, "sha512");

  if (inputHash.length !== actualHash.length || !crypto.timingSafeEqual(inputHash, actualHash)) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { role: "admin", iat: Math.floor(Date.now() / 1000) },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  res.json({
    success: true,
    token,
    expiresIn: TOKEN_EXPIRY,
  });
});

app.post("/api/admin/verify", authenticateAdmin, (req, res) => {
  res.json({ success: true });
});

// Global Error Handler for Debugging
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("UNHANDLED ERROR:", err);
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack 
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}

export default app;
