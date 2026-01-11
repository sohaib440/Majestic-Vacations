import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  FileText,
  Globe,
  MessageSquare,
  Hotel,
  MapPin,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: Home },
  { name: "Packages", path: "/admin/packages", icon: Package },
  { name: "Inquiry", path: "/admin/inquiry", icon: HelpCircle  },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Bookings", path: "/admin/bookings", icon: FileText },
  { name: "Payments", path: "/admin/payments", icon: CreditCard },
  { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquare },

];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent border-l-4 border-accent"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;