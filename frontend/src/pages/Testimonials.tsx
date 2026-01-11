import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { Star } from "lucide-react";
import TestimonialBg from "@/assets/testimonial.jpg";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "Our trip to Dubai was absolutely magical! Majestic Vacations took care of every single detail. The desert safari was the highlight of our journey. The team was responsive, professional, and genuinely cared about our experience.",
    destination: "Dubai",
  },
  {
    name: "Michael Chen",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
    text: "The hot air balloon ride in Cappadocia was a dream come true. Everything was perfectly organized and the guides were exceptional. This was our first international trip and Majestic made it stress-free and unforgettable.",
    destination: "Turkey",
  },
  {
    name: "Emily Rodriguez",
    location: "Sydney, Australia",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    text: "Santorini exceeded all expectations! The private yacht tour was incredible. We've traveled with many agencies but Majestic Vacations truly stands out. Can't wait to book our next adventure with them.",
    destination: "Greece",
  },
  {
    name: "David Thompson",
    location: "Toronto, Canada",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    rating: 5,
    text: "Thailand was an incredible experience! From the temples in Bangkok to the beaches in Phuket, every day was a new adventure. The local guides were knowledgeable and the hotel selections were perfect.",
    destination: "Thailand",
  },
  {
    name: "Jessica Williams",
    location: "Miami, USA",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    rating: 5,
    text: "Our honeymoon in Bali was everything we dreamed of and more. The private villa, the temple tours, the rice terraces - absolutely stunning. Thank you Majestic Vacations for making our special trip perfect!",
    destination: "Indonesia",
  },
  {
    name: "Robert Anderson",
    location: "Dubai, UAE",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    rating: 5,
    text: "As a local, I thought I knew Dubai well. But Majestic Vacations showed me experiences I never knew existed! The luxury desert camp and private Burj Khalifa tour were extraordinary.",
    destination: "Dubai",
  },
  {
    name: "Amanda Lee",
    location: "Singapore",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    rating: 4,
    text: "The Greek island hopping tour was fantastic! Moving from Santorini to Mykonos was seamless. The only reason for 4 stars is I wish we had more time in each location - it was so beautiful we didn't want to leave!",
    destination: "Greece",
  },
  {
    name: "James Wilson",
    location: "Melbourne, Australia",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    rating: 5,
    text: "Turkey's rich history came alive with our amazing guide. From Istanbul's Grand Bazaar to Ephesus's ancient ruins, every moment was educational and exciting. Highly recommend for history buffs!",
    destination: "Turkey",
  },
  {
    name: "Maria Garcia",
    location: "Barcelona, Spain",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
    rating: 5,
    text: "The Komodo Island adventure was the trip of a lifetime! Seeing the dragons up close was thrilling. The attention to safety and comfort throughout was impressive. Already planning our next Indonesia trip!",
    destination: "Indonesia",
  },
];

const stats = {
  totalReviews: 2847,
  averageRating: 4.9,
  fiveStarPercentage: 94,
};

export default function Testimonials() {
  return (
    <Layout>
      {/* Hero Section with Background Image from assets */}
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
          <SectionHeading
            title="Traveler Stories"
            subtitle="Real experiences from real travelers. Every review is from a verified customer."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
    </Layout>
  );
}