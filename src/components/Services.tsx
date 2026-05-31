import { useState } from 'react';
import { 
  FileText, ScrollText, Home, Building2, Zap, 
  Car, Landmark, ArrowRight 
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const categories = [
  {
    id: "id-cards",
    title: "ID Cards",
    services: ["Aadhar Card", "PAN Card", "Voter ID Card", "Passport of India", "UDID Card", "Senior Citizen Card"]
  },
  {
    id: "certificates",
    title: "Certificates",
    services: ["Ration Card", "Driving Licence", "Health Card", "Birth & Death Certificate", "Income Certificate", "Caste Certificate", "Police Clearance Certificate (PCC)"]
  },
  {
    id: "property",
    title: "Property & Land",
    services: ["Adangal/ROR-1B", "Possession Certificate", "Manual Adangal", "Mutations of Passbook", "Pattadar Adhar Seeding", "Land Conversion", "Revenue Sub Division"]
  },
  {
    id: "municipal",
    title: "Municipal",
    services: ["Property Tax", "New Assessment", "Revision Petition", "Title Transfer", "Water Tax"]
  },
  {
    id: "apspdcl",
    title: "APSPDCL",
    services: ["Property/Tax/Water Payments", "New Customer Application", "Title Transfer", "Aadhar Deseeding", "Aadhar Seeding", "Current Bill Pay"]
  },
  {
    id: "transport",
    title: "Transport",
    services: ["Slot Booking LLR", "Driving Licence", "Corrections & Address Change"]
  },
  {
    id: "register",
    title: "Register Office",
    services: ["Documents Registration", "Market Value Certificate", "Encumbrance Certificate", "Certified Copies", "Society Registration", "Firms Registration", "Hindu Marriage Certificate", "Special Marriage Registration", "E-Chits Registration", "Notary/Affidavits", "Reg Payments", "Slot Booking", "PM Kissan", "Labour Insurance", "All Types Insurance"]
  }
];

// Flatten all services into a single list with category info
export const allServices = categories.flatMap(category => 
  category.services.map(service => ({
    id: `${category.id}-${service.replace(/\s+/g, '-').toLowerCase()}`,
    title: service,
    category: category.title,
    iconId: category.id
  }))
);

// Helper to get icon
export const getIcon = (id: string, className: string = "w-8 h-8 text-[#38BDF8]") => {
  switch (id) {
    case "id-cards": return <FileText className={className} />;
    case "certificates": return <ScrollText className={className} />;
    case "property": return <Home className={className} />;
    case "municipal": return <Building2 className={className} />;
    case "apspdcl": return <Zap className={className} />;
    case "transport": return <Car className={className} />;
    case "register": return <Landmark className={className} />;
    default: return <FileText className={className} />;
  }
};

export const cardStyles = [
  { bg: 'bg-blue-50/50 hover:bg-blue-50', border: 'border-blue-200/50 hover:border-blue-300', text: 'text-blue-900', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { bg: 'bg-purple-50/50 hover:bg-purple-50', border: 'border-purple-200/50 hover:border-purple-300', text: 'text-purple-900', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { bg: 'bg-emerald-50/50 hover:bg-emerald-50', border: 'border-emerald-200/50 hover:border-emerald-300', text: 'text-emerald-900', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { bg: 'bg-rose-50/50 hover:bg-rose-50', border: 'border-rose-200/50 hover:border-rose-300', text: 'text-rose-900', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
  { bg: 'bg-amber-50/50 hover:bg-amber-50', border: 'border-amber-200/50 hover:border-amber-300', text: 'text-amber-900', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { bg: 'bg-sky-50/50 hover:bg-sky-50', border: 'border-sky-200/50 hover:border-sky-300', text: 'text-sky-900', iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
  { bg: 'bg-indigo-50/50 hover:bg-indigo-50', border: 'border-indigo-200/50 hover:border-indigo-300', text: 'text-indigo-900', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { bg: 'bg-teal-50/50 hover:bg-teal-50', border: 'border-teal-200/50 hover:border-teal-300', text: 'text-teal-900', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' }
];

export default function Services({ limit }: { limit?: number }) {
  const displayedServices = limit ? allServices.slice(0, limit) : allServices;

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-40 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[#38BDF8] font-bold tracking-wider uppercase mb-2">Our Services</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[#0C1A2E] mb-6">Everything Handled Under One Roof</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We provide a comprehensive range of government and online services to simplify your life.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {displayedServices.map((service, index) => {
            const style = cardStyles[index % cardStyles.length];
            return (
              <a 
                href={`https://wa.me/919100080233?text=${encodeURIComponent(`Hi, I need help with ${service.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                key={service.id} 
                className={`group p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex items-start gap-5 border border-transparent ${style.bg} ${style.border} hover:-translate-y-1 cursor-pointer`}
              >
                <div className={`shrink-0 mt-1 ${style.iconBg} p-3 rounded-xl shadow-sm transition-colors duration-300 border border-white/50`}>
                  {getIcon(service.iconId, `w-7 h-7 ${style.iconColor}`)}
                </div>
                <div className="flex flex-col h-full">
                  <h4 className={`text-xl font-bold text-[#0C1A2E] mb-2 group-hover:${style.text} transition-colors duration-300`}>
                    {service.title}
                  </h4>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                    Professional assistance and fast processing for {service.title.toLowerCase()}.
                  </p>
                  <div className="inline-flex items-center text-sm font-bold text-[#0C1A2E] group-hover:text-[#38BDF8] transition-colors mt-auto w-fit">
                    Enquire on WhatsApp <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          {limit && (
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0C1A2E] hover:bg-sky-900 text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-sky-900/20"
            >
              Browse All Services <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          )}
          <a
            href="https://wa.me/919100080233?text=Hi,+I+need+help+choosing+a+service"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#25D366] hover:bg-[#20b858] text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-green-500/20"
          >
            WhatsApp Us Directly <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
