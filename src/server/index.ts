import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import crypto from "crypto";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB, Product, Payment, ProcessedEvent, Admin, PasswordResetToken, User, seedAdmin } from "./db.js";
import { uploadImage } from "./cloudinary.js";
import { sendPasswordResetEmail, sendOrderInvoiceEmail, sendTrackingEmail, sendOrderStatusEmail } from "./email.js";

dotenv.config();

// Enforce environment validation at startup
const requiredEnv = [
  "JWT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "MONGODB_URI",
  "ADMIN_EMAIL"
];

for (const envName of requiredEnv) {
  if (!process.env[envName]) {
    console.error(`FATAL CONFIGURATION ERROR: Environment variable ${envName} is not defined.`);
    process.exit(1);
  }
}

// Security: Plaintext Admin Password Warning & Automatic Hash Generator
if (process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(process.env.ADMIN_PASSWORD, salt, 100000, 64, "sha512").toString("hex");
    console.log(`\n======================================================`);
    console.log(`[SECURITY WARNING] Plaintext ADMIN_PASSWORD detected in env.`);
    console.log(`To secure your application, copy this hash to your .env:`);
    console.log(`ADMIN_PASSWORD_HASH=${salt}.${hash}`);
    console.log(`Then remove ADMIN_PASSWORD from your .env file.`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error("Error generating password hash:", err);
  }
}

export const app = express();
app.set("trust proxy", 1); // Trust the reverse proxy (Vercel) for rate limiting

const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_EXPIRY = "1h";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Security: Conditional CSP (restrictive in production, permissive in local dev for Vite)
const isProd = process.env.NODE_ENV === "production";
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: isProd
        ? ["'self'", "https://checkout.razorpay.com"]
        : ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
}));

// CORS Configuration (restrict origin bypasses on production hosts)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://vayusnetworks.com",
  "https://www.vayusnetworks.com"
];

// Helper to check if origin is allowed (including vercel preview deployments)
const isOriginAllowed = (origin: string) => {
  if (allowedOrigins.includes(origin)) return true;
  if (isProd && origin.endsWith(".vercel.app")) return true;
  if (!isProd && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))) return true;
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy violation: origin not allowed"), false);
  },
  credentials: true,
}));

// Basic Structured Logger fallback (since pino npm install is restricted)
const logger = {
  info: (msg: string, meta?: any) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta || ""),
  error: (meta: any, msg: string) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, meta || ""),
};

// CSRF Protection via Strict Origin Verification
app.use((req, res, next) => {
  const isMutatingRequest = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  const isExemptRoute = req.path === "/api/payments/webhook" || req.path === "/api/cron/recover-stock";
  
  if (isMutatingRequest && !isExemptRoute) {
    const origin = req.headers.origin || req.headers.referer;
    if (!origin) {
      return res.status(403).json({ error: "Forbidden: Missing Origin/Referer header for CSRF protection." });
    }
    
    try {
      const originUrl = new URL(origin);
      if (!isOriginAllowed(originUrl.origin)) {
        return res.status(403).json({ error: "Forbidden: Origin verification failed." });
      }
    } catch (e) {
      return res.status(403).json({ error: "Forbidden: Invalid Origin header." });
    }
  }
  next();
});

// Reduced Payload Limits to prevent DoS
app.use(express.json({ 
  limit: "2mb", // Reduced from 5mb for tighter security
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ limit: "2mb", extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Magic-Byte verification helper to validate uploaded files are genuine images securely
function isValidImageBuffer(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  const hex = buffer.toString("hex", 0, 8).toUpperCase();
  
  // JPEG: Starts with FFD8FF
  if (hex.startsWith("FFD8FF")) return true;
  // PNG: Starts with 89504E470D0A1A0A
  if (hex === "89504E470D0A1A0A") return true;
  // GIF: Starts with GIF87a or GIF89a
  if (hex.startsWith("474946383761") || hex.startsWith("474946383961")) return true;
  // WEBP: RIFF...WEBP
  if (buffer.toString("hex", 0, 4).toUpperCase() === "52494646" && 
      buffer.toString("hex", 8, 12).toUpperCase() === "57454250") {
    return true;
  }
  
  return false;
}

// Cookie parser helper function for httpOnly admin_token cookies
function getCookie(req: express.Request, name: string): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [key, ...valParts] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(valParts.join("="));
    }
  }
  return undefined;
}

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  message: { error: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 failed attempts per window
  message: { error: "Too many authentication attempts, please try again later." },
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // Max 3 password reset attempts per IP per hour
  message: { error: "Too many password reset requests. Please try again later." },
});

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Max 5 checkouts per IP per 15 minutes to prevent inventory exhaustion
  message: { error: "Too many checkout attempts. Please try again later." },
});

app.use("/api", generalLimiter);

// Connect to MongoDB
connectDB().then(() => {
  seedAdmin();
});

// JWT Authentication Middleware (migrated to Cookie extraction)
async function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = getCookie(req, "admin_token");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No session cookie found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as any;
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    
    // Fetch the admin record (if it exists) to check for password changes
    // We don't fail if it doesn't exist because the system falls back to .env credentials
    const admin = await Admin.findOne();
    
    if (admin && admin.passwordChangedAt && decoded.iat) {
      const changedTimestamp = parseInt((admin.passwordChangedAt.getTime() / 1000).toString(), 10);
      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({ error: "Session expired due to password change" });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
}

// User Authentication Middleware
async function authenticateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = getCookie(req, "user_token");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No session cookie found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as any;
    if (decoded.role !== "user") {
      return res.status(403).json({ error: "Forbidden: User access required" });
    }
    
    // Check if password was changed after token was issued
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(401).json({ error: "User not found" });
    
    if (user.passwordChangedAt && decoded.iat) {
      const changedTimestamp = parseInt((user.passwordChangedAt.getTime() / 1000).toString(), 10);
      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({ error: "Session expired due to password change" });
      }
    }

    (req as any).user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
}

// Input schemas for validation
const productValidationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long").trim(),
  description: z.string().max(2000, "Description is too long").trim().optional(),
  price: z.preprocess((val) => Number(val), z.number().positive("Price must be positive").max(1000000)),
  quantity: z.preprocess((val) => Number(val), z.number().int("Quantity must be an integer").nonnegative("Quantity cannot be negative").max(100000))
});

const orderValidationSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid product ID"),
  customerName: z.string().min(1, "Name is required").max(200).trim(),
  customerEmail: z.string().email("Invalid email format").max(320).trim(),
  customerPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number (10 digits)").trim(),
  shippingAddress: z.string().min(5, "Address is too short").max(1000).trim(),
  quantity: z.preprocess((val) => Number(val), z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"))
});

const userRegisterSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).trim(),
  email: z.string().email("Invalid email format").max(320).trim(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number (10 digits)").trim()
});

const userLoginSchema = z.object({
  email: z.string().email("Invalid email format").trim(),
  password: z.string().min(1, "Password is required")
});

// User API Routes
app.post("/api/users/register", authLimiter, async (req, res) => {
  try {
    const parsed = userRegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { name, email, password, phone } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = salt + "." + crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");

    const newUser = new User({ name, email, passwordHash, phone });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/api/users/login", authLimiter, async (req, res) => {
  try {
    const parsed = userLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const [salt, key] = user.passwordHash.split(".");
    const hashedBuffer = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
    const keyBuffer = Buffer.from(key, "hex");

    if (hashedBuffer.length !== keyBuffer.length || !crypto.timingSafeEqual(hashedBuffer, keyBuffer)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: "user", name: user.name, phone: user.phone },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.cookie("user_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });

    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

app.post("/api/users/logout", (req, res) => {
  res.clearCookie("user_token");
  res.json({ success: true });
});

app.get("/api/users/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById((req as any).user.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const skip = (page - 1) * limit;

    // Fetch orders for this user
    const orders = await Payment.find({ customerEmail: user.email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ user, orders });
  } catch (error) {
    console.error("Fetch me error:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.post("/api/users/forgot-password", passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't reveal user existence
      return res.json({ success: true, message: "If an account exists, a reset link was sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await PasswordResetToken.create({
      email: user.email,
      tokenHash,
      expiresAt: new Date(Date.now() + 900000), // 15 mins
    });

    const origin = req.headers.origin || `http://${req.headers.host}`;
    await sendPasswordResetEmail(user.email, token, origin, false);

    res.json({ success: true, message: "If an account exists, a reset link was sent." });
  } catch (error) {
    console.error("User forgot password error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

app.post("/api/users/reset-password", passwordResetLimiter, async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "Token and new password required" });
    if (newPassword.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = salt + "." + crypto.pbkdf2Sync(newPassword, salt, 100000, 64, "sha512").toString("hex");

    await User.findOneAndUpdate({ email: resetRecord.email }, { passwordHash, passwordChangedAt: new Date() });
    
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("User reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// API Routes
app.get("/api/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const products = await Product.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name price quantity imageUrl description clicks createdAt");
      
    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", authenticateAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Security: magic-byte validator
    if (!isValidImageBuffer(req.file.buffer)) {
      return res.status(400).json({ error: "Invalid image content. Only JPEG, PNG, GIF, and WebP are allowed." });
    }

    const parsed = productValidationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { name, description, price, quantity } = parsed.data;

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload to Cloudinary
    const imageUrl = await uploadImage(dataURI);

    // Save to MongoDB
    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      imageUrl,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.delete("/api/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }
    
    // Use soft delete to preserve order history integrity
    await Product.findByIdAndUpdate(id, { isDeleted: true });
    res.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.put("/api/products/:id", authenticateAdmin, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const parsed = productValidationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { name, description, price, quantity } = parsed.data;
    const updateData: any = { name, description, price, quantity };

    if (req.file) {
      if (!isValidImageBuffer(req.file.buffer)) {
        return res.status(400).json({ error: "Invalid image content. Only JPEG, PNG, GIF, and WebP are allowed." });
      }
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      updateData.imageUrl = await uploadImage(dataURI);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.post("/api/products/:id/click", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }
    await Product.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
    res.json({ success: true });
  } catch (error) {
    console.error("Track click error:", error);
    res.status(500).json({ error: "Failed to track click" });
  }
});

// Payment API endpoints
app.get("/api/payments/key", (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID! });
});

// Helper function to complete payment transaction securely
async function completePayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
  // Atomically transition status using findOneAndUpdate to prevent double execution
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId, status: { $ne: "paid" } },
    { 
      status: "paid",
      razorpayPaymentId,
      razorpaySignature
    },
    { returnDocument: "after" }
  );

  if (!payment) {
    // If not found, it either doesn't exist, or was already concurrently processed to "paid" state.
    const alreadyProcessed = await Payment.findOne({ razorpayOrderId });
    if (!alreadyProcessed) {
      throw new Error("Payment transaction not found in database");
    }
    return alreadyProcessed;
  }

  // Stock deduction is already handled atomically at reservation stage (order creation).
  // Thus we do NOT deduct stock here to prevent double deduction.

  // Send Order Confirmation Email asynchronously
  sendOrderInvoiceEmail(payment).catch(err => {
    console.error("Failed to send order invoice email:", err);
  });

  return payment;
}

app.post("/api/payments/order", authenticateUser, checkoutLimiter, async (req: express.Request, res: express.Response) => {
  let reservedProduct = false;
  let pId = "";
  let qty = 0;
  let tempPaymentId: string | null = null;

  try {
    const parsed = orderValidationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { productId, customerName, customerEmail, customerPhone, shippingAddress, quantity } = parsed.data;
    pId = productId;
    qty = quantity;

    // Optimistic stock check before locking
    const productCheck = await Product.findOne({ _id: productId, quantity: { $gte: qty } });
    if (!productCheck) {
      return res.status(409).json({ error: "Out of stock / Insufficient stock available" });
    }

    const subtotal = productCheck.price * qty;
    const gstAmount = Math.round(subtotal * 0.18); // 18% GST
    const shippingAmount = subtotal >= 1000 ? 0 : 50; // Free shipping over 1000 INR
    const totalAmount = subtotal + gstAmount + shippingAmount;

    // Duplicate transaction window lock (5 minutes)
    const duplicateCheck = await Payment.findOne({
      productId: productCheck._id,
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

    // Save pending payment record FIRST to prevent inventory leak on crash
    const newPayment = new Payment({
      razorpayOrderId: "temp_" + crypto.randomUUID(), // Temp ID until Razorpay creates one
      productId: productCheck._id,
      productName: productCheck.name,
      amount: totalAmount,
      gstAmount,
      shippingAmount,
      quantity: qty,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      status: "pending",
      statusHistory: [{ status: "pending", reason: "Order initialized" }]
    });

    // Security: Atomically reserve stock and create payment inside a MongoDB Transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await newPayment.save({ session });
      tempPaymentId = newPayment._id.toString();

      const product = await Product.findOneAndUpdate(
        { _id: productId, quantity: { $gte: qty } },
        { $inc: { quantity: -qty } },
        { session, returnDocument: "after" }
      );

      if (!product) {
        throw new Error("Out of stock / Insufficient stock available");
      }
      
      await Payment.findByIdAndUpdate(tempPaymentId, { stockDeducted: true }, { session });
      reservedProduct = true;

      await session.commitTransaction();
    } catch (txError: any) {
      await session.abortTransaction();
      if (tempPaymentId) {
        await Payment.findByIdAndUpdate(tempPaymentId, {
          status: "failed",
          $push: { statusHistory: { status: "failed", reason: txError.message || "Transaction aborted" } }
        });
      }
      return res.status(409).json({ error: txError.message || "Transaction failed" });
    } finally {
      session.endSession();
    }

    // Create Razorpay Order
    const options = {
      amount: Math.round(totalAmount * 100), // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const rzpOrder = await razorpay.orders.create(options);

    // Update pending payment with actual Razorpay Order ID
    newPayment.razorpayOrderId = rzpOrder.id;
    await newPayment.save();

    res.json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      payment: newPayment,
    });
  } catch (error: any) {
    logger.error({ err: error }, "Error creating Razorpay order");
    // Release reserved stock on error
    if (reservedProduct && pId && qty > 0) {
      await Product.findByIdAndUpdate(pId, { $inc: { quantity: qty } });
    }
    if (tempPaymentId) {
      await Payment.findByIdAndUpdate(tempPaymentId, {
        status: "failed",
        $push: { statusHistory: { status: "failed", reason: "Razorpay order creation error" } }
      });
    }
    res.status(500).json({ error: "Failed to initiate payment", message: error.message });
  }
});

app.post("/api/payments/verify", async (req: express.Request, res: express.Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay payment parameters" });
    }

    // Verify signature using timing-safe buffer equal
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    const digestBuf = Buffer.from(digest, "hex");
    const sigBuf = Buffer.from(razorpay_signature, "hex");

    if (digestBuf.length === sigBuf.length && crypto.timingSafeEqual(digestBuf, sigBuf)) {
      const payment = await completePayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      res.json({ success: true, message: "Payment verified successfully", payment });
    } else {
      // Payment failed verification - restore reserved stock
      const failedPayment = await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id, status: "pending" },
        { status: "failed" }
      );
      if (failedPayment && failedPayment.productId) {
        await Product.findByIdAndUpdate(failedPayment.productId, { $inc: { quantity: failedPayment.quantity } });
      }
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
    if (!secret || secret === "your_razorpay_webhook_secret_here") {
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

    const digestBuf = Buffer.from(digest, "hex");
    const sigBuf = Buffer.from(signature, "hex");

    if (digestBuf.length !== sigBuf.length || !crypto.timingSafeEqual(digestBuf, sigBuf)) {
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    // Replay Attack Protection: Ensure the webhook event is not processed multiple times
    const eventId = req.body.id; // Corrected field mapping (Razorpay uses 'id')
    if (!eventId) {
      return res.status(400).json({ error: "Missing event ID" });
    }

    try {
      await ProcessedEvent.create({ eventId });
    } catch (err) {
      return res.status(200).json({ success: true, message: "Webhook event already processed" });
    }

    const event = req.body.event;
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = req.body.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      await completePayment(orderId, paymentId, signature);
    } else if (event === "payment.failed") {
      const paymentEntity = req.body.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      
      const failedPayment = await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId, status: "pending" },
        { status: "failed" }
      );
      if (failedPayment && failedPayment.productId) {
        await Product.findByIdAndUpdate(failedPayment.productId, { $inc: { quantity: failedPayment.quantity } });
      }
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
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
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
    const { status, trackingId, trackingUrl } = req.body;

    const allowedStatuses = ["pending", "paid", "failed", "processing", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status state transition" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid payment ID format" });
    }

    // FSM rules: define allowed next states
    const fsm: Record<string, string[]> = {
      pending: ["paid", "failed", "cancelled", "processing"],
      paid: ["pending", "processing", "cancelled", "shipped"],
      failed: ["pending", "cancelled"],
      processing: ["paid", "shipped", "cancelled", "delivered"],
      shipped: ["processing", "delivered", "cancelled"],
      delivered: ["shipped", "cancelled"],
      cancelled: ["pending", "paid", "processing"]
    };

    const originalPayment = await Payment.findById(id);
    if (!originalPayment) {
      return res.status(404).json({ error: "Transaction record not found" });
    }

    const currentStatus = originalPayment.status;
    if (!fsm[currentStatus]?.includes(status)) {
      return res.status(400).json({ error: `Invalid transition from ${currentStatus} to ${status}` });
    }

    // Transition status atomically
    const updateData: any = { 
      status, 
      $push: { statusHistory: { status, reason: "Admin updated status" } } 
    };

    if (trackingId !== undefined) updateData.trackingId = trackingId;
    if (trackingUrl !== undefined) updateData.trackingUrl = trackingUrl;

    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: id, status: currentStatus }, // Lock exactly the state we checked
      updateData,
      { returnDocument: "after" }
    );

    if (updatedPayment) {
      // If we transitioned to cancelled or refunded from a stock-deducted state
      const isStockDeductedState = ["pending", "paid", "processing", "shipped", "delivered"].includes(currentStatus);
      const isStockRefundState = ["cancelled", "failed"].includes(status);

      if (isStockDeductedState && isStockRefundState && updatedPayment.productId) {
        // Restore inventory stock atomically
        await Product.findByIdAndUpdate(updatedPayment.productId, {
          $inc: { quantity: updatedPayment.quantity }
        });
      }

      if (currentStatus === "paid" && status === "cancelled" && updatedPayment.razorpayPaymentId) {
        try {
          await razorpay.payments.refund(updatedPayment.razorpayPaymentId, {
            amount: updatedPayment.amount * 100 // Convert to paise
          });
          console.log(`[REFUND SUCCESS] Refunded ${updatedPayment.amount} for payment ${updatedPayment.razorpayPaymentId}`);
        } catch (err: any) {
          console.error("[REFUND FAILED] Failed to process Razorpay refund:", err);
          await Payment.findByIdAndUpdate(updatedPayment._id, {
            $push: { statusHistory: { status: "cancelled", reason: "Refund API call failed: " + err.message } }
          });
        }
      }

      if (status === "shipped" && !originalPayment.trackingEmailSentAt) {
        sendTrackingEmail(updatedPayment).then(async () => {
          await Payment.findByIdAndUpdate(id, { trackingEmailSentAt: new Date() });
        }).catch(err => {
          console.error("Failed to send tracking email:", err);
        });
      } else {
        // Send generic order status update email for other transitions (like processing, delivered, cancelled)
        if (["processing", "delivered", "cancelled"].includes(status)) {
          sendOrderStatusEmail(updatedPayment).catch(err => {
            console.error("Failed to send order status email:", err);
          });
        }
      }
    } else {
      return res.status(409).json({ error: "Status changed concurrently by another request" });
    }

    res.json({ success: true, payment: updatedPayment });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status", message: error.message });
  }
});


app.post("/api/admin/login", authLimiter, async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  let authenticated = false;

  // First try DB
  const admin = await Admin.findOne();
  if (admin && admin.passwordHash) {
    const parts = admin.passwordHash.split(".");
    if (parts.length === 2) {
      const [salt, actualHash] = parts;
      const inputHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
      const inputBuf = Buffer.from(inputHash, "hex");
      const actualBuf = Buffer.from(actualHash, "hex");

      if (inputBuf.length === actualBuf.length && crypto.timingSafeEqual(inputBuf, actualBuf)) {
        authenticated = true;
      }
    }
  } else {
    // Fallback to .env if DB not seeded
    const hashEnv = process.env.ADMIN_PASSWORD_HASH;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (hashEnv) {
      const parts = hashEnv.split(".");
      if (parts.length === 2) {
        const [salt, actualHash] = parts;
        const inputHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
        const inputBuf = Buffer.from(inputHash, "hex");
        const actualBuf = Buffer.from(actualHash, "hex");

        if (inputBuf.length === actualBuf.length && crypto.timingSafeEqual(inputBuf, actualBuf)) {
          authenticated = true;
        }
      }
    } else if (adminPassword) {
      const salt = crypto.createHash("sha256").update(JWT_SECRET).digest();
      const inputHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
      const actualHash = crypto.pbkdf2Sync(adminPassword, salt, 100000, 64, "sha512");

      if (inputHash.length === actualHash.length && crypto.timingSafeEqual(inputHash, actualHash)) {
        authenticated = true;
      }
    }
  }

  if (!authenticated) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { role: "admin", iat: Math.floor(Date.now() / 1000) },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  // Set as httpOnly cookie
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600 * 1000, // 1 hour
  });

  res.json({
    success: true,
    expiresIn: TOKEN_EXPIRY,
  });
});

app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  res.json({ success: true });
});

app.post("/api/admin/verify", authenticateAdmin, (req, res) => {
  res.json({ success: true });
});

app.post("/api/admin/forgot-password", passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      // Return generic success to avoid email enumeration
      return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    await PasswordResetToken.deleteMany({ email: admin.email }); // invalidate old tokens

    await PasswordResetToken.create({
      email: admin.email,
      tokenHash,
      expiresAt: new Date(Date.now() + 900000) // 15 mins
    });

    const origin = req.headers.origin || "http://localhost:5173";
    await sendPasswordResetEmail(admin.email, resetToken, origin);

    res.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

app.post("/api/admin/reset-password", passwordResetLimiter, async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: "Token and new password required" });
    if (newPassword.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetRecord = await PasswordResetToken.findOne({ tokenHash, usedAt: { $exists: false }, expiresAt: { $gt: new Date() } });

    if (!resetRecord) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(newPassword, salt, 100000, 64, "sha512").toString("hex");
    const passwordHash = `${salt}.${hash}`;

    await Admin.findOneAndUpdate({ email: resetRecord.email }, { passwordHash, passwordChangedAt: new Date() });
    
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err: any) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = ["disconnected", "connected", "connecting", "disconnecting"][dbState] || "unknown";
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      db: dbStatus
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
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

// Webhook endpoint for external Cron jobs (e.g. Vercel Cron) to run safely without memory leaks
app.post("/api/cron/recover-stock", async (req, res) => {
  try {
    const cronSecret = req.headers["x-cron-secret"];
    if (!process.env.CRON_SECRET || cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized cron request" });
    }

    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const expiredPayments = await Payment.find({
      status: "pending",
      createdAt: { $lt: fifteenMinsAgo }
    });

    let restoredCount = 0;
    for (const payment of expiredPayments) {
      // Transition status to failed atomically
      const updated = await Payment.findOneAndUpdate(
        { _id: payment._id, status: "pending" },
        { 
          status: "failed",
          $push: { statusHistory: { status: "failed", reason: "Cron abandoned cart cleanup" } }
        },
        { returnDocument: "after" }
      );

      if (updated && payment.productId && payment.stockDeducted) {
        // Restore stock
        await Product.findByIdAndUpdate(payment.productId, {
          $inc: { quantity: payment.quantity }
        });
        console.log(`[STOCK RELEASE] Restored ${payment.quantity} units for expired order ${payment.razorpayOrderId}`);
        restoredCount++;
      }
    }
    
    res.json({ success: true, message: `Restored ${restoredCount} abandoned carts.` });
  } catch (err: any) {
    console.error("Error in cron stock-release loop:", err);
    res.status(500).json({ error: "Cron execution failed", message: err.message });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}

export default app;
