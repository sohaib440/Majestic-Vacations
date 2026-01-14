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
  { src: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80", alt: "Bangkok Temples" },
  { src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80", alt: "Thai Beach" },
  { src: "https://plus.unsplash.com/premium_photo-1661929242720-140374d97c94?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpYW5nJTIwbWFpfGVufDB8fDB8fHww", alt: "Chiang Mai" },
  { src: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80", alt: "Phi Phi Islands" },
  { src: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80", alt: "Thai Elephants" },
  { src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80", alt: "Thai Food" },
  { src: "https://images.unsplash.com/photo-1563315001-ab59cc08977f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZsb2F0aW5nJTIwbWFya2V0fGVufDB8fDB8fHww", alt: "Floating Market" },
  { src: "https://images.unsplash.com/photo-1585086187927-0b50cce8d60d?w=800&q=80", alt: "Thai Longboat" },
];

const thailandFoods = [
  {
    name: "Pad Thai",
    image:
      "https://images.unsplash.com/photo-1655091273851-7bdc2e578a88?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFkJTIwdGhhaXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "Tom Yum Soup",
    image:
      "https://plus.unsplash.com/premium_photo-1669150852121-19bab9ca75f7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dG9tJTIweXVtfGVufDB8fDB8fHww",
  },
  {
    name: "Green Curry",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRslatUHBTZSmDuxhplLdpFC2UWD8aev116WA&s",
  },
  {
    name: "Mango Sticky Rice",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHfpqLXLOAIZQiwmO3CdiLaMXJJkxFE6BPEA&s",
  },
  {
    name: "Som Tam",
    image:
      "https://plus.unsplash.com/premium_photo-1666919621579-2fc3f6918cf6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGhhaWxhbmQlMjBmb29kfGVufDB8fDB8fHww",
  },
  {
    name: "Thai Iced Tea",
    image:
      "https://images.unsplash.com/photo-1644203541701-0c534473e616?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGhhaSUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D",
  },
];

export default function Thailand() {
  const scrollToContact = () => {
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  const carouselItems: CarouselItem[] = [
    {
      imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2139&auto=format&fit=crop",
      title: "Grand Palace Bangkok",
      description: "Explore the opulent former royal residence featuring the sacred Emerald Buddha Temple and stunning Thai architecture.",
      link: "#grand-palace"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=987&auto=format&fit=crop",
      title: "Phi Phi Islands",
      description: "Discover pristine beaches, crystal-clear waters, and vibrant marine life in this tropical paradise.",
      link: "#phi-phi"
    },
    {
      imageUrl: "https://plus.unsplash.com/premium_photo-1661929242720-140374d97c94?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpYW5nJTIwbWFpfGVufDB8fDB8fHww",
      title: "Chiang Mai Temples",
      description: "Visit ancient temples and experience the spiritual heart of Northern Thailand in this cultural gem.",
      link: "#chiang-mai"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1563315001-ab59cc08977f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZsb2F0aW5nJTIwbWFya2V0fGVufDB8fDB8fHww",
      title: "Floating Markets",
      description: "Experience the vibrant atmosphere of traditional floating markets selling local goods and authentic Thai food.",
      link: "#floating-markets"
    },
  ];

  return (
    <AnimatedDestinationPage>
      <Layout>
        {/* Hero Section with Video Background */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={"https://res.cloudinary.com/diwuj7tkd/video/upload/v1767894129/Thailand_kzklfh.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 text-center text-white px-4">
            <p className="text-accent text-lg mb-4">
              🇹🇭 Kingdom of Thailand
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Thailand
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              The Land of Smiles and Tropical Paradise
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
                  <p className="font-semibold">Nov - March</p>
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
                  <p className="font-semibold">THB (Baht)</p>
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
                <SectionHeading title="About Thailand" centered={false} />
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Thailand, known as the "Land of Smiles," welcomes visitors with its perfect blend of
                    ancient traditions and modern conveniences. From the bustling streets of Bangkok to the
                    serene beaches of the islands, Thailand offers experiences that captivate every traveler.
                  </p>
                  <p>
                    Explore ornate temples adorned with gold, interact with gentle elephants at ethical
                    sanctuaries, and discover the rich flavors of Thai cuisine that has captured hearts
                    worldwide. The warm hospitality of Thai people makes every visitor feel at home.
                  </p>
                  <p>
                    Whether you're seeking adventure, relaxation, culture, or cuisine, Thailand delivers
                    in abundance. From snorkeling in crystal-clear waters to exploring ancient ruins,
                    shopping in night markets to indulging in world-class spa treatments, Thailand is
                    a paradise for all types of travelers.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80"
                  alt="Thai Beach"
                  className="rounded-xl object-cover h-64 w-full"
                />
                <img
                  src="https://images.unsplash.com/photo-1569569970363-df7b6160d111?w=600&q=80"
                  alt="Thai Temple"
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
        {/* Famous Foods in Thailand */}
        <section className="py-20 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Famous Foods in Thailand"
              subtitle="Bold, spicy, and vibrant flavors from Thai cuisine."
            />

            <div className="mt-14">
              <div className="flex gap-12 animate-food-slider">
                {[...thailandFoods, ...thailandFoods].map((food, index) => (
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
              country="Thailand"
              title="Thailand Tour Packages"
              subtitle="Choose from our carefully crafted packages for an unforgettable Thai experience."
              variant="default"
              limit={3}
              showOnlyFeatured={false}
            />

        {/* Photo Gallery */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Photo Gallery"
              subtitle="Get a glimpse of the stunning experiences awaiting you in Thailand."
            />
            <PhotoGallery images={galleryImages} />
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <SectionHeading
                title="Inquire About Thailand"
                subtitle="Interested in visiting Thailand? Fill out the form and our travel experts will contact you with a personalized itinerary."
              />
              <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
                <ContactForm preselectedDestination="thailand" />
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