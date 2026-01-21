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
  { src: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80", alt: "Santorini" },
  { src: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", alt: "Oia Sunset" },
  { src: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80", alt: "Acropolis" },
  { src: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800&q=80", alt: "Crete" },
  { src: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80", alt: "Mykonos" },
  { src: "https://images.unsplash.com/photo-1601581875039-e899893d520c?w=800&q=80", alt: "Greek Food" },
  { src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80", alt: "Meteora" },
  { src: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=80", alt: "Greek Beach" },
];

const greeceFoods = [
  {
    name: "Gyro",
    image:
      "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c291dmxha2l8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Souvlaki",
    image:
      "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&q=80",
  },
  {
    name: "Moussaka",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_zvGIPlvy801IQvpSApjD8ZU9pZMnyrLKeQ&s",
  },
  {
    name: "Greek Salad",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS63pnAYNNEoH9jHp3VIFPTTHpxKljmCGdW3Q&s",
  },
  {
    name: "Spanakopita",
    image:
      "https://as1.ftcdn.net/v2/jpg/15/70/80/00/1000_F_1570800030_lmcs9n26DZpkCxI2kVSQyunJ4fJ9vlqf.jpg",
  },
  {
    name: "Baklava",
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
  },
];

export default function Greece() {
  const scrollToContact = () => {
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  const carouselItems: CarouselItem[] = [
    {
      imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2070&auto=format&fit=crop",
      title: "Santorini",
      description: "Experience the iconic white-washed buildings, blue-domed churches, and stunning sunset views over the Aegean Sea.",
      link: "#santorini"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=987&auto=format&fit=crop",
      title: "The Acropolis",
      description: "Visit the ancient citadel and marvel at the magnificent Parthenon, the crown jewel of Athens.",
      link: "#acropolis"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1601581987809-a874a81309c9?q=80&w=987&auto=format&fit=crop",
      title: "Mykonos",
      description: "Enjoy the vibrant nightlife, beautiful beaches, and charming windmills of this cosmopolitan Greek island.",
      link: "#mykonos"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=987&auto=format&fit=crop",
      title: "Meteora",
      description: "Discover the breathtaking monasteries perched on top of massive rock formations, suspended between heaven and earth.",
      link: "#meteora"
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
            // poster="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2070&auto=format&fit=crop"
            >
              <source src={"https://res.cloudinary.com/diwuj7tkd/video/upload/v1767892889/greece_video_cza1ck.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
            <p className="text-accent text-lg font-medium mb-4">🇬🇷 Hellenic Republic</p>
            <h1 className="hero-title font-serif text-4xl md:text-6xl font-bold mb-6">
              Discover Greece
            </h1>
            <p className="hero-subtitle text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90">
              Where Ancient Myths Come Alive
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
                  <p className="font-semibold">Southern Europe</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Best Time</p>
                  <p className="font-semibold">May - October</p>
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
                  <p className="font-semibold">EUR (Euro)</p>
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
                <SectionHeading title="About Greece" centered={false} />
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Greece, the cradle of Western civilization, offers an enchanting blend of ancient history,
                    stunning natural beauty, and warm Mediterranean hospitality. From the iconic blue-domed
                    churches of Santorini to the ancient ruins of Athens, every moment in Greece feels magical.
                  </p>
                  <p>
                    With over 6,000 islands scattered across the Aegean and Ionian seas, Greece offers endless
                    opportunities for island hopping, beach lounging, and maritime adventures. Each island has
                    its own unique character, from the party atmosphere of Mykonos to the serene beauty of Naxos.
                  </p>
                  <p>
                    Indulge in delicious Greek cuisine featuring fresh seafood, olive oil, feta cheese, and
                    local wines while watching the sunset paint the Aegean sky in shades of orange and pink.
                    Greece is not just a destination; it's an experience that touches the soul.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80"
                  alt="Santorini Sunset"
                  className="rounded-xl object-cover h-64 w-full"
                />
                <img
                  src="https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80"
                  alt="Acropolis"
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
        {/* Famous Foods in Greece */}
        <section className="py-20 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Famous Foods in Greece"
              subtitle="A taste of authentic Mediterranean flavors."
            />

            <div className="mt-14">
              <div className="flex gap-12 animate-food-slider">
                {[...greeceFoods, ...greeceFoods].map((food, index) => (
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
              country="Greece"
              title="Greece Tour Packages"
              subtitle="Choose from our carefully crafted packages for an unforgettable Greek experience."
              variant="default"
              limit={3}
              showOnlyFeatured={false}
            />

        {/* Photo Gallery */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <SectionHeading
              title="Photo Gallery"
              subtitle="Get a glimpse of the stunning experiences awaiting you in Greece."
            />
            <PhotoGallery images={galleryImages} />
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <SectionHeading
                title="Inquire About Greece"
                subtitle="Interested in visiting Greece? Fill out the form and our travel experts will contact you with a personalized itinerary."
              />
              <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
                <ContactForm preselectedDestination="greece" />
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