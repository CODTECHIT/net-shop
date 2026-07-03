import { Home, LayoutGrid, ShoppingBag, User as UserIcon, Menu } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export default function MobileBottomNav({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();

  const { data: userData } = useQuery({
    queryKey: ["userMe"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    },
    retry: false,
  });

  const navItems = [
    { name: "Home", to: "/", icon: Home },
    { name: "Services", to: "/services", icon: LayoutGrid },
    { name: "F Mart", to: "/products", icon: ShoppingBag, isSpecial: true },
    { 
      name: userData?.user ? "Profile" : "Login", 
      to: userData?.user ? "/dashboard" : "/login", 
      icon: UserIcon 
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#020617]/90 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.to}
              className={`flex flex-col items-center justify-center w-16 gap-1 transition-all duration-300 ${
                isActive 
                  ? "text-sky-400" 
                  : item.isSpecial 
                    ? "text-amber-400" 
                    : "text-slate-400 hover:text-white"
              }`}
            >
              <div className={`relative ${isActive || item.isSpecial ? "scale-110" : ""} transition-transform duration-300`}>
                <Icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" : ""}`} />
                {item.isSpecial && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(244,63,94,0.8)]"></span>
                )}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? "opacity-100" : "opacity-70"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
        
        {/* Menu Toggle Button */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center w-16 gap-1 transition-all duration-300 text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">
            More
          </span>
        </button>
      </div>
    </div>
  );
}
