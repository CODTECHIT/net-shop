import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Star, CheckCircle2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Hero() {
  return (
    <section 
      id="home" 
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#0A0F1C]"
    >
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-sky-600/30 blur-[150px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-16 pt-24 pb-20">
        
        {/* Left Content - Typography & CTA */}
        <motion.div 
          className="lg:w-[55%] flex flex-col items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sky-300 text-sm font-semibold mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(14,165,233,0.15)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
            Premium Civic-Tech Services in Kurnool
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Simplify Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              Civic Needs.
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 mb-10 max-w-lg font-medium leading-relaxed">
            Your one-stop premium destination for government certificates, property documents, utility payments, and transport services. Handled with absolute speed and integrity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link 
              to="/services"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(14,165,233,0.4)] hover:shadow-[0_0_60px_rgba(14,165,233,0.6)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Explore Services
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <a 
              href="https://wa.me/919100080233?text=Hi,+I+need+your+services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-md"
            >
              WhatsApp Us
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center gap-6 text-sm font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              100% Secure
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Fast Processing
            </div>
          </div>
        </motion.div>

        {/* Right Content - Floating Glassmorphic Bento Grid */}
        <div className="lg:w-[45%] relative w-full h-[500px] hidden md:block perspective-1000">
          
          {/* Main Large Card */}
          <motion.div 
            className="absolute top-0 right-10 w-72 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
            initial={{ opacity: 0, y: 50, rotateX: 10, rotateY: -15 }}
            animate={{ 
              opacity: 1, 
              y: [0, -15, 0], 
              rotateX: [10, 15, 10], 
              rotateY: [-15, -10, -15] 
            }}
            transition={{ 
              opacity: { duration: 1 },
              default: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl mb-6 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Verified Documents</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Authentic processing for all your sensitive government and property documentation needs.</p>
          </motion.div>

          {/* Small Floating Card 1 */}
          <motion.div 
            className="absolute top-40 left-0 w-56 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-5 shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: 1, 
              y: [0, 20, 0]
            }}
            transition={{ 
              opacity: { duration: 1, delay: 0.2 },
              default: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
              </div>
              <div>
                <div className="text-white font-bold">4.9/5 Rating</div>
                <div className="text-slate-400 text-xs">Based on 500+ reviews</div>
              </div>
            </div>
          </motion.div>

          {/* Small Floating Card 2 */}
          <motion.div 
            className="absolute bottom-10 right-0 w-64 bg-[#0C1A2E]/80 backdrop-blur-xl border border-sky-500/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(14,165,233,0.15)]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              y: [0, -10, 0]
            }}
            transition={{ 
              opacity: { duration: 1, delay: 0.4 },
              default: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sky-400 font-bold text-sm uppercase tracking-wider">Live Status</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 w-3/4"></div>
              </div>
              <div className="h-2 w-4/5 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 w-1/2"></div>
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400 font-medium">Processing 24+ applications today</div>
          </motion.div>

        </div>
      </div>

      {/* Seamless Gradient Transition into Stats Section */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0369A1] pointer-events-none z-20"></div>
    </section>
  );
}
