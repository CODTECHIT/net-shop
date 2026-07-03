import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  tokenHash: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date },
  createdAt: { type: Date, default: Date.now, index: true },
});

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetToken =
  mongoose.models.PasswordResetToken ||
  mongoose.model("PasswordResetToken", passwordResetTokenSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 200, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  passwordChangedAt: { type: Date },
  phone: { type: String, required: true, maxlength: 20, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  passwordChangedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export async function seedAdmin() {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPasswordHash) {
      try {
        await Admin.create({
          email: adminEmail,
          passwordHash: adminPasswordHash
        });
        console.log("Admin user seeded from environment variables.");
      } catch (err) {
        console.error("Failed to seed admin:", err);
      }
    } else if (adminEmail && adminPassword) {
      // If only plain text password is provided, don't seed it yet, the index.ts generates a hash for them to copy
      console.warn("Please convert ADMIN_PASSWORD to ADMIN_PASSWORD_HASH in .env to seed the Admin user.");
    }
  }
}

let cachedConnection: typeof mongoose | null = null;

// Connect to MongoDB using cached connection instances for serverless environment support
export async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (mongoose.connection.readyState >= 1) {
    cachedConnection = mongoose;
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI is not defined in environment variables.");
    return;
  }

  try {
    cachedConnection = await mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    console.log("Connected to MongoDB (Cached pool initialized)");
    return cachedConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 200, trim: true },
  description: { type: String, maxlength: 2000, trim: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, default: 0, min: 0 }, // Changed to Number for numeric stock count
  imageUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

// Avoid OverwriteModelError in serverless environments
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// Payment Schema
const paymentSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true, unique: true, index: true },
  razorpayPaymentId: { type: String, index: true },
  razorpaySignature: { type: String },
  invoiceNumber: { type: String, unique: true, sparse: true, index: true },
  invoiceSentAt: { type: Date },
  trackingId: { type: String, index: true },
  trackingUrl: { type: String },
  trackingEmailSentAt: { type: Date },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", index: true },
  productName: { type: String, required: true, maxlength: 200 },
  amount: { type: Number, required: true, min: 0 },
  gstAmount: { type: Number, default: 0, min: 0 },
  shippingAmount: { type: Number, default: 0, min: 0 },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  customerName: { type: String, required: true, maxlength: 200, trim: true },
  customerEmail: { type: String, required: true, maxlength: 320, trim: true },
  customerPhone: { type: String, required: true, maxlength: 20, trim: true },
  shippingAddress: { type: String, required: true, maxlength: 1000, trim: true },
  status: {
    type: String,
    enum: [
      "pending",
      "paid",
      "failed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ],
    default: "pending",
    index: true,
  },
  statusHistory: [
    {
      status: { type: String, required: true },
      changedAt: { type: Date, default: Date.now },
      reason: { type: String },
    },
  ],
  stockDeducted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

// Compound indexes for common queries
paymentSchema.index({ productId: 1, customerEmail: 1, status: 1, createdAt: -1 });
paymentSchema.index({ customerEmail: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: 1 }); // Index for abandoned cart recovery

export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

// Processed Webhook Event Schema for Idempotency Replay Attack Protection (24-hour TTL)
const processedEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // Auto-expires after 24 hours (86400 seconds)
});

export const ProcessedEvent =
  mongoose.models.ProcessedEvent || mongoose.model("ProcessedEvent", processedEventSchema);
