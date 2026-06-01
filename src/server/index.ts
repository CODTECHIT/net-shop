import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { connectDB, Product } from "./db.js";
import { uploadImage } from "./cloudinary.js";

dotenv.config();

export const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";
const TOKEN_EXPIRY = "1h";

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for easier deployment, or configure properly
}));

// CORS Configuration
app.use(cors({
  origin: true, // Allow all origins in production for simplicity, or set specific domain
  credentials: true,
}));

// Reduced Payload Limits to prevent DoS
app.use(express.json({ limit: "5mb" }));
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
    const products = await Product.find().sort({ createdAt: -1 });
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
      quantity,
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

app.post("/api/admin/login", authLimiter, (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
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
