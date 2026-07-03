import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { MapPin, Phone, Mail, Zap, ShieldCheck, HeartHandshake, Map } from "lucide-react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: <HeartHandshake className="w-8 h-8 text-sky-500" />,
      title: "Accessibility",
      desc: "Bringing complex government services to your doorstep.",
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: "Speed",
      desc: "Same-day processing for most applications.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: "Integrity",
      desc: "Transparent pricing with no hidden fees.",
    },
    {
      icon: <Map className="w-8 h-8 text-indigo-500" />,
      title: "Local Trust",
      desc: "Proudly serving the Kurnool community.",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-20 w-80 h-80 bg-sky-100 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-blue-100 rounded-full blur-[120px] opacity-15"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-[#0369A1] tracking-widest uppercase mb-3">
            Who We Are
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[#0C1A2E] mb-6">
            Your Trusted Partner in Kurnool
          </h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Vayus Enterprises
            was established in 2025 to bridge the gap between citizens and essential
            online services.
          </p>
        </div>

        <div ref={ref} className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Column - Values Grid */}
          <motion.div
            className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            {values.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <div className="mb-4">{item.icon}</div>
                <h4 className="text-xl font-bold text-[#0C1A2E] mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Contact Info */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              We simplify bureaucracy, handling your registrations, certificates, and payments so
              you can focus on what matters most. Our local expertise means faster, more reliable
              service for the Kurnool community.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#0369A1]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Visit Us</h4>
                  <p className="text-gray-600">Shop 2, Balaji Nagar, Kurnool, AP</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#0369A1]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Call Us</h4>
                  <a
                    href="tel:919100080233"
                    className="text-gray-600 hover:text-[#0369A1] transition-colors"
                  >
                    +91 91000 80233
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#0369A1]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email Us</h4>
                  <a
                    href="mailto:vayusnetworks@gmail.com"
                    className="text-gray-600 hover:text-[#0369A1] transition-colors"
                  >
                    vayusnetworks@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
