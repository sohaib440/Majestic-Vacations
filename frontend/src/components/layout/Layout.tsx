import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "../shared/WhatsAppButton";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Main content comes first in DOM */}
      <main className="flex-1">{children}</main>

      {/* Navbar positioned absolutely to float above content */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <Navbar />
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
