import { motion, useInView } from "motion/react";
import { useRef } from "react";

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    { num: "01", title: "WhatsApp Us", desc: "Send us a message with your requirement." },
    { num: "02", title: "Share Documents", desc: "Securely send the necessary papers online." },
    { num: "03", title: "We Process", desc: "Our experts handle the application & filing." },
    { num: "04", title: "Done!", desc: "Receive your certificate or confirmation." },
  ];

  return (
    <section className="py-24 bg-[#0C1A2E] text-white relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#0369A1] rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-[#0EA5E9] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#38BDF8] font-bold tracking-wider uppercase mb-2">How It Works</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold mb-6">4 Simple Steps</h3>
        </div>

        <div ref={ref} className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent border-t-2 border-dashed border-[#38BDF8]/50 opacity-50"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="w-24 h-24 rounded-full bg-[#0369A1] border-4 border-[#0C1A2E] flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform shadow-lg shadow-sky-900">
                  <span className="text-3xl font-extrabold text-[#38BDF8]">{step.num}</span>
                </div>
                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                <p className="text-sky-100/70">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
