import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navItems } from "@/constants/admin-nav";

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r border-gray-200 flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Navigation - fixed, no scroll */}
        <nav className="flex-1 px-2 py-4 space-y-1">
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