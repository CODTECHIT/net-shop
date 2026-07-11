import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  ShoppingBag,
  MapPin,
  User,
  Mail,
  Phone,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";

declare global {
  interface Window {
    Razorpay: unknown;
  }
}

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number; // Represents available stock count
  imageUrl: string;
  description?: string;
  category?: string;
  images?: string[];
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // If null, checks out the entire cart
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

import { useCart } from "@/context/CartContext";

export default function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [step, setStep] = useState<"form" | "processing" | "success" | "error">("form");
  const [paymentId, setPaymentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: userData } = useQuery({
    queryKey: ["userMe"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    },
    retry: false,
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    }
  });

  // Reset form when modal closes or product changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setStep("form");
      setPaymentId("");
      setErrorMessage("");
      if (userData?.user) {
        setFormData((prev) => ({
          ...prev,
          name: userData.user.name || "",
          email: userData.user.email || "",
          phone: userData.user.phone || "",
        }));
      }
    }
  }, [isOpen, product, userData]);

  const checkoutItems = product 
    ? [{ productId: product._id, productName: product.name, price: product.price, quantity }]
    : cartItems.map(item => ({ 
        productId: item.product._id, 
        productName: item.product.name, 
        price: item.product.price, 
        quantity: item.quantity 
      }));

  if (checkoutItems.length === 0) return null;

  const subtotal = product ? product.price * quantity : cartTotal;
  let shippingAmount = 0;
  if (settings) {
    shippingAmount = settings.isFreeDelivery ? 0 : (subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryCharge);
  } else {
    shippingAmount = subtotal >= 1000 ? 0 : 50; // fallback
  }
  const totalAmount = subtotal + shippingAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const incrementQty = () => {
    if (product) setQuantity((q) => (q < product.quantity ? q + 1 : q));
  };
  const decrementQty = () => {
    if (product) setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "processing") return;

    // Basic validation
    if (!formData.name.trim()) return toast.error("Please enter your name");
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Please enter a valid email");
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      return toast.error("Please enter a valid 10-digit Indian mobile number");
    }
    if (!formData.address.trim()) return toast.error("Please enter shipping address");

    setStep("processing");

    try {
      // 1. Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setStep("form");
        setErrorMessage("Razorpay payment gateway failed to load. Check your internet connection.");
        toast.error("Failed to load Razorpay SDK");
        return;
      }

      // 2. Fetch Razorpay key ID from server
      const keyRes = await fetch("/api/payments/key");
      const { keyId } = await keyRes.json();
      if (!keyId) {
        setStep("form");
        setErrorMessage("Razorpay integration configuration is missing on the server.");
        toast.error("Gateway configuration error");
        return;
      }

      // 3. Create Order in backend
      const orderRes = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        setStep("form");
        setErrorMessage(orderData.error || "Failed to initiate transaction.");
        toast.error(orderData.error || "Order creation failed");
        return;
      }

      // 4. Trigger Razorpay Checkout
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Vayus Enterprises",
        description: `Order for ${checkoutItems.length} item(s)`,
        order_id: orderData.orderId,
        handler: async function (response: Record<string, string>) {
          // Trigger signature verification on backend
          setStep("processing");
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setStep("success");
              setPaymentId(verifyData.paymentId || response.razorpay_payment_id);
              if (!product) clearCart(); // Clear cart on successful order
            } else {
              setStep("error");
              setErrorMessage(verifyData.error || "Payment signature verification failed.");
              toast.error("Payment verification failed");
            }
          } catch (err) {
            setStep("error");
            setErrorMessage("Error verifying payment with server.");
            toast.error("Verification error");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#0ea5e9", // sky-500
        },
        modal: {
          ondismiss: function () {
            setStep("form");
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      console.error(err);
      setStep("form");
      setErrorMessage("An unexpected network error occurred.");
      toast.error("Checkout process failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto bg-[#0C1A2E] border-white/10 text-white rounded-[2rem] sm:rounded-[2.5rem] p-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8"
            >
              {/* Product Info / Summary Column */}
              <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">
                <div>
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-sky-450 text-sky-450" /> SECURE CHECKOUT
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 font-medium text-xs uppercase tracking-wider">
                      Purchase direct via Razorpay
                    </DialogDescription>
                  </DialogHeader>

                  <div className="bg-[#0A0F1C] p-4 rounded-3xl border border-white/5 flex flex-col gap-4">
                    {product ? (
                      <div className="flex gap-4 items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col flex-1 py-1 min-w-0">
                          <h4 className="font-bold text-white text-sm truncate leading-tight mb-1">{product.name}</h4>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="font-black text-sky-400">₹{product.price}</span>
                            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg p-1">
                              <button type="button" onClick={decrementQty} className="p-1 hover:bg-white/10 rounded-md text-white transition-colors cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                              <span className="text-sm font-bold w-4 text-center select-none text-white">{quantity}</span>
                              <button type="button" onClick={incrementQty} className="p-1 hover:bg-white/10 rounded-md text-white transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {cartItems.map((item) => (
                          <div key={item.product._id} className="flex gap-3 items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                            <img src={item.product.imageUrl} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                            <div className="flex-1 py-1 min-w-0">
                              <h4 className="text-sm font-bold text-white truncate leading-tight mb-1">{item.product.name}</h4>
                              <div className="flex justify-between items-center text-xs mt-1">
                                <span className="font-bold text-slate-400">Qty: {item.quantity}</span>
                                <span className="font-black text-sky-400">₹{item.product.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 space-y-2">
                  <div className="flex items-baseline justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-sm text-slate-400">
                    <span>Shipping</span>
                    <span>{shippingAmount === 0 ? "Free" : `₹${shippingAmount}`}</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-white/10 mt-2">
                    <span className="text-xs font-bold text-slate-400">Total Price</span>
                    <span className="text-xl sm:text-2xl font-black text-white">₹{totalAmount}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium pt-1">GST & transaction fees included</p>
                </div>
              </div>

              {/* Form Input Column */}
              <div className="md:col-span-7 space-y-4">
                <form onSubmit={handlePay} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-400" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. your name "
                      className="w-full bg-[#0A0F1C] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 transition-all text-sm font-semibold focus:bg-white/5 read-only:opacity-60 read-only:cursor-not-allowed"
                      required
                      readOnly={!!userData?.user}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-sky-400" /> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="recipient@domain.com"
                        className="w-full bg-[#0A0F1C] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 transition-all text-xs font-semibold focus:bg-white/5 read-only:opacity-60 read-only:cursor-not-allowed"
                        required
                        readOnly={!!userData?.user}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-sky-400" /> Contact Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Mobile Number"
                        className="w-full bg-[#0A0F1C] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 transition-all text-xs font-semibold focus:bg-white/5 read-only:opacity-60 read-only:cursor-not-allowed"
                        required
                        readOnly={!!userData?.user}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" /> Shipping Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street, City, Zipcode, State"
                      className="w-full bg-[#0A0F1C] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500/50 transition-all h-20 resize-none text-xs font-semibold leading-relaxed focus:bg-white/5"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-400 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-sky-500/10 active:scale-[0.98] mt-6"
                  >
                    <CreditCard className="w-4 h-4" /> PAY ₹{totalAmount}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 sm:p-16 flex flex-col items-center justify-center text-center gap-6"
            >
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-sky-405 animate-spin" />
              <div>
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">PROCESSING TRANSACTION</h3>
                <p className="text-slate-400 font-medium text-sm">Please do not refresh or close the modal window</p>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 sm:p-16 flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">ORDER PLACED SUCCESSFULLY!</h3>
                <p className="text-slate-400 text-sm font-medium mb-6">Payment verified and logged.</p>
                <div className="bg-[#0A0F1C] border border-white/5 rounded-2xl p-4 max-w-sm mx-auto text-left font-mono text-xs text-slate-350 space-y-2">
                  <div className="flex justify-between"><span className="text-slate-500">Items:</span> <span className="font-semibold text-white truncate max-w-[200px]">{product ? product.name : `${checkoutItems.length} items`}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Total Qty:</span> <span className="font-semibold text-white">{product ? quantity : checkoutItems.reduce((acc, item) => acc + item.quantity, 0)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Amount Paid:</span> <span className="font-semibold text-sky-400">₹{totalAmount}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Payment ID:</span> <span className="font-semibold text-white">{paymentId}</span></div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white text-[#020617] font-black px-8 py-3 rounded-xl hover:bg-slate-200 transition-all shadow-md active:scale-95 text-sm"
              >
                CLOSE WINDOW
              </button>
            </motion.div>
          )}

          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 sm:p-16 flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">TRANSACTION FAILED</h3>
                <p className="text-slate-400 text-sm font-medium mb-4">{errorMessage || "Verification could not be processed."}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep("form")}
                  className="bg-sky-500 text-white font-black px-6 py-3 rounded-xl hover:bg-sky-400 transition-all text-sm active:scale-95"
                >
                  TRY AGAIN
                </button>
                <button
                  onClick={onClose}
                  className="bg-[#0A0F1C] border border-white/10 text-slate-300 font-black px-6 py-3 rounded-xl hover:bg-white/5 transition-all text-sm active:scale-95"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
