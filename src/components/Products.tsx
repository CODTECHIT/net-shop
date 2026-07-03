import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShoppingCart, ShoppingBag, Search, Sparkles, MapPin, Tag } from "lucide-react";
import CheckoutModal from "./CheckoutModal";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number; // Represents available stock count
  imageUrl: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: userData } = useQuery({
    queryKey: ["userMe"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    },
    retry: false,
  });

  useEffect(() => {
    // Fetch products from backend API
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

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch;
  });

  return (
    <section id="products" className="py-24 bg-gradient-to-tr from-rose-50/30 via-emerald-50/20 to-amber-50/30 relative overflow-hidden">
      {/* Background Decoration glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-[120px] -z-0 pointer-events-none hidden md:block" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] -z-0 pointer-events-none hidden md:block" />
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-[130px] -z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* F Mart Hero Banner */}
        <div className="bg-white/80 backdrop-blur-xl text-slate-800 rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden border border-slate-200/65 shadow-lg">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-200/10 rounded-full blur-[80px] -z-0 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-200/10 rounded-full blur-[80px] -z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              {/* Logo Frame */}
              <div className="relative shrink-0">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-rose-450 via-amber-400 to-emerald-400 rounded-full blur opacity-40 animate-pulse" />
                <img
                  src="/fmart.jpeg"
                  alt="F Mart Logo"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white relative z-10 shadow-md"
                />
              </div>
              <div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                  <h3 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
                    Family MART
                  </h3>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Official E-Store
                  </span>
                </div>
                <p className="text-slate-600 font-medium text-sm max-w-xl">
                  Welcome to Vayus Enterprises
                  premium shopping experience. Quality products delivered directly to your doorstep with guaranteed savings.
                </p>
              </div>
            </div>

            {/* Slogan Badges */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0 justify-center">
              <div className="bg-white border border-rose-100 px-5 py-3 rounded-2xl flex items-center gap-3.5 shadow-sm flex-1 sm:flex-initial">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 shrink-0">
                  <MapPin className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Door Delivery</p>
                  <p className="text-xs font-black text-rose-700 uppercase tracking-tight">With Lowest Cost</p>
                </div>
              </div>

              <div className="bg-white border border-emerald-100 px-5 py-3 rounded-2xl flex items-center gap-3.5 shadow-sm flex-1 sm:flex-initial">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 shrink-0">
                  <Tag className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Offers Applicable</p>
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-tight">For Next Orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="mb-12 max-w-md mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-300 via-amber-300 to-emerald-300 rounded-2xl blur-md opacity-30 group-focus-within:opacity-50 transition-opacity duration-300" />
            <div className="relative bg-white border border-slate-200 rounded-2xl flex items-center px-4 py-3 shadow-sm group-focus-within:border-rose-500/30 group-focus-within:shadow-md transition-all duration-300">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Search F Mart products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-sm font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-wider"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[2rem] overflow-hidden shadow-md border border-slate-100 animate-pulse"
              >
                <div className="aspect-square bg-slate-100"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-100 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-1/4"></div>
                  <div className="h-12 bg-slate-100 rounded-xl w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error || products.length === 0 ? (
          <div className="text-center bg-white/70 backdrop-blur-xl p-16 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-rose-100">
              <ShoppingCart className="w-10 h-10 text-rose-350" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Inventory Syncing</h4>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">We are updating the F Mart product catalogs. Check back soon for exciting launches!</p>
            <a
              href="https://wa.me/919100080233?text=Hi,+I+want+to+enquire+about+F+Mart+products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-105 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
            >
              Contact Support
            </a>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-100 max-w-md mx-auto shadow-sm">
            <Search className="w-10 h-10 text-slate-350 mx-auto mb-3" />
            <p className="text-slate-500 font-bold text-sm">No products found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                className="group relative bg-white/95 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Stock Level Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className={`backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md border ${product.quantity <= 0
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "bg-emerald-50 border-emerald-200 text-emerald-600"
                      }`}>
                      {product.quantity <= 0 ? "Sold Out" : `${product.quantity} In Stock`}
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h4 className="text-base font-bold text-slate-800 mb-1 group-hover:text-rose-500 transition-colors leading-tight line-clamp-1 uppercase">
                      {product.name}
                    </h4>
                    <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider">F Mart Guaranteed</p>
                  </div>

                  <div className="flex items-baseline gap-1 mt-auto mb-6">
                    <span className="text-xl font-black text-slate-900 font-display">₹{product.price}</span>
                    <span className="text-slate-400 font-bold text-[9px] uppercase">INR</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full mt-auto">
                    <button
                      onClick={async () => {
                        if (product.quantity <= 0) return;
                        if (!userData?.user) {
                          navigate({ to: "/login" });
                          return;
                        }
                        try {
                          await fetch(`/api/products/${product._id}/click`, { method: "POST" });
                        } catch (err) {
                          console.error("Failed to track click:", err);
                        }
                        setSelectedProduct(product);
                        setIsCheckoutOpen(true);
                      }}
                      disabled={product.quantity <= 0}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm cursor-pointer active:scale-95 ${product.quantity <= 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
                        : "bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-605 text-white shadow-md shadow-rose-500/10"
                        }`}
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      {product.quantity <= 0 ? "Out of Stock" : "Buy Now"}
                    </button>
                    <a
                      href={`https://wa.me/919100080233?text=${encodeURIComponent(`Hi, I want to purchase ${product.name} from F Mart`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-3 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 text-emerald-600 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shrink-0 active:scale-95"
                      title="Order on WhatsApp"
                    >
                      <svg className="w-4 h-4 fill-emerald-500" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Subtle Glow Overlay */}
                <div className="absolute -inset-px bg-gradient-to-tr from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 rounded-[2rem]" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </section>
  );
}
