import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Lock, Mail, ArrowRight, UserPlus, Phone, User } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Account created successfully!");
        navigate({ to: "/login" });
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] relative flex items-center justify-center p-4 overflow-hidden py-12">
      <SEO 
        title="Register | Join Vayus Enterprises" 
        description="Create an account with Vayus Enterprises for fast, secure access to premium civic services and F Mart shopping." 
      />
      
      {/* Background decorations */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0A0F1C] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
            <UserPlus className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Create Account</h1>
          <p className="text-slate-400 text-sm font-medium">Join us for a premium shopping experience</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-400" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
              className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all text-sm font-semibold focus:bg-white/5"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all text-sm font-semibold focus:bg-white/5"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-400" /> Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="10 digit mobile number"
              className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all text-sm font-semibold focus:bg-white/5"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-sky-400" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="At least 8 characters"
              className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all text-sm font-semibold focus:bg-white/5"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-[0.98] mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                CREATE ACCOUNT <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm font-semibold text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
