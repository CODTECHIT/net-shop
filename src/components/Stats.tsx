import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const statsData = [
    { label: "Services Available", target: 51, suffix: "+", animated: true },
    { label: "Happy Customers", target: 1000, suffix: "+", animated: true },
    { label: "Orders Delivered", target: 2500, suffix: "+", animated: true },
    { label: "Years Experience", target: null, suffix: "Est. 2025", animated: false },
  ];

  const [animatedValues, setAnimatedValues] = useState<(number | null)[]>(
    statsData.map((stat) => (stat.animated ? 0 : null)),
  );

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimatedValues((prev) => {
        return statsData.map((stat, index) => {
          if (!stat.animated) return prev[index];
          return Math.floor(progress * (stat.target || 0));
        });
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="w-full bg-[#0A0F1C] py-16 sm:py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Premium Background Elements - Hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-sky-500/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-blue-600/10 rounded-full blur-[80px] sm:blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="text-fluid-3xl lg:text-fluid-4xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight"
          >
            Our Impact in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Numbers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-xl mx-auto text-fluid-base px-4"
          >
            Delivering excellence and building trust within the Kurnool community
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className="group relative flex flex-col items-center justify-center text-center px-4 py-6 sm:px-6 sm:py-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl sm:rounded-[2rem] transition-all duration-500 backdrop-blur-md shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Card Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 sm:mb-3 tracking-tighter">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                  {stat.animated ? animatedValues[index] : ""}
                  {stat.suffix}
                </span>
              </div>

              <div className="text-sky-400 font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[9px] sm:text-[10px] md:text-xs mb-3 sm:mb-4">
                {stat.label}
              </div>

              {stat.animated && (
                <div className="relative w-10 sm:w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500"
                    initial={{ x: "-100%" }}
                    animate={isInView ? { x: "0%" } : { x: "-100%" }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: "circOut" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
