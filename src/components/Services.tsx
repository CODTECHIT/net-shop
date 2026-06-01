import { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  ScrollText,
  Home,
  Building2,
  Zap,
  Car,
  Landmark,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const categories = [
  {
    id: "id-cards",
    title: "ID Cards",
    services: [
      "Aadhar Card",
      "PAN Card",
      "Voter ID Card",
      "Passport of India",
      "UDID Card",
      "Senior Citizen Card",
    ],
  },
  {
    id: "certificates",
    title: "Certificates",
    services: [
      "Ration Card",
      "Driving Licence",
      "Health Card",
      "Birth & Death Certificate",
      "Income Certificate",
      "Caste Certificate",
      "Police Clearance Certificate (PCC)",
    ],
  },
  {
    id: "property",
    title: "Property & Land",
    services: [
      "Adangal/ROR-1B",
      "Possession Certificate",
      "Manual Adangal",
      "Mutations of Passbook",
      "Pattadar Adhar Seeding",
      "Land Conversion",
      "Revenue Sub Division",
    ],
  },
  {
    id: "municipal",
    title: "Municipal",
    services: [
      "Property Tax",
      "New Assessment",
      "Revision Petition",
      "Title Transfer",
      "Water Tax",
    ],
  },
  {
    id: "apspdcl",
    title: "APSPDCL",
    services: [
      "Property/Tax/Water Payments",
      "New Customer Application",
      "Title Transfer",
      "Aadhar Deseeding",
      "Aadhar Seeding",
      "Current Bill Pay",
    ],
  },
  {
    id: "transport",
    title: "Transport",
    services: ["Slot Booking LLR", "Driving Licence", "Corrections & Address Change"],
  },
  {
    id: "register",
    title: "Register Office",
    services: [
      "Documents Registration",
      "Market Value Certificate",
      "Encumbrance Certificate",
      "Certified Copies",
      "Society Registration",
      "Firms Registration",
      "Hindu Marriage Certificate",
      "Special Marriage Registration",
      "E-Chits Registration",
      "Notary/Affidavits",
      "Reg Payments",
      "Slot Booking",
      "PM Kissan",
      "Labour Insurance",
      "All Types Insurance",
    ],
  },
];

export const allServices = categories.flatMap((category) =>
  category.services.map((service) => ({
    id: `${category.id}-${service.replace(/\s+/g, "-").toLowerCase()}`,
    title: service,
    category: category.title,
    iconId: category.id,
  })),
);

export const getIcon = (id: string, className: string = "w-8 h-8 text-[#38BDF8]") => {
  switch (id) {
    case "id-cards":
      return <FileText className={className} />;
    case "certificates":
      return <ScrollText className={className} />;
    case "property":
      return <Home className={className} />;
    case "municipal":
      return <Building2 className={className} />;
    case "apspdcl":
      return <Zap className={className} />;
    case "transport":
      return <Car className={className} />;
    case "register":
      return <Landmark className={className} />;
    default:
      return <FileText className={className} />;
  }
};

const categoryStyles: Record<string, { bg: string; iconBg: string; iconColor: string; textColor: string; hoverBorder: string }> = {
  "id-cards": {
    bg: "bg-[#EFF6FF]", // Blue
    iconBg: "bg-[#DBEAFE]",
    iconColor: "text-[#2563EB]",
    textColor: "text-[#1E40AF]",
    hoverBorder: "hover:border-[#2563EB]/30",
  },
  certificates: {
    bg: "bg-[#F5F3FF]", // Purple
    iconBg: "bg-[#EDE9FE]",
    iconColor: "text-[#7C3AED]",
    textColor: "text-[#5B21B6]",
    hoverBorder: "hover:border-[#7C3AED]/30",
  },
  property: {
    bg: "bg-[#ECFDF5]", // Emerald
    iconBg: "bg-[#D1FAE5]",
    iconColor: "text-[#10B981]",
    textColor: "text-[#065F46]",
    hoverBorder: "hover:border-[#10B981]/30",
  },
  municipal: {
    bg: "bg-[#FFF1F2]", // Rose
    iconBg: "bg-[#FFE4E6]",
    iconColor: "text-[#F43F5E]",
    textColor: "text-[#9F1239]",
    hoverBorder: "hover:border-[#F43F5E]/30",
  },
  apspdcl: {
    bg: "bg-[#FFFBEB]", // Amber
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-[#F59E0B]",
    textColor: "text-[#92400E]",
    hoverBorder: "hover:border-[#F59E0B]/30",
  },
  transport: {
    bg: "bg-[#F0FDFA]", // Teal
    iconBg: "bg-[#CCFBF1]",
    iconColor: "text-[#14B8A6]",
    textColor: "text-[#115E59]",
    hoverBorder: "hover:border-[#14B8A6]/30",
  },
  register: {
    bg: "bg-[#FDF4FF]", // Fuchsia
    iconBg: "bg-[#FAE8FF]",
    iconColor: "text-[#D946EF]",
    textColor: "text-[#701A75]",
    hoverBorder: "hover:border-[#D946EF]/30",
  },
};

export { categoryStyles };

export default function Services({ limit }: { limit?: number }) {
  const displayedServices = limit ? allServices.slice(0, limit) : allServices;

  return (
    <section
      id="services"
      className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-[#38BDF8] font-bold tracking-wider uppercase mb-2 text-fluid-sm">Our Services</h2>
          <h3 className="text-fluid-3xl lg:text-fluid-4xl font-extrabold text-[#0C1A2E] mb-4 sm:mb-6">
            Everything Handled Under One Roof
          </h3>
          <p className="text-gray-600 text-fluid-base max-w-2xl mx-auto px-4">
            We provide a comprehensive range of government and online services to simplify your
            life.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
          {displayedServices.map((service, index) => {
            const style = categoryStyles[service.iconId as keyof typeof categoryStyles] || categoryStyles["id-cards"];
            return (
              <motion.a
                href={`https://wa.me/919100080233?text=${encodeURIComponent(`Hi, I need help with ${service.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                key={service.id}
                className={`group p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-sm transition-all duration-300 flex items-start gap-3 sm:gap-5 border border-transparent ${style.bg} ${style.hoverBorder} hover:shadow-xl hover:-translate-y-1 cursor-pointer touch-target`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className={`shrink-0 mt-1 w-10 h-10 sm:w-12 sm:h-12 ${style.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center transition-colors duration-300 shadow-sm`}>
                  {getIcon(service.iconId, `w-5 h-5 sm:w-6 sm:h-6 ${style.iconColor}`)}
                </div>
                <div className="flex flex-col h-full min-w-0">
                  <h4 className={`text-lg sm:text-xl font-bold ${style.textColor} mb-1 sm:mb-2 truncate`}>
                    {service.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 leading-relaxed line-clamp-2 font-medium">
                    Professional assistance and fast processing for {service.title.toLowerCase()}.
                  </p>
                  <div className={`inline-flex items-center text-xs sm:text-sm font-bold ${style.iconColor} mt-auto w-fit group-hover:gap-2 transition-all`}>
                    Enquire on WhatsApp{" "}
                    <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          {limit && (
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0C1A2E] hover:bg-sky-900 text-white rounded-xl sm:rounded-lg font-bold text-base sm:text-lg transition-colors shadow-lg shadow-sky-900/20 touch-target"
            >
              Browse All Services <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}
          <a
            href="https://wa.me/919100080233?text=Hi,+I+need+help+choosing+a+service"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#25D366] hover:bg-[#20b858] text-white rounded-xl sm:rounded-lg font-bold text-base sm:text-lg transition-colors shadow-lg shadow-green-500/20 touch-target"
          >
            WhatsApp Us Directly <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
