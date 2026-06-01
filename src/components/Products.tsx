import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShoppingCart, ArrowRight } from "lucide-react";

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
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
    <section id="products" className="py-24 bg-white relative overflow-hidden">
      {/* Premium Background Decoration - Hidden on small screens for performance */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[120px] -z-0 opacity-50 hidden md:block" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -z-0 opacity-50 hidden md:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sky-500 font-bold tracking-[0.2em] uppercase mb-3 text-sm">Curated Selection</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0F1C] mb-6 tracking-tight">
            Physical Goods <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">& Services</span>
          </h3>
          <div className="w-24 h-1.5 bg-gradient-to-r from-sky-400 to-blue-600 mx-auto rounded-full" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 animate-pulse"
              >
                <div className="aspect-[4/5] bg-slate-100"></div>
                <div className="p-8 space-y-4">
                  <div className="h-8 bg-slate-100 rounded-xl w-3/4"></div>
                  <div className="h-6 bg-slate-100 rounded-lg w-1/4"></div>
                  <div className="h-14 bg-slate-100 rounded-2xl w-full mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error || products.length === 0 ? (
          <div className="text-center bg-white/50 backdrop-blur-xl p-16 rounded-[3rem] shadow-2xl border border-white max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-sky-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShoppingCart className="w-12 h-12 text-sky-200" />
            </div>
            <h4 className="text-2xl font-bold text-[#0A0F1C] mb-3">Inventory Update</h4>
            <p className="text-slate-500 mb-10 text-lg">We're handpicking the finest products for you. Stay tuned for our upcoming collection.</p>
            <a
              href="https://wa.me/919100080233?text=Hi,+I+want+to+enquire+about+your+products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-sky-200 hover:scale-105 active:scale-95"
            >
              Contact Support
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                className="group relative bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-50 overflow-hidden flex flex-col h-full touch-target"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {/* Image Container with More Compact Aspect Ratio */}
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  
                  {/* Premium Badge - Smaller */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-sky-600 shadow-lg border border-white/50">
                      {product.quantity || "In Stock"}
                    </div>
                  </div>

                  {/* Image Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Container - More Compact Padding */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-3">
                    <h4 className="text-lg font-bold text-[#0A0F1C] mb-0.5 group-hover:text-sky-600 transition-colors leading-tight line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Premium Selection</p>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mt-auto mb-6">
                    <span className="text-2xl font-black text-[#0A0F1C]">₹{product.price}</span>
                    <span className="text-slate-400 font-bold text-[10px] uppercase">INR</span>
                  </div>

                  <motion.a
                    href={`https://wa.me/919100080233?text=${encodeURIComponent(`Hi, I want to buy ${product.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={async () => {
                      try {
                        await fetch(`/api/products/${product._id}/click`, { method: "POST" });
                      } catch (err) {
                        console.error("Failed to track click:", err);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0A0F1C] hover:bg-sky-600 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-md group-hover:shadow-sky-100 active:scale-95"
                    whileTap={{ scale: 0.95 }}
                  >
                    Order on WhatsApp
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                </div>

                {/* Glass Glow Effect */}
                <div className="absolute -inset-px bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity rounded-[2rem]" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
