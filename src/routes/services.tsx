import { createFileRoute } from "@tanstack/react-router";
import { categories, getIcon, categoryStyles } from "@/components/Services";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="pt-24 pb-24 bg-white min-h-screen relative overflow-hidden">
      <SEO
        title="Our Services — Government Certificates, ID Cards & Registrations | Vayu's Networks Kurnool"
        description="Explore our comprehensive list of online services in Kurnool. We assist with ID cards, birth/death certificates, land registration, municipal tax, transport applications, and more."
        keywords="online applications Kurnool, ID card correction, birth certificate online, land registration Kurnool, municipal services AP, APSPDCL electricity services"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-[#38BDF8] font-bold tracking-wider uppercase mb-3">All Services</h1>
          <h2 className="text-4xl md:text-6xl font-extrabold text-zinc-900 mb-6">
            Browse By Category
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-10">
            Find exactly what you need from our comprehensive list of professional services.
          </p>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {categories.map((category) => {
              const style = categoryStyles[category.id as keyof typeof categoryStyles] || categoryStyles["id-cards"];
              return (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className={`px-5 py-2.5 ${style.bg} border border-transparent rounded-full text-sm font-bold ${style.textColor} hover:shadow-md transition-all flex items-center gap-2`}
                >
                  {getIcon(category.id, `w-4 h-4 ${style.iconColor}`)}
                  {category.title}
                </a>
              );
            })}
          </div>
        </div>

        <div className="space-y-24">
          {categories.map((category, catIndex) => {
            const style = categoryStyles[category.id as keyof typeof categoryStyles] || categoryStyles["id-cards"];
            return (
              <div key={category.id} className="scroll-mt-32" id={category.id}>
                <div className="flex items-center gap-4 mb-10">
                  <div className={`w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                    {getIcon(category.id, `w-6 h-6 ${style.iconColor}`)}
                  </div>
                  <h3 className={`text-3xl font-bold ${style.textColor}`}>{category.title}</h3>
                  <div className="h-px bg-gray-100 flex-1 ml-4" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((serviceTitle, index) => (
                    <a
                      href={`https://wa.me/919100080233?text=${encodeURIComponent(`Hi, I need help with ${serviceTitle}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={serviceTitle}
                      className={`group p-6 rounded-[2rem] shadow-sm transition-all duration-300 flex flex-col ${style.bg} border border-transparent ${style.hoverBorder} hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`shrink-0 ${style.iconBg} p-3 rounded-xl transition-colors duration-300`}>
                          {getIcon(category.id, `w-6 h-6 ${style.iconColor}`)}
                        </div>
                        <h4 className={`text-lg font-bold ${style.textColor} transition-colors duration-300`}>
                          {serviceTitle}
                        </h4>
                      </div>

                      <p className="text-sm text-gray-500 mb-6 flex-1 font-medium">
                        Professional assistance and fast processing for {serviceTitle.toLowerCase()}.
                      </p>

                      <div className={`inline-flex items-center text-sm font-bold ${style.iconColor} mt-auto`}>
                        Enquire on WhatsApp{" "}
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
