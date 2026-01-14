import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./Navbar";
import AdminSidebar from "./Sidebar";

const AdminLayout: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-[100dvh] bg-gray-50 flex flex-col overflow-hidden overscroll-none">
      <AdminNavbar onMenuToggle={() => { }} />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar (fixed in place, never scrolls with page) */}
        <div className="bg-white">
          <AdminSidebar />
        </div>

        {/* Main content scrolls independently */}
        <div className="flex-1 flex flex-col min-h-0">
          <main
            ref={mainRef}
            className="flex-1 overflow-y-auto overscroll-contain p-2 md:p-6 pb-[env(safe-area-inset-bottom)]"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
