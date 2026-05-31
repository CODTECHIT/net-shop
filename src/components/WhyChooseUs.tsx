import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { CheckCircle2, Zap, MapPin, Lock, MessageCircle, PiggyBank } from 'lucide-react';

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const reasons = [
    { icon: <CheckCircle2 className="w-6 h-6" />, title: "51+ Services", desc: "Everything under one roof." },
    { icon: <Zap className="w-6 h-6" />, title: "Same Day Processing", desc: "Lightning fast execution." },
    { icon: <MapPin className="w-6 h-6" />, title: "Local to Kurnool", desc: "Deep local knowledge & connections." },
    { icon: <Lock className="w-6 h-6" />, title: "Safe & Confidential", desc: "Your documents are secure." },
    { icon: <MessageCircle className="w-6 h-6" />, title: "WhatsApp Support", desc: "Easy communication 9AM-9PM." },
    { icon: <PiggyBank className="w-6 h-6" />, title: "Affordable Pricing", desc: "No hidden charges ever." },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#38BDF8] font-bold tracking-wider uppercase mb-2">Why Choose Us</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[#0C1A2E] mb-6">The Best Choice in Kurnool</h3>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-6 rounded-xl bg-[#F8FAFC] hover:bg-[#F0F9FF] border border-gray-100 transition-colors"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-lg bg-[#0369A1] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#0C1A2E] mb-1">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
