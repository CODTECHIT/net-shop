import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, ShoppingCart, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  images?: string[];
}

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onBuyNow: (product: Product) => void;
}

export default function ProductViewModal({ isOpen, onClose, product, onBuyNow }: ProductViewModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const { addToCart } = useCart();

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const shareProduct = async () => {
    const url = window.location.href; // In a real app, this might be a specific product route
    const text = `Check out ${product.name} at F Mart!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'F Mart', text, url });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogOverlay onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
              <X className="w-5 h-5 text-slate-600" />
            </button>

            {/* Images Section */}
            <div className="w-full md:w-1/2 p-6 flex flex-col gap-4">
              <div 
                className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img 
                  src={images[activeImageIndex]} 
                  alt={product.name} 
                  className={`w-full h-full object-contain transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`} 
                />
                
                {/* Zoomed Image */}
                {isZoomed && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${images[activeImageIndex]})`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundSize: '200%',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                )}

                {/* Arrows */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2 px-1 snap-x">
                  {images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImageIndex(i)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImageIndex === i ? 'border-sky-500' : 'border-transparent hover:border-slate-300'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <div className="mb-6">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h2 className="text-3xl font-black text-slate-900 uppercase leading-tight">{product.name}</h2>
                  <button onClick={shareProduct} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition shrink-0" title="Share Product">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-black text-rose-600">₹{product.price}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                {product.description && (
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-widest">Description</h4>
                    <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{product.description}</p>
                  </div>
                )}
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.quantity <= 0}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" /> ADD TO CART
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onBuyNow(product);
                  }}
                  disabled={product.quantity <= 0}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-lg shadow-rose-500/20"
                >
                  <ShoppingBag className="w-5 h-5" /> BUY NOW
                </button>
              </div>
            </div>
          </motion.div>
        </DialogOverlay>
      )}
    </AnimatePresence>
  );
}

function DialogOverlay({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
    >
      {children}
    </motion.div>
  );
}
