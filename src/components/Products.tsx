import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: string;
  imageUrl: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch products from real backend API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Ensure data is array
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="products" className="py-24 bg-[#F0F9FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#38BDF8] font-bold tracking-wider uppercase mb-2">Our Products</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[#0C1A2E] mb-6">Physical Goods & Services</h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error || products.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-[#0C1A2E] mb-2">Products Coming Soon</h4>
            <p className="text-gray-500 mb-6">We are currently updating our inventory.</p>
            <a
              href="https://wa.me/919100080233?text=Hi,+I+want+to+enquire+about+your+products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#25D366] hover:bg-[#20b858] text-white rounded-lg font-bold transition-colors"
            >
              WhatsApp Us to Enquire
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0369A1] shadow-sm">
                    {product.quantity || 'Available'}
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-[#0C1A2E] mb-2 line-clamp-1">{product.name}</h4>
                  <div className="text-2xl font-extrabold text-[#38BDF8] mb-6">₹{product.price}</div>
                  
                  <a
                    href={`https://wa.me/919100080233?text=${encodeURIComponent(`Hi, I want to buy ${product.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-3 bg-[#0C1A2E] hover:bg-[#0369A1] text-white rounded-lg font-bold transition-colors"
                  >
                    Buy via WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
