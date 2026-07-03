import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Lock, Mail, ArrowRight, UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import SEO from "@/components/SEO";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Logged in successfully!");
        queryClient.invalidateQueries({ queryKey: ["userMe"] });
        navigate({ to: "/dashboard" });
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] relative flex items-center justify-center p-4 overflow-hidden">
      <SEO 
        title="Login | Vayus Enterprises Client Portal" 
        description="Securely login to your Vayus Enterprises account to track service requests and manage your F Mart orders." 
      />
      
      {/* Background decorations */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0A0F1C] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
            <Lock className="w-8 h-8 text-sky-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Welcome Back</h1>
          <p className="text-slate-400 text-sm font-medium">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all text-sm font-semibold focus:bg-white/5"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-400" /> Password
              </label>
              <Link to="/forgot-password" className="text-[10px] text-sky-400 hover:text-sky-300 font-bold uppercase tracking-wider transition-colors">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all text-sm font-semibold focus:bg-white/5"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 active:scale-[0.98] mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                SIGN IN <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm font-semibold text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1">
              Create one now <UserPlus className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
