import mongoose from 'mongoose';

// Connect to MongoDB
export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI is not defined in environment variables.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Avoid OverwriteModelError in serverless environments
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
