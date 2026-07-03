import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error("Invalid or missing reset token");
      navigate({ to: "/login" });
    }
  }, [navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return toast.error("Please fill all fields");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");

    setLoading(true);
    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Password updated successfully!");
        navigate({ to: "/login" });
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch (err) {
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#020617] relative flex items-center justify-center p-4 overflow-hidden">
      <SEO 
        title="Reset Password | Vayus Enterprises" 
        description="Recover access to your Vayus Enterprises account securely." 
      />
      
      {/* Background decorations */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0A0F1C] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
            <Lock className="w-8 h-8 text-sky-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">New Password</h1>
          <p className="text-slate-400 text-sm font-medium">Please enter your new password below</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-sky-400" /> New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all text-sm font-semibold focus:bg-white/5"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-sky-400" /> Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full bg-[#020617]/50 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 transition-all text-sm font-semibold focus:bg-white/5"
              required
              minLength={8}
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
                UPDATE PASSWORD <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
