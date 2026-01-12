// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Testimonials from "./pages/Testimonials";
import Dubai from "./pages/destinations/Dubai";
import Turkey from "./pages/destinations/Turkey";
import Greece from "./pages/destinations/Greece";
import Thailand from "./pages/destinations/Thailand";
import Indonesia from "./pages/destinations/Indonesia";
import NotFound from "./pages/NotFound";
import Package from "./pages/Package/page";
import Login from "./pages/auth/Login";
import AdminLayout from "./pages/admin/layout/Layout";
import Dashboard from "./pages/admin/dashboard/page";
import Packages from "./pages/admin/pakages/page";
import ProtectedRoute from "./protectedRoute";
import CreatePackage from "@/pages/admin/pakages/create/page";
import EditPackage from "@/pages/admin/pakages/[id]/edit/page";
import PublicTourPage from "@/pages/Package/[id]/page";
import AdminTourDetailPage from "@/pages/admin/pakages/[id]/detail/page";
import InquiryPage from "./pages/admin/inquiry/inquiryPage";
import BookingsPage from "./pages/admin/bookings/page";
import CreateBookingPage from "./pages/admin/bookings/create/page";
import BookingDetailPage from "./pages/admin/bookings/[id]/page";
import EditBookingPage from "./pages/admin/bookings/[id]/edit/page";
import PaymentPage from "./components/payment/paymentPage";
import BookingCancel from "./pages/admin/bookings/BookingCancel";
import BookingSuccess from "./pages/admin/bookings/BookingSuccess";
import { Layout } from "@/components/layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/packages/:id" element={<Layout> <PublicTourPage /> </Layout>} />
            <Route path="/booking/create" element={<Layout><CreateBookingPage /></Layout>} /> {/* Added public booking route */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/destinations/dubai" element={<Dubai />} />
            <Route path="/destinations/turkey" element={<Turkey />} />
            <Route path="/destinations/greece" element={<Greece />} />
            <Route path="/destinations/thailand" element={<Thailand />} />
            <Route path="/destinations/indonesia" element={<Indonesia />} />
            <Route path="/packages" element={<Package />} />
            <Route path="/payment/:bookingId" element={<PaymentPage />} />
            <Route path="/booking/success" element={<BookingSuccess />} />
            <Route path="/booking/cancel" element={<BookingCancel />} />


            {/* Auth routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']} redirectTo="/">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Tour Management */}
              <Route path="packages" element={<Packages />} />
              <Route path="packages/create" element={<CreatePackage />} />
              <Route path="packages/:id/edit" element={<EditPackage />} />
              <Route path="packages/:id/detail" element={<AdminTourDetailPage />} />

              {/* Booking Management - FIXED PATH */}
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="bookings/create" element={<CreateBookingPage />} />
              <Route path="bookings/:id" element={<BookingDetailPage />} />
              <Route path="bookings/:id/edit" element={<EditBookingPage />} />

              {/* Inquiry Management */}
              <Route path="inquiry" element={<InquiryPage />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;