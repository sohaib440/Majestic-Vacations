import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Home, Users, CalendarDays, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetAllPackageInquiries, useGetPackageStats } from "@/features/packageInquiryApi";
import { PackageInquiryModal } from "@/components/shared/PackageInquiryModal";
import { VacationRentalInquiryModal } from "@/components/shared/VacationRentalInquiryModal";
import { useCreateVacationRentalInquiry, CreateVacationRentalInquiryDto } from "@/features/vacationRentalInquiryApi";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function VacationRentals() {
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetAllPackageInquiries();
  const { data: statsData } = useGetPackageStats();
  const createInquiryMutation = useCreateVacationRentalInquiry();
  
  const [selectedPackage, setSelectedPackage] = useState<{
    _id: string;
    packageName: string;
    location: string;
    packageAveragePrice: number;
    packageDescription: string;
    media: { type: string; url: string; thumbnail?: string }[];
    createdBy?: { name: string; email: string; avatar?: string };
  } | null>(null);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const inquiries = response?.data || [];

  const stats = useMemo(() => {
    if (!statsData) {
      return {
        totalPackages: 0,
        averagePrice: 0,
        topLocations: 0,
      };
    }

    return {
      totalPackages: statsData.totalPackages || 0,
      averagePrice: Math.round(statsData.averagePrice || 0),
      topLocations: statsData.locationStats?.length || 0,
    };
  }, [statsData]);

  const handleInquirySubmit = async (data: CreateVacationRentalInquiryDto) => {
    try {
      await createInquiryMutation.mutateAsync(data);
      toast({
        title: "✨ Inquiry Submitted Successfully",
        description: "Thank you! We've received your vacation rental inquiry. Our team will review it and get back to you soon.",
        variant: "default",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit inquiry";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Placeholder for background image URL
  const PackageInquiriesBg = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80";

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Hero Section */}
        <section
          className="relative py-16 md:py-32 lg:py-40 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%), url(${PackageInquiriesBg})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="mb-4 inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                <p className="text-white text-sm font-semibold">🏡 Discover Unique Stays</p>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white leading-tight">
                Vacation Rentals & B&B
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed px-2">
                Discover handpicked vacation rentals and bed & breakfast accommodations around the world. Find your perfect home away from home.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="bg-white text-primary hover:bg-white/90 font-semibold py-2 md:py-3 px-6 md:px-8 rounded-lg"
                >
                  Create Inquiry
                </Button>
                <Button 
                  onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary/80 text-white hover:bg-primary font-semibold py-2 md:py-3 px-6 md:px-8 rounded-lg border border-white/20"
                >
                  Browse Properties
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {/* <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="text-center">
                <p className="font-serif text-5xl font-bold text-foreground mb-2">
                  {stats.totalPackages}
                </p>
                <p className="text-muted-foreground">Total Packages</p>
              </div>
              <div className="h-20 w-px bg-border hidden md:block" />
              <div className="text-center">
                <p className="font-serif text-5xl font-bold text-foreground mb-2">
                  ${stats.averagePrice.toLocaleString()}
                </p>
                <p className="text-muted-foreground">Average Price</p>
              </div>
              <div className="h-20 w-px bg-border hidden md:block" />
              <div className="text-center">
                <p className="font-serif text-5xl font-bold text-foreground mb-2">
                  {stats.topLocations}
                </p>
                <p className="text-muted-foreground">Popular Locations</p>
              </div>
            </div>
          </div>
        </section> */}

        {/* Packages Grid */}
        <section id="packages" className="py-16 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-12 md:mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-foreground">
                Available Vacation Rentals
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Explore our curated collection of vacation homes, B&Bs, and unique stays from verified hosts.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-xl h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 md:py-20">
                <div className="inline-block bg-red-50 border border-red-200 rounded-lg p-6 md:p-8">
                  <p className="text-red-600 text-base md:text-lg font-medium">
                    Failed to load properties. Please try again later.
                  </p>
                </div>
              </div>
            ) : inquiries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {inquiries.map((inquiry) => (
                  <Card 
                    key={inquiry._id} 
                    className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 group border border-gray-200 hover:border-gray-300 rounded-xl" 
                    onClick={() => { 
                      setSelectedPackage({
                        _id: inquiry._id,
                        packageName: inquiry.packageName,
                        location: inquiry.location,
                        packageAveragePrice: inquiry.packageAveragePrice,
                        packageDescription: inquiry.packageDescription,
                        media: inquiry.media,
                        createdBy: inquiry.createdBy ? {
                          name: inquiry.createdBy.userName,
                          email: inquiry.createdBy.userEmail,
                        } : undefined,
                      }); 
                      setIsPackageModalOpen(true); 
                    }}
                  >
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 h-48 md:h-56 flex items-center justify-center text-4xl md:text-6xl overflow-hidden relative">
                      {inquiry.media?.[0]?.url ? (
                        <img 
                          src={`${API_BASE_URL.replace('/api', '')}${inquiry.media[0].url}`} 
                          alt={inquiry.packageName}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <span>🏠</span>
                      )}
                      <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                        Featured
                      </div>
                    </div>
                    <CardHeader className="pb-2 md:pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base md:text-lg line-clamp-2">{inquiry.packageName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1 text-xs md:text-sm">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span className="truncate">{inquiry.location}</span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 md:gap-4">
                      <p className="text-xs md:text-sm text-foreground/70 line-clamp-2 leading-relaxed">{inquiry.packageDescription}</p>

                      <div>
                        <span className="font-bold text-base md:text-lg text-primary">${inquiry.packageAveragePrice}</span>
                      </div>
                      <Button 
                        className="w-full mt-auto bg-primary hover:bg-primary/90 text-sm md:text-base py-2 md:py-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsInquiryModalOpen(true);
                        }}
                      >
                        Inquire Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 md:py-20">
                <div className="inline-block">
                  <p className="text-4xl mb-4">🏠</p>
                  <p className="text-muted-foreground text-base md:text-lg font-medium">
                    No properties available yet. Check back soon!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
                How It Works
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Get started in three simple steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Browse Properties",
                  description: "Explore our curated collection of vacation rentals worldwide"
                },
                {
                  icon: CalendarDays,
                  title: "Select Dates",
                  description: "Choose your preferred travel dates and check availability"
                },
                {
                  icon: Users,
                  title: "Book & Enjoy",
                  description: "Confirm your booking and start your amazing vacation"
                }
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="group relative">
                    <div className="bg-white rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-all duration-300 h-full border border-gray-200 hover:border-primary/50">
                      {/* Step Number */}
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      {/* Icon */}
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="font-bold text-lg md:text-xl mb-2 text-foreground">{step.title}</h3>
                      <p className="text-foreground/70 text-sm md:text-base leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* Package Inquiry Modal */}
        <PackageInquiryModal
          open={isPackageModalOpen}
          onOpenChange={setIsPackageModalOpen}
          packageInquiry={selectedPackage}
        />

        {/* Vacation Rental Inquiry Modal */}
        <VacationRentalInquiryModal
          open={isInquiryModalOpen}
          onOpenChange={setIsInquiryModalOpen}
          onSubmit={handleInquirySubmit}
          isSubmitting={createInquiryMutation.isPending}
        />
      </div>
    </Layout>
  );
}