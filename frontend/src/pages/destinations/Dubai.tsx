// src/pages/destinations/Dubai.tsx
import React from 'react';
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import DestinationPackagesSection from "@/components/shared/DestinationPackagesSection";
import { PhotoGallery } from "@/components/shared/PhotoGallery";
import { ContactForm } from "@/components/shared/ContactForm";
import { MapPin, Calendar, Thermometer, Banknote } from "lucide-react";
import ImageCarousel from "@/components/shared/ImageCarousel";
import type { CarouselItem } from "@/components/shared/ImageCarousel";
import AnimatedDestinationPage from "@/components/destinations/AnimatedDestinationPage";
// import DubaiVideo from "@/assets/Videos/Dubai/Untitled design.mp4"

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", alt: "Dubai Skyline" },
  { src: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80", alt: "Burj Al Arab" },
  { src: "https://images.unsplash.com/photo-1672135383688-8fdf9a8011e1?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Dubai Mall" },
  { src: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80", alt: "Dubai Marina" },
  { src: "https://images.unsplash.com/photo-1686918269961-507270a5a238?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzZXVtJTIwb2YlMjB0aGUlMjBmdXR1cmV8ZW58MHx8MHx8fDA%3D", alt: "Museum of Future" },
  { src: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&q=80", alt: "Palm Jumeirah" },
  { src: "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?w=800&q=80", alt: "Dubai Frame" },
  { src: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80", alt: "Dubai Night" },
];
const dubaiFoods = [
  {
    name: "Shawarma",
    image:
      "https://images.unsplash.com/photo-1653379557259-48a725b08460?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Al Harees",
    image:
      "https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=800&q=80",
  },
  {
    name: "Machboos",
    image:
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",
  },
  {
    name: "Luqaimat",
    image:
      "https://media.istockphoto.com/id/1035479260/photo/luqaimat-doughnut-balls-drizzled-with-date-syrup-in-dubai-united-arab-emirates.webp?a=1&b=1&s=612x612&w=0&k=20&c=aumOzHrnojjt1x-Ysl7BOBTLTRAB3AEXi9wwnCl8zvM=",
  },
  {
    name: "Madrouba",
    image:
      "https://plus.unsplash.com/premium_photo-1695297516794-8bc77890e35c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Camel Meat Dish",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
  },
  {
    name: "Kunafa",
    image:
      "https://media.istockphoto.com/id/2192218622/photo/homemade-tiramisu-with-pistachio-mousse-and-dark-chocolate.webp?a=1&b=1&s=612x612&w=0&k=20&c=mMhJruQwNQ-18sJHudvNHdVCs2f2iw-SEl5KL09zmBE=",
  },
  {
    name: "Arabic Dates",
    image:
      "https://plus.unsplash.com/premium_photo-1676208753932-6e8bc83a0b0d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Dubai() {
  const scrollToContact = () => {
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  const carouselItems: CarouselItem[] = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=987&auto=format&fit=crop",
      title: "Burj Khalifa",
      description:
        "Visit the world's tallest building and enjoy breathtaking views from the observation deck overlooking Dubai.",
      link: "#burj-khalifa",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=987&auto=format&fit=crop",
      title: "Palm Jumeirah",
      description:
        "Experience luxury at this iconic man-made island with stunning resorts, beaches, and world-class amenities.",
      link: "#palm-jumeirah",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
      title: "Dubai Mall",
      description:
        "Shop at one of the world's largest shopping malls featuring over 1,200 retail stores and amazing attractions.",
      link: "#dubai-mall",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1624062999726-083e5268525d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzZXJ0JTIwc2FmYXJpfGVufDB8fDB8fHww",
      title: "Desert Safari",
      description:
        "Experience the thrill of dune bashing and traditional Bedouin culture in the vast Arabian desert.",
      link: "#desert-safari",
    },
  ];

  return (
    <AnimatedDestinationPage>
      <Layout>
        {/* Hero Section with Video Background */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            // poster="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop"
            >
              { <source src={"https://res.cloudinary.com/diwuj7tkd/video/upload/v1767975157/dubai_video_c9avad.mp4"} type="video/mp4" />}

              Your browser does not support the video tag.
            </video>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
            <p className="text-accent text-lg font-medium mb-4">🇦🇪 United Arab Emirates</p>
            <h1 className="hero-title font-serif text-4xl md:text-6xl font-bold mb-6">
              Discover Dubai
            </h1>
            <p className="hero-subtitle text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90">
              Where Modern Luxury Meets Arabian Tradition
            </p>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">Middle East</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Best Time</p>
                  <p className="font-semibold">Nov - April</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Thermometer className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Climate</p>
                  <p className="font-semibold">Warm & Sunny</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Banknote className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-semibold">AED (Dirham)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Destination */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionHeading title="About Dubai" centered={false} />
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Dubai is a city of superlatives, home to the world's tallest building, largest shopping mall,
                    and some of the most luxurious hotels on the planet. This glittering metropolis in the desert
                    has transformed itself from a small fishing village into a global hub for tourism, commerce, and innovation.
                  </p>
                  <p>
                    Whether you're seeking adventure in the golden dunes, luxury shopping experiences, world-class
                    dining, or cultural discoveries in the historic Al Fahidi district, Dubai offers an unparalleled
                    blend of traditional Arabian hospitality and futuristic ambition.
                  </p>
                  <p>
                    From the iconic Burj Khalifa piercing the clouds to the palm-shaped islands visible from space,
                    Dubai is a destination that constantly amazes and inspires travelers from around the world.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80"
                  alt="Burj Al Arab"
                  className="rounded-xl object-cover h-64 w-full"
                />
                <img
                  src="https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&q=80"
                  alt="Desert Safari"
                  className="rounded-xl object-cover h-64 w-full mt-8"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Image Carousel Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="attractions-title text-4xl font-bold text-center mb-12">Top Attractions</h2>
            <ImageCarousel items={carouselItems} />
          </div>
        </div>

        <section className="py-20 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Famous Foods in Dubai"
              subtitle="Experience the rich flavors of Emirati and Middle Eastern cuisine."
            />

            <div className="mt-14 relative">
              <div className="flex gap-12 animate-food-slider">
                {[...dubaiFoods, ...dubaiFoods].map((food, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center min-w-[160px]"
                  >
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-36 h-36 rounded-full object-cover border-4 border-accent"
                    />
                    <p className="mt-4 text-base font-semibold text-center">
                      {food.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Tour Packages */}
        <DestinationPackagesSection
          country="Dubai"
          title="Dubai Tour Packages"
          subtitle="Choose from our carefully crafted packages for an unforgettable Dubai experience."
          variant="featured"
          limit={6}
          showOnlyFeatured={false}
        />

        {/* Photo Gallery */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Photo Gallery"
              subtitle="Get a glimpse of the stunning experiences awaiting you in Dubai."
            />
            <PhotoGallery images={galleryImages} />
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <SectionHeading
                title="Inquire About Dubai"
                subtitle="Interested in visiting Dubai? Fill out the form and our travel experts will contact you with a personalized itinerary."
              />
              <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
                <ContactForm preselectedDestination="dubai" />
              </div>
            </div>
          </div>
        </section>
        <style jsx global>{`
        @keyframes food-slider {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-food-slider {
          width: max-content;
          animation: food-slider 28s linear infinite;
        }
      `}</style>
      </Layout>
    </AnimatedDestinationPage>
  );
}