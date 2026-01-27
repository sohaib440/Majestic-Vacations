'use client';

import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { TestimonialModal } from "@/components/shared/TestimonialModal";
import { Star } from "lucide-react";
import TestimonialBg from "@/assets/testimonial.jpg";
import { useGetAllTestimonials } from "@/features/testimonialApi";
import { useMemo, useState } from "react";
import { MediaItem } from "@/types/testimonial";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80";
  }
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

export default function Testimonials() {
  const { data: testimonials = [], isLoading, error } = useGetAllTestimonials();
  const [selectedTestimonial, setSelectedTestimonial] = useState<{
    _id: string;
    name: string;
    location: string;
    avatar: string;
    rating: number;
    text: string;
    destination: string;
    company?: string;
    media: MediaItem[];
  } | null>(null);

  // Calculate dynamic stats from testimonials
  const stats = useMemo(() => {
    if (!testimonials || testimonials.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        fiveStarPercentage: 0,
      };
    }

    const totalReviews = testimonials.length;
    const averageRating = (
      testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / totalReviews
    ).toFixed(1);
    const fiveStarCount = testimonials.filter((t) => t.rating === 5).length;
    const fiveStarPercentage = Math.round((fiveStarCount / totalReviews) * 100);

    return {
      totalReviews,
      averageRating: parseFloat(averageRating),
      fiveStarPercentage,
    };
  }, [testimonials]);

  // Format testimonials for TestimonialCard component
  const formattedTestimonials = useMemo(
    () =>
      testimonials.map((t) => ({
        _id: t._id,
        name: t.name,
        location: t.travelerLocation
          ? `${t.travelerLocation.city || ""}, ${t.travelerLocation.country || ""}`.trim()
          : "Unknown Location",
        avatar: getImageUrl(t.userProfilePic),
        rating: t.rating || 5,
        text: t.content,
        destination: t.destination || "Unknown Destination",
        company: t.company,
        media: (t.media || []).map((m: MediaItem) => ({
          type: m.type,
          url: getImageUrl(m.url),
          thumbnail: m.thumbnail ? getImageUrl(m.thumbnail) : undefined,
        })),
      })),
    [testimonials]
  );

  return (
    <Layout>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section
          className="relative py-36 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(150, 150, 150, 0.7), rgba(0, 0, 0, 0.7)), url(${TestimonialBg})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">
              What Our Travelers Say
            </h1>
            <p className="text-lg max-w-2xl mx-auto text-white/90 mb-8">
              Don't just take our word for it. Hear from thousands of happy travelers
              who've experienced the Majestic Vacations difference.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#testimonials"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-8"
              >
                Read Reviews
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white text-white hover:bg-white/10 h-11 px-8"
              >
                Share Your Story
              </a>
            </div>
          </div>
        </section>

      {/* Rating Summary */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-8 w-8 fill-accent text-accent" />
                ))}
              </div>
              <p className="font-serif text-5xl font-bold text-foreground">{stats.averageRating}</p>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div className="h-20 w-px bg-border hidden md:block" />
            <div className="text-center">
              <p className="font-serif text-5xl font-bold text-foreground">{stats.totalReviews.toLocaleString()}</p>
              <p className="text-muted-foreground">Verified Reviews</p>
            </div>
            <div className="h-20 w-px bg-border hidden md:block" />
            <div className="text-center">
              <p className="font-serif text-5xl font-bold text-foreground">{stats.fiveStarPercentage}%</p>
              <p className="text-muted-foreground">5-Star Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Traveler Stories</h2>
            <p className="text-lg text-gray-600">Real experiences from real travelers. Every review is from a verified customer.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-lg h-80 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">
                Failed to load testimonials. Please try again later.
              </p>
            </div>
          ) : formattedTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {formattedTestimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id}
                  {...testimonial}
                  onClick={() => {
                    setSelectedTestimonial(testimonial);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No testimonials available yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section with Background Pattern */}
      <section
        className="relative py-20 bg-primary overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${TestimonialBg})`,
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
            Ready to Create Your Own Story?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied travelers and start planning your dream vacation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-8 hover:scale-105 transform duration-300"
            >
              Start Planning
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

      {/* Testimonial Detail Modal - Using New Professional Component */}
      <TestimonialModal
        open={!!selectedTestimonial}
        onOpenChange={() => setSelectedTestimonial(null)}
        testimonial={selectedTestimonial}
      />
      </main>
    </Layout>
  );
}