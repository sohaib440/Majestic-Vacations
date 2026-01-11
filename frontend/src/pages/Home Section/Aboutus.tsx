import { MapPin, Briefcase, Shield } from "lucide-react";

export default function Aboutus() {
  const stats = [
    { value: "20+", label: "Years Experience" },
    { value: "530+", label: "Tour Packages" },
    { value: "850+", label: "Happy Customers" },
    { value: "320+", label: "Awards Won" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Image */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800"
              alt="About Us"
              className="rounded-xl shadow-xl w-full object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h4 className="text-theme font-semibold mb-2 uppercase tracking-wider">
              Get To Know Us
            </h4>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-6 leading-tight">
              Explore All Tours of the World with Us
            </h2>

            <p className="text-gray-700 text-base md:text-lg mb-8">
              We love travel and are all about creating amazing experiences. Our team is dedicated to making every journey unforgettable
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="text-theme w-6 h-6" />
                <span className="font-medium text-gray-800">
                  Expert Tour Guides
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="text-theme w-6 h-6" />
                <span className="font-medium text-gray-800">
                  Affordable Prices
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="text-theme w-6 h-6" />
                <span className="font-medium text-gray-800">
                  Reliable Service
                </span>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded-xl shadow-lg">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-theme mb-1">
                    {stat.value}
                  </h3>
                  <span className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div> */}

          </div>
        </div>
      </div>
    </section>
  );
}
