import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Instagram, Youtube, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: '', phone: '', service: '', message: '' });
    } catch (error) {
      toast.error("Failed to send message. Please try WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0C1A2E] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#38BDF8] font-bold tracking-wider uppercase mb-2">Get In Touch</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-8">We're Here to Help</h3>
            
            <p className="text-sky-100/70 text-lg mb-12 max-w-md">
              Have a question about a service or need immediate assistance? Reach out to us through any of the channels below.
            </p>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#38BDF8]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Address</h4>
                  <p className="text-sky-100/70">Shop 2, Balaji Nagar, Kurnool, Andhra Pradesh</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#38BDF8]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Phone / WhatsApp</h4>
                  <a href="tel:919100080233" className="text-sky-100/70 hover:text-white transition-colors block">+91 91000 80233</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#38BDF8]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Email</h4>
                  <a href="mailto:vayusnetworks@gmail.com" className="text-sky-100/70 hover:text-white transition-colors block">vayusnetworks@gmail.com</a>
                </div>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="https://youtube.com/@vayusproductions" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-[#38BDF8] rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-[#38BDF8] rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-white/10"
          >
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-sky-100/70 mb-1">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-sky-100/70 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-sky-100/70 mb-1">Service Needed</label>
                <select 
                  id="service" 
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all appearance-none [&>option]:bg-[#0C1A2E]"
                >
                  <option value="" disabled>Select a category...</option>
                  <option value="ID & Govt Cards">ID & Govt Cards</option>
                  <option value="Certificates">Certificates</option>
                  <option value="Property & Land">Property & Land</option>
                  <option value="Municipal">Municipal</option>
                  <option value="APSPDCL">APSPDCL</option>
                  <option value="Transport">Transport</option>
                  <option value="Register Office">Register Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-sky-100/70 mb-1">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-4 bg-[#F59E0B] hover:bg-[#d97706] text-white rounded-lg font-bold text-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-lg shadow-amber-500/20"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Send Message <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
