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
import CurrencySelector from '@/components/shared/currency/CurrencySelector';
import { useCurrency } from '@/hooks/useCurrency';

const destinations = [
  { name: "UAE", path: "/destinations/dubai", flag: "🇦🇪", color: "hover:text-[#CE1126]" },
  { name: "Turkey", path: "/destinations/turkey", flag: "🇹🇷", color: "hover:text-[#E30A17]" },
  { name: "Greece", path: "/destinations/greece", flag: "🇬🇷", color: "hover:text-[#0D5EAF]" },
  { name: "Thailand", path: "/destinations/thailand", flag: "🇹🇭", color: "hover:text-[#ED1C24]" },
  { name: "Indonesia", path: "/destinations/indonesia", flag: "🇮🇩", color: "hover:text-[#CE1126]" },
];

const aboutUsItems = [
  { name: "Testimonials", path: "/testimonials" },
  { name: "About Us", path: "/about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
      const [isHoveringDestinations, setIsHoveringDestinations] = useState(false);
      const [isHoveringAboutUs, setIsHoveringAboutUs] = useState(false);
      const { currentCurrency, setCurrency } = useCurrency();
      const location = useLocation();
      const navRef = useRef<HTMLElement>(null);
    
      const isActive = (path: string) => location.pathname === path;
      const isDestinationActive = destinations.some((d) => location.pathname === d.path);
      const isAboutUsActive = aboutUsItems.some((item) => location.pathname === item.path);
    
      // Close mobile menu on route change
      useEffect(() => setIsOpen(false), [location.pathname]);
    
      // Close mobile menu when clicking outside
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (navRef.current && !navRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, [isOpen]);
    
      // Prevent body scroll when mobile menu is open
      useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
      }, [isOpen]);
  // Helper function for link styles
  const getLinkStyles = (isActiveLink: boolean) => {
    const baseStyles = "px-2 py-1 text-sm font-medium transition-all duration-300";
    return `${baseStyles} ${isActiveLink ? "text-primary font-semibold" : "text-foreground/90 hover:text-primary"}`;
  };

  // Helper function for dropdown trigger styles
  const getDropdownTriggerStyles = (isActiveLink: boolean) => {
    const baseStyles = "flex items-center gap-1 px-2 py-1 text-sm font-medium transition-all duration-300 group";
    return `${baseStyles} ${isActiveLink ? "text-primary font-semibold" : "text-foreground/90 hover:text-primary"}`;
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out"
        style={{
          height: "80px",
          backgroundColor: "transparent",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid hsl(var(--border) / 0.1)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative z-10" aria-label="Home">
              <img
                src={logo}
                alt="Majestic Vacations"
                className="h-12 w-auto transition-all duration-500 group-hover:scale-105 group-hover:rotate-2"
              />
              <span
                className="hidden lg:inline text-xl font-serif font-semibold text-foreground"
              >
                Majestic Vacations
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Home */}
              <Link to="/" className="relative group">
                <div className={getLinkStyles(isActive("/"))}>
                  Home
                  <div className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ${isActive("/") ? "bg-primary/10 scale-105" : "group-hover:bg-primary/5 group-hover:scale-105"
                    }`} />
                </div>
                {isActive("/") && (
                  <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full`} />
                )}
              </Link>

              {/* Packages */}
              <Link to="/packages" className="relative group">
                <div className={getLinkStyles(isActive("/packages"))}>
                  Packages
                  <div className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ${isActive("/packages") ? "bg-primary/10 scale-105" : "group-hover:bg-primary/5 group-hover:scale-105"
                    }`} />
                </div>
                {isActive("/packages") && (
                  <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full`} />
                )}
              </Link>

              {/* Destinations Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsHoveringDestinations(true)}
                onMouseLeave={() => setIsHoveringDestinations(false)}
              >
                <DropdownMenu open={isHoveringDestinations} onOpenChange={setIsHoveringDestinations}>
                  <DropdownMenuTrigger className="outline-none">
                    <div className={getDropdownTriggerStyles(isDestinationActive)}>
                      <Plane className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
                      Destinations
                      <ChevronDown className={`h-4 w-4 transition-all duration-300 ${isHoveringDestinations ? "rotate-180 scale-110" : ""}`} />
                      <div className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ${isDestinationActive ? "bg-primary/10 scale-105" : "group-hover:bg-primary/5 group-hover:scale-105"
                        }`} />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    sideOffset={8}
                    className="w-56 p-2 border-border bg-background/95 backdrop-blur-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300"
                    onMouseEnter={() => setIsHoveringDestinations(true)}
                    onMouseLeave={() => setIsHoveringDestinations(false)}
                  >
                    {destinations.map((dest) => (
                      <DropdownMenuItem key={dest.path} asChild className="focus:bg-transparent focus:text-inherit p-0">
                        <Link
                          to={dest.path}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${isActive(dest.path) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5"
                            } ${dest.color}`}
                        >
                          <span className="text-xl transition-transform duration-300 group-hover:scale-125">{dest.flag}</span>
                          <span className="font-medium flex-grow transition-all duration-300 group-hover:translate-x-1">{dest.name}</span>
                          {isActive(dest.path) && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* About Us Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsHoveringAboutUs(true)}
                onMouseLeave={() => setIsHoveringAboutUs(false)}
              >
                <DropdownMenu open={isHoveringAboutUs} onOpenChange={setIsHoveringAboutUs}>
                  <DropdownMenuTrigger className="outline-none">
                    <div className={getDropdownTriggerStyles(isAboutUsActive)}>
                      About Us
                      <ChevronDown className={`h-4 w-4 transition-all duration-300 ${isHoveringAboutUs ? "rotate-180 scale-110" : ""}`} />
                      <div className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ${isAboutUsActive ? "bg-primary/10 scale-105" : "group-hover:bg-primary/5 group-hover:scale-105"
                        }`} />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    sideOffset={8}
                    className="w-48 p-2 border-border bg-background/95 backdrop-blur-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300"
                    onMouseEnter={() => setIsHoveringAboutUs(true)}
                    onMouseLeave={() => setIsHoveringAboutUs(false)}
                  >
                    {aboutUsItems.map((item) => (
                      <DropdownMenuItem key={item.path} asChild className="focus:bg-transparent focus:text-inherit p-0">
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 group ${isActive(item.path) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5"
                            }`}
                        >
                          <span className="font-medium flex-grow transition-all duration-300 group-hover:translate-x-1">{item.name}</span>
                          {isActive(item.path) && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Contact Us */}
              <Link to="/contact" className="relative group">
                <div className={getLinkStyles(isActive("/contact"))}>
                  Contact Us
                  <div className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ${isActive("/contact") ? "bg-primary/10 scale-105" : "group-hover:bg-primary/5 group-hover:scale-105"
                    }`} />
                </div>
                {isActive("/contact") && (
                  <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full`} />
                )}
              </Link>

              <div className="hidden lg:flex items-center mr-4">
                <CurrencySelector variant="compact" showLabel={false} />
              </div>
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:flex items-center">
              <Button
                asChild
                className={`relative overflow-hidden group transition-all duration-500 hover:scale-105 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground`}
              >
                <a href="tel:+1234567890" className="flex items-center gap-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </a>
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2.5 rounded-lg transition-all duration-300 active:scale-95 relative z-50 hover:bg-black/5 dark:hover:bg-white/5 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          onClick={() => setIsOpen(false)}
          style={{ top: "80px" }}
        />

        {/* Mobile Menu Content */}
        <div
          className={`lg:hidden fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
            }`}
          style={{
            top: "80px",
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
          }}
        >
          <div className="bg-background border-t border-border shadow-2xl">
            <div className="flex flex-col gap-1 p-4">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${isActive("/") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
              >
                Home
              </Link>

              <Link
                to="/packages"
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${isActive("/packages") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
              >
                Packages
              </Link>

              {/* Mobile Destinations */}
              <div className="px-4 py-3">
                <div className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Plane className="h-4 w-4" /> Destinations
                </div>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {destinations.map((dest) => (
                    <Link
                      key={dest.path}
                      to={dest.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2.5 rounded-lg text-sm transition-all duration-300 ${isActive(dest.path) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        } ${dest.color}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{dest.flag}</span>
                        <span className="font-medium">{dest.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile About Us */}
              <div className="px-4 py-3">
                <div className="text-sm font-semibold text-foreground mb-2">About Us</div>
                <div className="flex flex-col gap-1 pl-2">
                  {aboutUsItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${isActive(item.path) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${isActive("/contact") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
              >
                Contact Us
              </Link>

              <div className="px-4 py-3 border-t border-border">
                <div className="text-sm font-semibold text-foreground mb-2">
                  Currency
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
                    { code: 'AED', flag: '🇦🇪', name: 'UAE Dirham' },
                    { code: 'TRY', flag: '🇹🇷', name: 'Turkish Lira' },
                    { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
                    { code: 'THB', flag: '🇹🇭', name: 'Thai Baht' },
                    { code: 'IDR', flag: '🇮🇩', name: 'Rupiah' },
                  ].map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => {
                        setCurrency(currency.code);
                        setIsOpen(false);
                      }}
                      className={`px-3 py-2.5 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 ${currentCurrency === currency.code
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-primary/5'
                        }`}
                    >
                      <span className="text-lg">{currency.flag}</span>
                      <span className="font-medium">{currency.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="px-4 pt-4 pb-6">
                <Button asChild className="w-full">
                  <a href="tel:+1234567890" className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call to Book Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-20" />
    </>
  );
}