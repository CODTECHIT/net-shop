import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { 
  ShieldCheck, 
  LogIn, 
  Upload, 
  Plus, 
  Image as ImageIcon, 
  Loader2, 
  X, 
  LayoutDashboard, 
  Package, 
  MousePointer2, 
  Trash2,
  ExternalLink,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

const TOKEN_KEY = "vn_admin_token";

export const Route = createFileRoute("/admin/admin")({
  component: AdminPage,
});

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: string;
  imageUrl: string;
  clicks: number;
  createdAt: string;
}

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "1",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setIsVerifying(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const verifyToken = async (storedToken: string) => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
        },
      });
      if (res.ok) {
        setToken(storedToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      }
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        localStorage.setItem(TOKEN_KEY, data.token);
        setPassword("");
        toast.success("Welcome to Admin Hub");
      } else {
        toast.error(data.error || "Invalid password");
      }
    } catch (err) {
      toast.error("Server connection failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    toast.info("Session closed");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Product removed");
        setProducts(products.filter(p => p._id !== id));
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      toast.error("Error deleting product");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !token) return;

    setIsSubmitting(true);
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("quantity", formData.quantity);
    form.append("image", imageFile);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: form,
      });

      if (res.ok) {
        toast.success("Product published");
        setFormData({ name: "", description: "", price: "", quantity: "1" });
        setImageFile(null);
        setImagePreview(null);
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Publish failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex items-center justify-center">
        <SEO title="Admin Dashboard | Vayu's Networks" description="Authorized personnel access only." robots="noindex, nofollow" />
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex items-center justify-center p-4">
        <SEO title="Admin Dashboard | Vayu's Networks" description="Authorized personnel access only." robots="noindex, nofollow" />
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f172a] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent pointer-events-none" />
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-sky-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-sky-500/20">
                <ShieldCheck className="w-10 h-10 text-sky-400" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">ADMIN HUB</h1>
              <p className="text-slate-400 mb-8 font-medium">Restricted Access Control</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  placeholder="Master Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-center tracking-[0.5em] font-bold"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-white text-[#020617] font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-sky-400 hover:text-white disabled:opacity-50 shadow-xl shadow-sky-500/10 cursor-pointer"
                >
                  {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : "AUTHENTICATE"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#020617] text-slate-200 overflow-hidden flex flex-col font-sans">
      <SEO title="Admin Dashboard | Vayu's Networks" description="Authorized personnel access only." robots="noindex, nofollow" />
      {/* Sidebar-style Top Header */}
      <header className="h-20 bg-[#0f172a] border-b border-white/5 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">Admin Console</h1>
            <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">Vayu's Networks Hub</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="/" target="_blank" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" /> View Site
          </a>
          <button 
            onClick={handleLogout}
            className="bg-white/5 hover:bg-red-500/10 hover:text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/5 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="xl:col-span-4 space-y-8">
            <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl" />
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <Plus className="w-6 h-6 text-sky-400" /> NEW PRODUCT
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#020617] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-sky-500/50 transition-all font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#020617] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-sky-500/50 transition-all h-28 resize-none font-medium text-sm leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-2">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-[#020617] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-sky-500/50 transition-all font-black text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-2">Unit/Qty</label>
                    <input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full bg-[#020617] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-sky-500/50 transition-all font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-2">Visual Asset</label>
                  <div className="relative aspect-video rounded-2xl bg-[#020617] border-2 border-dashed border-white/5 flex flex-col items-center justify-center overflow-hidden group hover:border-sky-500/30 transition-all">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white text-black px-4 py-2 rounded-xl font-bold text-xs">REPLACE IMAGE</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                        <p className="text-[10px] font-bold text-slate-500">UPLOAD 1:1 OR 4:5 IMAGE</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" required={!imagePreview} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-sky-500/10 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Plus className="w-5 h-5" /> PUBLISH PRODUCT</>}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Inventory & Analytics */}
          <div className="xl:col-span-8 space-y-8">
            <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col h-full">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-transparent to-white/[0.02]">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Package className="w-6 h-6 text-sky-400" /> LIVE INVENTORY
                </h2>
                <div className="px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full">
                  <span className="text-sky-400 text-xs font-black tracking-widest">{products.length} ITEMS TOTAL</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar min-h-[600px]">
                {isLoadingProducts ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                    <p className="text-xs font-black text-slate-600 tracking-[0.2em]">SYNCING DATA...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-20">
                    <Package className="w-16 h-16 text-slate-800 mx-auto mb-4 opacity-50" />
                    <p className="text-slate-500 font-bold">No products found in database</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {products.map((product) => (
                        <motion.div
                          key={product._id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-[#020617] rounded-3xl p-5 border border-white/5 group hover:border-sky-500/30 transition-all flex gap-5 relative"
                        >
                          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-900 border border-white/5">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-black text-white truncate text-lg uppercase tracking-tight">{product.name}</h3>
                              <button 
                                onClick={() => handleDeleteProduct(product._id)}
                                className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-auto">
                              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                <MousePointer2 className="w-3.5 h-3.5 text-sky-400" />
                                <span className="text-lg font-black text-white">{product.clicks}</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Clicks</span>
                              </div>
                              <div className="text-xl font-black text-sky-400">₹{product.price}</div>
                            </div>
                          </div>

                          {/* Hover Overlay Stats */}
                          <div className="absolute top-4 right-12 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{product.quantity}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
