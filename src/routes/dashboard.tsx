import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { User, Package, MapPin, Mail, Phone, Calendar, Clock, CreditCard, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import SEO from "@/components/SEO";
import { format } from "date-fns";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["userMe"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    },
    retry: false,
  });

  if (error) {
    navigate({ to: "/login" });
    return null;
  }

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { user, orders } = userData;

  return (
    <div className="min-h-screen bg-[#020617] relative p-4 md:p-8 overflow-hidden pt-24 md:pt-32">
      <SEO 
        title="Dashboard | Vayus Enterprises Client Portal" 
        description="View your active services, manage your account, and track your F Mart orders." 
      />
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4"
        >
          <div className="bg-[#0A0F1C] border border-white/10 rounded-[2rem] p-8 shadow-2xl sticky top-32">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
              <User className="w-10 h-10 text-sky-400" />
            </div>
            
            <div className="text-center mb-8 border-b border-white/10 pb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{user.name}</h2>
              <p className="text-sky-400 text-xs font-black uppercase tracking-widest">Customer</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-semibold text-white">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-sm font-semibold text-white">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Joined</p>
                  <p className="text-sm font-semibold text-white">{format(new Date(user.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 space-y-6"
        >
          <div className="bg-[#0A0F1C] border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Package className="w-6 h-6 text-sky-400" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Order History</h2>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/5">
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-semibold mb-6">You haven't placed any orders yet.</p>
                <button
                  onClick={() => navigate({ to: "/products" })}
                  className="bg-sky-500 hover:bg-sky-400 text-white font-black px-6 py-3 rounded-xl transition-all text-sm uppercase tracking-widest"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-black text-white text-lg uppercase">{order.productName}</h4>
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                            order.status === 'shipped' ? 'bg-sky-500/20 text-sky-400' :
                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">ID: {order._id}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xl font-black text-sky-400">₹{order.amount}</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Qty: {order.quantity}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-slate-300">
                          <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          <span>Ordered on: {format(new Date(order.createdAt), 'MMM dd, yyyy h:mm a')}</span>
                        </div>
                        <div className="flex items-start gap-2 text-slate-300">
                          <CreditCard className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          <span>Payment: {order.razorpayPaymentId || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-slate-300">
                          <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{order.shippingAddress}</span>
                        </div>
                        {order.trackingUrl && (
                          <div className="flex items-start gap-2 text-emerald-400 mt-2">
                            <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" />
                            <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="hover:underline font-semibold">
                              Track Package (ID: {order.trackingId})
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
