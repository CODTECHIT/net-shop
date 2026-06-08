import mongoose from "mongoose";

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
  createdAt: { type: Date, default: Date.now, index: true },
});

// Avoid OverwriteModelError in serverless environments
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// Payment Schema
const paymentSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true, unique: true, index: true },
  razorpayPaymentId: { type: String, index: true },
  razorpaySignature: { type: String },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", index: true },
  productName: { type: String, required: true, maxlength: 200 },
  amount: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  customerName: { type: String, required: true, maxlength: 200, trim: true },
  customerEmail: { type: String, required: true, maxlength: 320, trim: true },
  customerPhone: { type: String, required: true, maxlength: 20, trim: true },
  shippingAddress: { type: String, required: true, maxlength: 1000, trim: true },
  status: { 
    type: String, 
    enum: ["pending", "paid", "failed", "processing", "shipped", "delivered", "refund_processing", "refunded", "cancelled"], 
    default: "pending",
    index: true 
  },
  statusHistory: [{
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    reason: { type: String }
  }],
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
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-expires after 24 hours (86400 seconds)
});

export const ProcessedEvent = mongoose.models.ProcessedEvent || mongoose.model("ProcessedEvent", processedEventSchema);


