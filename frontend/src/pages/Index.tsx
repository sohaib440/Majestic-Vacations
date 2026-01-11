// src/pages/Index.tsx
import React, { useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { DestinationCard } from "@/components/shared/DestinationCard";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import FeaturedPackagesSection from "@/components/shared/FeaturedPackagesSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Clock, HeartHandshake, Plane, MapPin, Users } from "lucide-react";
import Aboutus from "./Home Section/Aboutus";
import Carousel from "./Home Section/Carousel";

const destinations = [
  {
    name: "Dubai",
    country: "United Arab Emirates",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    path: "/destinations/dubai",
    description: "Luxury, adventure, and architectural marvels in the city of gold.",
  },
  {
    name: "Turkey",
    country: "Turkey",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80",
    path: "/destinations/turkey",
    description: "Where ancient history meets stunning natural landscapes.",
  },
  {
    name: "Greece",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    path: "/destinations/greece",
    description: "Sun-kissed islands and timeless Mediterranean beauty.",
  },
  {
    name: "Thailand",
    country: "Thailand",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
    path: "/destinations/thailand",
    description: "Tropical paradise with vibrant culture and cuisine.",
  },
  {
    name: "Indonesia",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    path: "/destinations/indonesia",
    description: "Mystical temples, pristine beaches, and natural wonders.",
  },
];

const featuredPackagesData = [
  {
    title: "Dubai Luxury Escape",
    destination: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    duration: "6 Days / 5 Nights",
    groupSize: "2-10 People",
    price: 1899,
    originalPrice: 2299,
    rating: 4.9,
    highlights: ["5-Star Hotel", "Burj Khalifa VIP", "Desert Safari"],
    featured: true,
  },
  {
    title: "Greek Island Paradise",
    destination: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    duration: "8 Days / 7 Nights",
    groupSize: "2-6 People",
    price: 2499,
    rating: 4.9,
    highlights: ["Sunset Cruise", "Wine Tasting", "Private Villa"],
    featured: true,
  },
  {
    title: "Bali Spiritual Journey",
    destination: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    duration: "7 Days / 6 Nights",
    groupSize: "2-8 People",
    price: 1599,
    originalPrice: 1899,
    rating: 4.8,
    highlights: ["Temple Tours", "Rice Terraces", "Spa Retreat"],
    featured: true,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "Our trip to Dubai was absolutely magical! Majestic Vacations took care of every single detail. The desert safari was the highlight of our journey.",
    destination: "Dubai",
  },
  {
    name: "Michael Chen",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
    text: "The hot air balloon ride in Cappadocia was a dream come true. Everything was perfectly organized and the guides were exceptional.",
    destination: "Turkey",
  },
  {
    name: "Emily Rodriguez",
    location: "Sydney, Australia",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    text: "Santorini exceeded all expectations! The private yacht tour was incredible. Can't wait to book our next adventure with them.",
    destination: "Greece",
  },
];

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your safety is our top priority with trusted partners worldwide.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Service",
    description: "Every trip is tailored to your unique preferences and dreams.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance throughout your journey.",
  },
  {
    icon: Star,
    title: "Best Price Guarantee",
    description: "Competitive pricing with no hidden fees or surprises.",
  },
];

const stats = [
  { icon: Users, value: "10K+", label: "Happy Travelers" },
  { icon: MapPin, value: "5", label: "Dream Destinations" },
  { icon: Plane, value: "500+", label: "Tours Completed" },
  { icon: Star, value: "4.9", label: "Average Rating" },
];

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Video autoplay logic...
    const video = videoRef.current;
    if (video) {
      const playVideo = () => {
        video.play().catch(e => {
          console.log("Autoplay prevented, trying again...");
          setTimeout(() => video.play().catch(e => console.log("Final autoplay error:", e)), 100);
        });
      };

      if (video.readyState >= 3) {
        playVideo();
      } else {
        video.addEventListener('loadeddata', playVideo);
        video.addEventListener('canplay', playVideo);
        setTimeout(playVideo, 500);
      }

      return () => {
        video.removeEventListener('loadeddata', playVideo);
        video.removeEventListener('canplay', playVideo);
      };
    }
  }, []);

  const scrollToContact = () => {
    window.location.href = "/contact";
  };

  return (
    <Layout>
      {/* Hero Section - Moved padding-top here instead of min-height calculation */}
      <section className="relative pt-20 min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={"https://res.cloudinary.com/diwuj7tkd/video/upload/v1767973026/home_pages_video_jlzifq.mp4"} type="video/mp4" />

            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Explore the world
            <span className="block text-primary mt-2">
              with <span className="italic">Elegance</span>
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            We'll handle the planning; you handle the memories.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base" asChild>
              <Link to="/contact">
                Plan Your Trip
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/10 text-gray-900 hover:bg-primary-foreground/10 px-8 h-12 text-base" asChild>
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-8 bg-primary relative -mt-16 z-20 mx-4 lg:mx-20 rounded-2xl shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-primary-foreground">
                <stat.icon className="h-8 w-8 mx-auto mb-2 opacity-80" />
                <p className="font-serif text-3xl md:text-4xl font-bold">{stat.value}</p>
                <p className="text-sm text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <Aboutus />
      <Carousel />

      {/* Why Choose Us Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Why Travel With Majestic"
            subtitle="Experience the difference of traveling with a team that truly cares about your journey."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <FeaturedPackagesSection
        title="Featured Packages"
        subtitle="Our most popular curated experiences, designed for travelers who seek the extraordinary."
        packages={featuredPackagesData}
        showViewAll={true}
      />

      {/* Testimonials Section */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="What Our Travelers Say"
            subtitle="Join thousands of happy travelers who've experienced the Majestic difference."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-primary-foreground/10 text-gray-900 hover:bg-primary-foreground/10" asChild>
              <Link to="/testimonials">
                Read More Reviews
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Ready to Start Your
              <span className="text-primary block mt-2">Dream Vacation?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Get in touch with our travel experts today. We'll help you plan the perfect
              getaway tailored to your preferences and budget.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-14 text-base" asChild>
                <Link to="/contact">
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {/* <Button size="lg" variant="outline" className="px-10 h-14 text-base" asChild>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
              </Button> */}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}