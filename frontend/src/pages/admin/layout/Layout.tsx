import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./Navbar";
import AdminSidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;