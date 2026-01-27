import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  destination: string;
  onClick?: () => void;
}

export function TestimonialCard({
  name,
  location,
  avatar,
  rating,
  text,
  destination,
  onClick,
}: TestimonialCardProps) {
  return (
    <Card 
      className="h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0 bg-gradient-to-br from-white via-white to-gray-50 group" 
      onClick={onClick}
    >
      <CardContent className="p-6 sm:p-8 flex flex-col h-full">
        {/* Quote Icon with Accent */}
        <div className="mb-6 inline-flex">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-100 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
            <Quote className="h-10 w-10 sm:h-12 sm:w-12 text-amber-500 relative" />
          </div>
        </div>

        {/* Star Rating - Enhanced */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:scale-110 ${
                  i < rating
                    ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs sm:text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            {rating}.0
          </span>
        </div>

        {/* Review Text - Responsive */}
        <p className="text-gray-700 text-sm sm:text-base mb-6 line-clamp-4 leading-relaxed flex-1 font-medium italic relative">
          <span className="text-2xl sm:text-3xl text-amber-200 absolute -left-2 -top-2">"</span>
          {text}
          <span className="text-2xl sm:text-3xl text-amber-200 absolute -right-2 bottom-0">"</span>
        </p>

        {/* Destination Badge - Responsive */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg px-4 py-3 sm:py-4 mb-6 group-hover:border-amber-300 transition-all duration-300">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            ✈️ Destination
          </p>
          <p className="text-sm sm:text-base font-bold text-amber-900 mt-1 truncate">
            {destination}
          </p>
        </div>

        {/* User Info Footer - Responsive */}
        <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 group-hover:border-gray-300 transition-all duration-300">
          <div className="relative flex-shrink-0">
            <img
              src={avatar}
              alt={name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover border-2 sm:border-3 border-amber-400 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm sm:text-base truncate group-hover:text-amber-700 transition-colors duration-300">
              {name}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 truncate group-hover:text-gray-700 transition-colors duration-300">
              <span>📍</span>
              {location}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
