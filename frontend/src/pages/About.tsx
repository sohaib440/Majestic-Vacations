import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Heart, Users, Globe, Award, Target, Sparkles } from "lucide-react";
import logo from "@/assets/logo.webp";
import AboutBackground from '@/assets/about.jpg';

const values = [
  {
    icon: Heart,
    title: "Passion for Travel",
    description: "We love what we do and it shows in every trip we plan.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Your satisfaction is our top priority from start to finish.",
  },
  {
    icon: Globe,
    title: "Local Expertise",
    description: "Deep knowledge of every destination we offer.",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Only the best hotels, guides, and experiences.",
  },
];

const stats = [
  { value: "10K+", label: "Happy Travelers" },
  { value: "5", label: "Dream Destinations" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section with Background Image */}
      <section
        className="relative py-36 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 0, 10, 0.6), rgba(0, 0, 0, 0.6)), url(${AboutBackground})`,
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <img src={logo} alt="Majestic Vacations" className="h-24 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            About Majestic Vacations
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-white/90">
            Creating unforgettable travel experiences since 2010. We believe every journey
            should be as unique as the traveler embarking on it.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading title="Our Story" centered={false} />
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Majestic Vacations was born from a simple belief: that travel has the power to
                  transform lives. What started as a small family business in 2010 has grown into
                  a trusted name in luxury travel, serving thousands of happy travelers each year.
                </p>
                <p>
                  Our founders, passionate globetrotters themselves, understood that the best
                  travel experiences come from authentic connections – with places, people, and
                  cultures. This philosophy remains at the heart of everything we do.
                </p>
                <p>
                  Today, we specialize in crafting bespoke journeys to five of the world's most
                  captivating destinations: Dubai, Turkey, Greece, Thailand, and Indonesia. Each
                  trip is carefully designed to balance adventure with relaxation, discovery with
                  comfort, and cultural immersion with personal time.
                </p>
                <p>
                  We're not just travel agents – we're your travel partners, dedicated to making
                  your dream vacation a reality.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522199710521-72d69614c702?w=800&q=80"
                alt="Travel planning"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <p className="font-serif text-3xl font-bold">15+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-6">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To create extraordinary travel experiences that inspire, transform, and create
                lasting memories. We strive to make luxury travel accessible while maintaining
                the highest standards of service and authenticity.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-6">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To be the most trusted and beloved travel company, known for crafting journeys
                that exceed expectations and create lifelong travelers. We envision a world
                where travel brings people together and creates understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values with Background Image */}
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${AboutBackground})`,
        }}
      >
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Values"
            subtitle="The principles that guide everything we do at Majestic Vacations."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center border border-white/20"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent text-white mb-4">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-white/90">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Why Travel With Us"
            subtitle="Here's what sets Majestic Vacations apart from the rest."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="w-1 bg-accent rounded-full shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Personalized Itineraries</h3>
                <p className="text-muted-foreground">
                  Every trip is tailored to your interests, pace, and budget. No cookie-cutter packages here.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-accent rounded-full shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Handpicked Partners</h3>
                <p className="text-muted-foreground">
                  We work only with the best hotels, guides, and service providers at each destination.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-accent rounded-full shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Our team is available round the clock to assist you before, during, and after your trip.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-accent rounded-full shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Best Price Guarantee</h3>
                <p className="text-muted-foreground">
                  Competitive pricing with no hidden fees. We match any comparable offer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}