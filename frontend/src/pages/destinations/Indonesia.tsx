import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import PackageCard from "@/components/shared/PackageCard";
import { PhotoGallery } from "@/components/shared/PhotoGallery";
import { ContactForm } from "@/components/shared/ContactForm";
import { MapPin, Calendar, Thermometer, Banknote } from "lucide-react";
import ImageCarousel from "@/components/shared/ImageCarousel";
import type { CarouselItem } from "@/components/shared/ImageCarousel";
import AnimatedDestinationPage from "@/components/destinations/AnimatedDestinationPage";
import DestinationPackagesSection from "@/components/shared/DestinationPackagesSection";
// import IndonesiaVideo from "@/assets/Videos/Indonesia/indonesia video.mp4"

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", alt: "Bali Temple" },
  { src: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&q=80", alt: "Komodo Island" },
  { src: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80", alt: "Borobudur" },
  { src: "https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&q=80", alt: "Rice Terraces" },
  { src: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", alt: "Bali Beach" },
  { src: "https://images.unsplash.com/photo-1570789210967-2cac24f13a24?w=800&q=80", alt: "Gili Islands" },
  { src: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80", alt: "Bali Monkey" },
  { src: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80", alt: "Indonesian Food" },
];

const indonesiaFoods = [
  {
    name: "Nasi Goreng",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReVtbLRhdmcX-Q9fu6wJyDfKW5W4IREdu_7Q&s",
  },
  {
    name: "Satay",
    image:
      "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&q=80",
  },
  {
    name: "Rendang",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6hnFk0T3FMTN_TUWYpC2b4VFeAxl6A4jyyA&s",
  },
  {
    name: "Gado-Gado",
    image:
      "https://images.unsplash.com/photo-1707269561481-a4a0370a980a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FkbyUyMGdhZG98ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Bakso",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLPc5wKBUk_tOctSRo3Gkvmb1vt_ak532UKQ&s",
  },
  {
    name: "Es Cendol",
    image:
      "https://images.unsplash.com/photo-1588461123433-6e389a38b54a?q=80&w=455&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Indonesia() {
  const scrollToContact = () => {
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  const carouselItems: CarouselItem[] = [
    {
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2138&auto=format&fit=crop",
      title: "Bali",
      description: "Experience the Island of Gods with its stunning temples, lush rice terraces, and vibrant Balinese culture.",
      link: "#bali"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=987&auto=format&fit=crop",
      title: "Borobudur Temple",
      description: "Visit the world's largest Buddhist temple and witness magnificent sunrise views from this ancient wonder.",
      link: "#borobudur"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=987&auto=format&fit=crop",
      title: "Komodo National Park",
      description: "Encounter the legendary Komodo dragons and explore pristine diving spots in this UNESCO World Heritage site.",
      link: "#komodo"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=987&auto=format&fit=crop",
      title: "Raja Ampat",
      description: "Dive into the world's most biodiverse marine environment with stunning coral reefs and crystal-clear waters.",
      link: "#raja-ampat"
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
            poster="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2138&auto=format&fit=crop"
            >
              {/* <source src={IndonesiaVideo} type="video/mp4" /> */}

              Your browser does not support the video tag.
            </video>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
            <p className="text-accent text-lg font-medium mb-4">🇮🇩 Republic of Indonesia</p>
            <h1 className="hero-title font-serif text-4xl md:text-6xl font-bold mb-6">
              Discover Indonesia
            </h1>
            <p className="hero-subtitle text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90">
              Discover the Archipelago of Wonders
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
                  <p className="font-semibold">Southeast Asia</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Best Time</p>
                  <p className="font-semibold">Apr - October</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Thermometer className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Climate</p>
                  <p className="font-semibold">Tropical</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Banknote className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-semibold">IDR (Rupiah)</p>
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
                <SectionHeading title="About Indonesia" centered={false} />
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Indonesia, the world's largest archipelago nation, spans over 17,000 islands offering
                    incredible diversity in landscapes, cultures, and experiences. From the spiritual
                    heart of Bali to the prehistoric wonders of Komodo, Indonesia is a treasure trove
                    of adventure.
                  </p>
                  <p>
                    Discover ancient temples emerging from jungle mists, trek through emerald rice terraces,
                    dive into some of the world's most pristine coral reefs, and encounter unique wildlife
                    found nowhere else on Earth. The warmth of Indonesian hospitality, known as "gotong royong,"
                    makes every visitor feel welcome.
                  </p>
                  <p>
                    Whether you're seeking spiritual enlightenment in Ubud, adrenaline-pumping adventures
                    in Flores, or pure relaxation on the Gili Islands, Indonesia offers endless possibilities
                    for the perfect vacation.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1559628233-100c798642d4?w=600&q=80"
                  alt="Rice Terraces"
                  className="rounded-xl object-cover h-64 w-full"
                />
                <img
                  src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80"
                  alt="Bali Beach"
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
        {/* Famous Foods in Indonesia */}
        <section className="py-20 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Famous Foods in Indonesia"
              subtitle="A diverse mix of spices and traditional Indonesian cuisine."
            />

            <div className="mt-14">
              <div className="flex gap-12 animate-food-slider">
                {[...indonesiaFoods, ...indonesiaFoods].map((food, index) => (
                  <div key={index} className="flex flex-col items-center min-w-[160px]">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-36 h-36 rounded-full object-cover border-4 border-accent"
                    />
                    <p className="mt-4 font-semibold">{food.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tour Packages */}
        <DestinationPackagesSection
          country="Indonesia"
          title="Indonesia Tour Packages"
          subtitle="Choose from our carefully crafted packages for an unforgettable Indonesian experience."
          variant="default"
          limit={3}
          showOnlyFeatured={false}
        />

        {/* Photo Gallery */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Photo Gallery"
              subtitle="Get a glimpse of the stunning experiences awaiting you in Indonesia."
            />
            <PhotoGallery images={galleryImages} />
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <SectionHeading
                title="Inquire About Indonesia"
                subtitle="Interested in visiting Indonesia? Fill out the form and our travel experts will contact you with a personalized itinerary."
              />
              <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
                <ContactForm preselectedDestination="indonesia" />
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