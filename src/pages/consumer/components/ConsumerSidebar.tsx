import { BarChart3, Book, FileText } from "lucide-react";
import { Link, useLocation } from "react-router";
import Logo from "../../../assets/Logo.png";
import { cn } from "../../../lib/utils";
import { useLanguage } from "../../organizer/components/LanguageContext";

export function ConsumerSidebar() {
  const { t } = useLanguage();
  const { pathname } = useLocation(); 

  const navigation = [
    { name: t.sidebar.myEvents, href: "/consumerCenter", icon: FileText },
    { name: t.sidebar.reports, href: "/consumerCenter/reports", icon: BarChart3 },
    { name: t.sidebar.terms, href: "/consumerCenter/policies", icon: Book },
  ];

  return (
    <nav className="w-64 bg-[#0a0a0a] min-h-screen">
      <div className="flex items-center gap-2 p-4">
          <img src={Logo} alt="Logo" className="h-12 w-13" />
        <span className="text-white text-lg font-medium">{t.sidebar.title}</span>
      </div>

      <div className="px-2 py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-white rounded-lg hover:bg-white/10",
                isActive && "bg-white/10",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
