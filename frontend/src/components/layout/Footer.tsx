import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import logo from "@/assets/logo.webp";

const destinations = [
  { name: "Dubai", path: "/destinations/dubai" },
  { name: "Turkey", path: "/destinations/turkey" },
  { name: "Greece", path: "/destinations/greece" },
  { name: "Thailand", path: "/destinations/thailand" },
  { name: "Indonesia", path: "/destinations/indonesia" },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Contact", path: "/contact" },
];

export function Footer() {
  const location = useLocation();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, linkPath: string) => {
    // Check if we're already on the same page
    if (location.pathname === linkPath) {
      e.preventDefault();
      // Scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    // If it's a different page, let the router handle navigation
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Majestic Vacations" className="h-16 w-auto brightness-0 invert" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Creating unforgettable travel experiences since 2010. Let us take you on a journey
              to the world's most beautiful destinations.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={(e) => handleLinkClick(e, link.path)}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Destinations</h3>
            <ul className="space-y-2">
              {destinations.map((dest) => (
                <li key={dest.path}>
                  <Link
                    to={dest.path}
                    onClick={(e) => handleLinkClick(e, dest.path)}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Hollywood,America</span>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  <Phone className="h-5 w-5 shrink-0" />
                  (774) 487-6389
                </a>
              </li>
              <li>
                <a
                  href="mailto:travelwith@themasjesticvacations.com"
                  className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  <Mail className="h-5 w-5 shrink-0" />
                  travelwith@themasjesticvacations.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Majestic Vacations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}