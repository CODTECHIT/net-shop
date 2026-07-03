import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSent(true);
      } else {
        toast.error(data.error || "Failed to process request");
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
        title="Reset Password | Vayus Enterprises" 
        description="Recover access to your Vayus Enterprises account securely." 
      />
      
      {/* Background decorations */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0A0F1C] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="mb-6">
          <Link to="/login" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Reset Password</h1>
          <p className="text-slate-400 text-sm font-medium">
            {sent 
              ? "If an account exists, a reset link has been sent to your email. Please check your spam folder too."
              : "Enter your email to receive a password reset link."
            }
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleReset} className="space-y-5">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-[0.98] mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  SEND RESET LINK <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="text-sky-400 hover:text-sky-300 transition-colors font-bold text-sm uppercase tracking-wider"
            >
              Try another email address
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
