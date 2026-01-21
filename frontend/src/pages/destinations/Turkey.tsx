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

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80", alt: "Istanbul Skyline" },
  { src: "https://plus.unsplash.com/premium_photo-1661963652315-d5a9d26637dd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cappadocia Balloons" },
  { src: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80", alt: "Antalya Coast" },
  { src: "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=800&q=80", alt: "Hagia Sophia" },
  { src: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80", alt: "Pamukkale" },
  { src: "https://images.unsplash.com/photo-1602941889598-3e7780b9a602?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Blue Mosque" },
  { src: "https://images.unsplash.com/photo-1567408773508-4e5da32afafd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Grand Bazaar" },
  { src: "https://images.unsplash.com/photo-1601313372155-764776db03be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Turkish Tea" },
];

const turkeyFoods = [
  {
    name: "Kebab",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
  },
  {
    name: "Doner",
    image:
      "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&q=80",
  },
  {
    name: "Baklava",
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
  },
  {
    name: "Pide",
    image:
      "https://images.unsplash.com/photo-1653982960203-c8361d7bed96?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Lahmacun",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQefrwiuIufG_UFvKVobt3IIyZrFJy8gPPhFA&s",
  },
  {
    name: "Turkish Tea",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz26kN8dNo2-LpeLS_b8oODL0DSp5pHpUyDA&s",
  },
];

export default function Turkey() {
  const scrollToContact = () => {
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  const carouselItems: CarouselItem[] = [
    {
      imageUrl: "https://plus.unsplash.com/premium_photo-1661963652315-d5a9d26637dd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Cappadocia",
      description: "Witness the magical landscape of fairy chimneys and take an unforgettable hot air balloon ride over stunning volcanic formations.",
      link: "#cappadocia"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=987&auto=format&fit=crop",
      title: "Hagia Sophia",
      description: "Marvel at this architectural masterpiece that has served as a church, mosque, and museum throughout history.",
      link: "#hagia-sophia"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1595846415458-404defd93fb6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Pamukkale",
      description: "Explore the stunning white travertine terraces and ancient ruins of Hierapolis, a UNESCO World Heritage site.",
      link: "#pamukkale"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1650802314281-50646ff3f65c?q=80&w=881&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Blue Mosque",
      description: "Visit this stunning Ottoman-era mosque famous for its intricate blue tiles and magnificent six minarets.",
      link: "#blue-mosque"
    },
  ];

  return (
    <AnimatedDestinationPage>
      <Layout>
        {/* Hero Section with Video Background */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              // poster="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop"
            >
              <source src={"https://res.cloudinary.com/diwuj7tkd/video/upload/v1767893616/turkey_video_dy2vj0.mp4"} type="video/mp4" />

              Your browser does not support the video tag.
            </video>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
            <p className="text-accent text-lg font-medium mb-4">🇹🇷 Türkiye</p>
            <h1 className="hero-title font-serif text-4xl md:text-6xl font-bold mb-6">
              Discover Turkey
            </h1>
            <p className="hero-subtitle text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90">
              Where East Meets West in Perfect Harmony
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
                  <p className="font-semibold">Europe & Asia</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Best Time</p>
                  <p className="font-semibold">Apr - Oct</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Thermometer className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Climate</p>
                  <p className="font-semibold">Mediterranean</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Banknote className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-semibold">TRY (Lira)</p>
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
                <SectionHeading title="About Turkey" centered={false} />
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Turkey is a transcontinental country bridging Europe and Asia, offering an incredible
                    tapestry of ancient history, stunning landscapes, and warm hospitality. From the minarets
                    of Istanbul to the fairy chimneys of Cappadocia, every corner tells a story.
                  </p>
                  <p>
                    Experience the grandeur of Byzantine and Ottoman empires through magnificent mosques and
                    palaces, explore ancient Greek and Roman ruins, and unwind on pristine Mediterranean beaches.
                    The Turkish cuisine, famous for its kebabs, mezes, and baklava, will delight your taste buds.
                  </p>
                  <p>
                    Whether you're floating in a hot air balloon over Cappadocia at sunrise, cruising the
                    Bosphorus between two continents, or haggling in the Grand Bazaar, Turkey offers adventures
                    that will stay with you forever.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://plus.unsplash.com/premium_photo-1661963652315-d5a9d26637dd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Cappadocia"
                  className="rounded-xl object-cover h-64 w-full"
                />
                <img
                  src="https://images.unsplash.com/photo-1589561454226-796a8aa89b05?w=600&q=80"
                  alt="Hagia Sophia"
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
        {/* Famous Foods in Turkey */}
        <section className="py-20 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Famous Foods in Turkey"
              subtitle="Discover the rich and flavorful heritage of Turkish cuisine."
            />

            <div className="mt-14 relative">
              <div className="flex gap-12 animate-food-slider">
                {[...turkeyFoods, ...turkeyFoods].map((food, index) => (
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
          country="Turkey"
          title="Turkey Tour Packages"
          subtitle="Choose from our carefully crafted packages for an unforgettable Turkish experience."
          variant="default"
          limit={3}
          showOnlyFeatured={false}
        />

        {/* Photo Gallery */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Photo Gallery"
              subtitle="Get a glimpse of the stunning experiences awaiting you in Turkey."
            />
            <PhotoGallery images={galleryImages} />
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <SectionHeading
                title="Inquire About Turkey"
                subtitle="Interested in visiting Turkey? Fill out the form and our travel experts will contact you with a personalized itinerary."
              />
              <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
                <ContactForm preselectedDestination="turkey" />
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