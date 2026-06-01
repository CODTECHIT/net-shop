import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { CheckCircle2, Zap, MapPin, Lock, MessageCircle, PiggyBank } from "lucide-react";

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const reasons = [
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "51+ Services",
      desc: "Everything under one roof.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Same Day Processing",
      desc: "Lightning fast execution.",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Local to Kurnool",
      desc: "Deep local knowledge & connections.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Safe & Confidential",
      desc: "Your documents are secure.",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp Support",
      desc: "Easy communication 9AM-9PM.",
    },
    {
      icon: <PiggyBank className="w-6 h-6" />,
      title: "Affordable Pricing",
      desc: "No hidden charges ever.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-sky-100 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-100 rounded-full blur-[100px] opacity-15"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#38BDF8] font-bold tracking-wider uppercase mb-2">Why Choose Us</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[#0C1A2E] mb-6">
            The Best Choice in Kurnool
          </h3>
          <p className="text-gray-600">
            We combine local expertise with modern efficiency to deliver exceptional service.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-8 rounded-2xl bg-white hover:bg-slate-50 border border-gray-100 transition-all duration-300 hover:shadow-lg group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#0369A1] text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:bg-sky-600 transition-colors">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#0C1A2E] mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
