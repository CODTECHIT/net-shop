import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { connectDB, Product } from './db';
import { uploadImage } from './cloudinary';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

// Connect to MongoDB
connectDB();

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, quantity, adminPassword } = req.body;
    
    // Simple admin auth check
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    // Upload to Cloudinary
    const imageUrl = await uploadImage(dataURI);

    // Save to MongoDB
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      quantity,
      imageUrl
    });

    await newProduct.save();
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
