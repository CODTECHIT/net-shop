import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

export const Route = createFileRoute("/admin/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error("Invalid or missing reset token");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setIsSuccess(true);
      toast.success(data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate({ to: "/admin/admin" });
      }, 3000);
      
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <SEO 
        title="Reset Password | Vayus Networks Admin"
        description="Set your new admin password"
      />
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl mx-auto flex items-center justify-center border border-white/10 mb-6 shadow-2xl backdrop-blur-xl"
          >
            <ShieldCheck className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-light mb-2">Reset Password</h1>
          <p className="text-gray-400">Create a new secure admin password</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {isSuccess ? (
            <div className="text-center">
              <p className="text-green-400 mb-6">Password updated successfully! Redirecting to login...</p>
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-white/50" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !token}
                className="w-full bg-white text-black font-medium py-4 rounded-2xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>

              <div className="text-center mt-6">
                <Link to="/admin/admin" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
