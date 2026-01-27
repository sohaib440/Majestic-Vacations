import { Star, MapPin, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PackageInquiryCardProps {
  _id: string;
  packageName: string;
  location: string;
  packageAveragePrice: number;
  packageDescription: string;
  media: { type: string; url: string; thumbnail?: string }[];
  onClick?: () => void;
}

export function PackageInquiryCard({
  _id,
  packageName,
  location,
  packageAveragePrice,
  packageDescription,
  media,
  onClick,
}: PackageInquiryCardProps) {
  const thumbnailImage = media?.[0]?.thumbnail || media?.[0]?.url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80';

  return (
    <Card
      className="h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0 bg-gradient-to-br from-white via-white to-gray-50 group"
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={thumbnailImage}
            alt={packageName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {media && media.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              🖼️ {media.length}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 flex flex-col flex-1">
          {/* Package Name */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300">
            {packageName}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
            {packageDescription || "No description available"}
          </p>

          {/* Location Badge */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 group-hover:border-amber-300 transition-all duration-300">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-700">
              <MapPin className="h-4 w-4" />
              <span>{location || "Location not specified"}</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-200 group-hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-600" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold">
                  Avg Price
                </span>
                <span className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
                  ${packageAveragePrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* View Details Button */}
            <button className="px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-300 hover:shadow-lg text-xs sm:text-sm whitespace-nowrap">
              View
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
