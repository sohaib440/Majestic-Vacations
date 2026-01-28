import { Home, Package, Users, HelpCircle, FileText, MessageSquare, Briefcase } from "lucide-react";
import React from "react";

// Define nav items interface
export interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Define nav items in one place (used by both Sidebar and Navbar)
export const navItems: NavItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: Home },
  { name: "Packages", path: "/admin/packages", icon: Package },
  { name: "Inquiry Packages", path: "/admin/inquiry-packages", icon: Briefcase },
  { name: "Rental Inquiries", path: "/admin/rental-inquiries", icon: HelpCircle },
  { name: "Inquiry", path: "/admin/inquiry", icon: HelpCircle },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Bookings", path: "/admin/bookings", icon: FileText },
  { name: "Testimonials", path: "/admin/testimonial", icon: MessageSquare },
];
