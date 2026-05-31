import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  // Define stats: [label, targetValue, suffix, isAnimated]
  const statsData = [
    { label: "Services", target: 51, suffix: "+", animated: true },
    { label: "Customers", target: 1000, suffix: "+", animated: true },
    { label: "Year Established", target: 2025, suffix: "", animated: true },
    { label: "Operating Hours", target: null, suffix: "9AM-9PM", animated: false }
  ];

  // State for current animated values
  const [animatedValues, setAnimatedValues] = useState(
    statsData.map(stat => (stat.animated ? 0 : null))
  );

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimatedValues(prev => {
        // We need to map over statsData and compute the current value for each animated stat
        return statsData.map((stat, index) => {
          if (!stat.animated) return prev[index]; // keep the previous value (which is null for non-animated)
          return Math.floor(progress * stat.target);
        });
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInView]);

  return (
    <section ref={ref} className="w-full bg-[#0369A1] py-12 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/20">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">
                {stat.animated ? animatedValues[index] : ''}{stat.suffix}
              </div>
              <div className="text-sky-200 font-medium uppercase tracking-wider text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}