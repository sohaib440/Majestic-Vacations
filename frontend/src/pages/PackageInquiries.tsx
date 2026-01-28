'use client';

import { Layout } from "@/components/layout/Layout";
import { PackageInquiryCard } from "@/components/shared/PackageInquiryCard";
import { PackageInquiryModal } from "@/components/shared/PackageInquiryModal";
import { MapPin, TrendingUp } from "lucide-react";
import PackageInquiriesBg from "@/assets/testimonial.jpg";
import { useGetAllPackageInquiries, useGetPackageStats } from "@/features/packageInquiryApi";
import { useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL ;

const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&q=80";
  }
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

export default function PackageInquiries() {
  const { data: response, isLoading, error } = useGetAllPackageInquiries();
  const { data: statsData } = useGetPackageStats();
  const [selectedPackage, setSelectedPackage] = useState<{
    _id: string;
    packageName: string;
    location: string;
    packageAveragePrice: number;
    packageDescription: string;
    media: { type: string; url: string; thumbnail?: string }[];
    createdBy?: { name: string; email: string; avatar?: string };
  } | null>(null);

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

  return (
    <Layout>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section
          className="relative py-36 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(150, 150, 150, 0.7), rgba(0, 0, 0, 0.7)), url(${PackageInquiriesBg})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">
              Explore Package Inquiries
            </h1>
            <p className="text-lg max-w-2xl mx-auto text-white/90 mb-8">
              Discover amazing tour packages and inquiries from travelers around the world.
              Find your next adventure today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#packages"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-8"
              >
                Browse Packages
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white text-white hover:bg-white/10 h-11 px-8"
              >
                Create Inquiry
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-secondary">
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
        </section>

        {/* Packages Grid */}
        <section id="packages" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Available Packages</h2>
              <p className="text-lg text-gray-600">
                Explore a wide range of tour packages tailored to your preferences.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-lg h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">
                  Failed to load packages. Please try again later.
                </p>
              </div>
            ) : inquiries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {inquiries.map((inquiry) => (
                  <PackageInquiryCard
                    key={inquiry._id}
                    _id={inquiry._id}
                    packageName={inquiry.packageName}
                    location={inquiry.location}
                    packageAveragePrice={inquiry.packageAveragePrice}
                    packageDescription={inquiry.packageDescription}
                    media={inquiry.media || []}
                    onClick={() => setSelectedPackage({
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
                    })}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No packages available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>



        {/* CTA Section with Background Pattern */}
        <section
          className="relative py-20 bg-primary overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${PackageInquiriesBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              Planning Your Next Adventure?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Create your own package inquiry and let our travel experts help you plan
              the perfect getaway tailored to your preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-8 hover:scale-105 transform duration-300"
              >
                Create Inquiry
              </a>
              <a
                href="/destinations"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white text-white hover:bg-white/10 h-11 px-8 hover:scale-105 transform duration-300"
              >
                Explore Destinations
              </a>
            </div>
          </div>
        </section>

        {/* Package Detail Modal */}
        <PackageInquiryModal
          open={!!selectedPackage}
          onOpenChange={() => setSelectedPackage(null)}
          packageInquiry={selectedPackage}
        />
      </main>
    </Layout>
  );
}
