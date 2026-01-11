import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.webp";

const destinations = [
  { name: "Dubai", path: "/destinations/dubai", flag: "🇦🇪", color: "hover:text-[#CE1126]" },
  { name: "Turkey", path: "/destinations/turkey", flag: "🇹🇷", color: "hover:text-[#E30A17]" },
  { name: "Greece", path: "/destinations/greece", flag: "🇬🇷", color: "hover:text-[#0D5EAF]" },
  { name: "Thailand", path: "/destinations/thailand", flag: "🇹🇭", color: "hover:text-[#ED1C24]" },
  { name: "Indonesia", path: "/destinations/indonesia", flag: "🇮🇩", color: "hover:text-[#CE1126]" },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Packages", path: "/packages" },
  // { name: "Testimo0nials", path: "/testimonials" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHoveringDestinations, setIsHoveringDestinations] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const isDestinationActive = destinations.some(
    (d) => location.pathname === d.path
  );

  // Handle scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-hide mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  return (
    <>
      {/* Fixed Navigation with proper z-index */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/30"
            : "bg-gradient-to-b from-white/95 via-white/90 to-transparent backdrop-blur-lg"
        }`}
        style={{ 
          height: "80px", // Fixed height to prevent layout shift
          willChange: "transform, background-color" // Performance optimization
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo with animation */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group relative z-10"
              aria-label="Majestic Vacations Home"
            >
              <img 
                src={logo} 
                alt="Majestic Vacations" 
                className="h-12 w-auto transition-all duration-500 group-hover:scale-105 group-hover:rotate-2" 
              />
              <span className="hidden lg:inline text-xl font-serif font-semibold text-gradient-majestic">
                Majestic Vacations
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Home Link */}
              {navLinks.slice(0, 1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group"
                >
                  <div className={`px-2 py-1 text-sm font-medium transition-all duration-300 ${
                    isActive(link.path) 
                      ? "text-primary font-semibold" 
                      : "text-foreground/80 hover:text-primary"
                  }`}>
                    {link.name}
                    <div className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ${
                      isActive(link.path) 
                        ? "bg-primary/10 scale-105" 
                        : "group-hover:bg-primary/5 group-hover:scale-105"
                    }`} />
                  </div>
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                  )}
                </Link>
              ))}

              {/* Destinations Dropdown with hover */}
              <div 
                className="relative"
                onMouseEnter={() => setIsHoveringDestinations(true)}
                onMouseLeave={() => setIsHoveringDestinations(false)}
              >
                <DropdownMenu 
                  open={isHoveringDestinations} 
                  onOpenChange={setIsHoveringDestinations}
                >
                  <DropdownMenuTrigger className="outline-none">
                    <div className={`flex items-center gap-1 px-2 py-1 text-sm font-medium transition-all duration-300 group ${
                      isDestinationActive 
                        ? "text-primary font-semibold" 
                        : "text-foreground/80 hover:text-primary"
                    }`}>
                      <Plane className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
                      Destinations
                      <ChevronDown className={`h-4 w-4 transition-all duration-300 ${
                        isHoveringDestinations ? "rotate-180 scale-110" : ""
                      }`} />
                      <div className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ${
                        isDestinationActive 
                          ? "bg-primary/10 scale-105" 
                          : "group-hover:bg-primary/5 group-hover:scale-105"
                      }`} />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent 
                    align="center" 
                    sideOffset={8}
                    className="w-56 p-2 border-white/20 bg-white/95 backdrop-blur-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 z-50"
                    onMouseEnter={() => setIsHoveringDestinations(true)}
                    onMouseLeave={() => setIsHoveringDestinations(false)}
                  >
                    {destinations.map((dest) => (
                      <DropdownMenuItem 
                        key={dest.path} 
                        asChild
                        className="focus:bg-transparent focus:text-inherit p-0"
                      >
                        <Link
                          to={dest.path}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                            isActive(dest.path) 
                              ? "bg-primary/10 text-primary" 
                              : "text-foreground/80 hover:bg-primary/5"
                          } ${dest.color}`}
                        >
                          <span className="text-xl transition-transform duration-300 group-hover:scale-125">
                            {dest.flag}
                          </span>
                          <span className="font-medium flex-grow transition-all duration-300 group-hover:translate-x-1">
                            {dest.name}
                          </span>
                          {isActive(dest.path) && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Other Navigation Links */}
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group"
                >
                  <div className={`px-2 py-1 text-sm font-medium transition-all duration-300 ${
                    isActive(link.path) 
                      ? "text-primary font-semibold" 
                      : "text-foreground/80 hover:text-primary"
                  }`}>
                    {link.name}
                    <div className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ${
                      isActive(link.path) 
                        ? "bg-primary/10 scale-105" 
                        : "group-hover:bg-primary/5 group-hover:scale-105"
                    }`} />
                  </div>
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <Button
                asChild
                className="relative overflow-hidden group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
              >
                <a href="tel:+1234567890" className="flex items-center gap-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Phone className="h-4 w-4" />
                  <span className="font-semibold">Call Now</span>
                </a>
              </Button>
            </div>

            {/* Mobile Toggle Button */}
            <button
              className="lg:hidden p-2.5 rounded-lg hover:bg-primary/5 transition-all duration-300 active:scale-95 relative z-50"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 animate-spin-in duration-300" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setIsOpen(false)}
          style={{ top: "80px" }} // Start below the navbar
        />

        {/* Mobile Menu Content */}
        <div
          className={`lg:hidden fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
          style={{ 
            top: "80px", // Positioned right below the navbar
            maxHeight: "calc(100vh - 80px)", // Prevent exceeding viewport
            overflowY: "auto" // Scroll if content is too long
          }}
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-white/20 shadow-2xl">
            <div className="flex flex-col gap-1 p-4">
              {/* Home Link */}
              {navLinks.slice(0, 1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {link.name}
                    {isActive(link.path) && (
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                </Link>
              ))}

              {/* Mobile Destinations */}
              <div className="px-4 py-3">
                <div className="text-sm font-semibold text-foreground/80 mb-2 flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Destinations
                </div>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {destinations.map((dest) => (
                    <Link
                      key={dest.path}
                      to={dest.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2.5 rounded-lg text-sm transition-all duration-300 active:scale-95 ${
                        isActive(dest.path)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                      } ${dest.color}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{dest.flag}</span>
                        <span className="font-medium">{dest.name}</span>
                        {isActive(dest.path) && (
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse ml-auto" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other Links */}
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {link.name}
                    {isActive(link.path) && (
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                </Link>
              ))}

              {/* Mobile CTA */}
              <div className="px-4 pt-4 pb-6">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-500 active:scale-95"
                >
                  <a
                    href="tel:+1234567890"
                    className="flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="font-semibold">Call to Book Now</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div 
        className="h-20" 
        style={{ 
          height: "80px",
          minHeight: "80px",
          flexShrink: 0 
        }}
      />
    </>
  );
}