import { createFileRoute } from "@tanstack/react-router";
import { categories, getIcon, cardStyles } from "@/components/Services";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="pt-24 pb-24 bg-[#F8FAFC] min-h-screen relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/80 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50/80 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-[#38BDF8] font-bold tracking-wider uppercase mb-3">All Services</h1>
          <h2 className="text-4xl md:text-6xl font-extrabold text-[#0C1A2E] mb-6">Browse By Category</h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-10">
            Find exactly what you need from our comprehensive list of professional services.
          </p>

          {/* Quick Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {categories.map((category) => (
              <a 
                key={category.id}
                href={`#${category.id}`}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-bold text-[#0C1A2E] hover:border-[#38BDF8] hover:text-[#38BDF8] hover:shadow-md transition-all flex items-center gap-2"
              >
                {getIcon(category.id, "w-4 h-4")}
                {category.title}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-24">
          {categories.map((category, catIndex) => (
            <div key={category.id} className="scroll-mt-32" id={category.id}>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-[#0C1A2E] rounded-xl flex items-center justify-center shadow-lg">
                  {getIcon(category.id, "w-6 h-6 text-white")}
                </div>
                <h3 className="text-3xl font-bold text-[#0C1A2E]">{category.title}</h3>
                <div className="h-px bg-gray-200 flex-1 ml-4" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.services.map((serviceTitle, index) => {
                  // Generate a deterministic index for styling based on the string to keep it consistent
                  const styleIndex = (catIndex * 3 + index) % cardStyles.length;
                  const style = cardStyles[styleIndex];
                  
                  return (
                    <a 
                      href={`https://wa.me/919100080233?text=${encodeURIComponent(`Hi, I need help with ${serviceTitle}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={serviceTitle} 
                      className={`group p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col bg-white border border-gray-100 hover:border-transparent hover:-translate-y-1 cursor-pointer`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`shrink-0 ${style.iconBg} p-3 rounded-xl transition-colors duration-300`}>
                          {getIcon(category.id, `w-6 h-6 ${style.iconColor}`)}
                        </div>
                        <h4 className={`text-lg font-bold text-[#0C1A2E] group-hover:${style.text} transition-colors duration-300`}>
                          {serviceTitle}
                        </h4>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-6 flex-1">
                        Professional assistance and fast processing for {serviceTitle.toLowerCase()}.
                      </p>
                      
                      <div className={`inline-flex items-center text-sm font-bold ${style.text} mt-auto`}>
                        Enquire on WhatsApp <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
