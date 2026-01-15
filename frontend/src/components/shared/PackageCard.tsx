// src/components/shared/PackageCard.tsx
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   MapPin,
   Calendar,
   Users,
   Star,
   Flag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TourPackage } from '@/types/tour-package';
import { formatPrice } from '@/lib/tour-utils';

export interface PackageCardProps {
   tour: TourPackage;
   onInquire?: (tour: TourPackage) => void;
   onView?: (tour: TourPackage) => void;
   variant?: 'default' | 'compact' | 'featured';
}

const baseUrl = import.meta.env.VITE_API_URL || '';

const PackageCard: React.FC<PackageCardProps> = ({
   tour,
   onInquire,
   onView,
   variant = 'default'
}) => {
   const navigate = useNavigate();
   const discountPercentage = tour.originalPrice && tour.originalPrice > tour.price
      ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
      : 0;

   const imageUrl = tour.images && tour.images.length > 0
      ? `${baseUrl}/${tour.images[0]}`
      : '/placeholder.svg';

   const formattedDate = tour.startDate;

   const handleBooking = (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(`/packages/${tour._id}`);
   };

   // Calculate seat availability status
   const getSeatStatus = () => {
      if (tour.availableSeats === 0) {
         return { text: 'Sold Out', color: 'bg-red-500 hover:bg-red-600', show: true };
      } else if (tour.availableSeats <= 3) {
         return { text: `Only ${tour.availableSeats} left`, color: 'bg-yellow-500 hover:bg-yellow-600', show: true };
      } else if (tour.availableSeats <= Math.floor(tour.groupSize * 0.3)) {
         return { text: `Limited Seats`, color: 'bg-orange-500 hover:bg-orange-600', show: true };
      }
      return { text: '', color: '', show: false };
   };
   const isInactive = !tour.isActive;
   const isDeleted = tour.isDeleted;
   const seatStatus = getSeatStatus();

   return (
      <Link to={`/packages/${tour._id}`} className="block">
         <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden">
               <img
                  src={imageUrl}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                     e.currentTarget.src = "/placeholder.svg";
                  }}
               />
               {/* Add status badges */}
               <div className="absolute top-3 left-3 space-y-2">
                  {isDeleted && (
                     <Badge variant="destructive" className="text-xs">
                        Deleted
                     </Badge>
                  )}
                  {isInactive && !isDeleted && (
                     <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                        Inactive
                     </Badge>
                  )}
               </div>
               {tour.images && tour.images.length > 1 && (
                  <Badge className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/80 text-white text-xs">
                     +{tour.images.length - 1} more
                  </Badge>
               )}

               <div className="absolute top-3 right-3 space-y-2">
                  {tour.featured && (
                     <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs">
                        Featured
                     </Badge>
                  )}
                  {discountPercentage > 0 && (
                     <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                        -{discountPercentage}%
                     </Badge>
                  )}
                  {seatStatus.show && (
                     <Badge className={`${seatStatus.color} text-white text-xs`}>
                        {seatStatus.text}
                     </Badge>
                  )}
               </div>
            </div>

            <CardContent className="p-5 flex-1">
               <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{tour.destination}</span>
                  <span className="ml-auto flex items-center gap-1">
                     <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                     <span className="font-medium">{tour.rating?.toFixed(1) || '4.8'}</span>
                  </span>
               </div>

               <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                     <Flag className="h-3 w-3 mr-1" />
                     {tour.country}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                     <Calendar className="h-3 w-3 mr-1" />
                     {formattedDate}
                  </Badge>
               </div>

               <h3 className="font-serif text-lg font-semibold mb-3 line-clamp-2">{tour.title}</h3>

               <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                     <Calendar className="h-4 w-4" />
                     {tour.duration}
                  </span>
                  <span className="flex items-center gap-1">
                     <Users className="h-4 w-4" />
                     Group: {tour.groupSize}
                  </span>
               </div>

               {/* Seat availability progress bar */}
               {tour.groupSize > 0 && (
                  <div className="mb-4">
                     <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Seats: {tour.availableSeats} / {tour.groupSize} available</span>
                        <span>{Math.round((tour.bookedSeats / tour.groupSize) * 100)}% booked</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                           className={`h-1.5 rounded-full ${tour.availableSeats === 0
                                 ? 'bg-red-500'
                                 : tour.availableSeats <= 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                              }`}
                           style={{
                              width: `${Math.min(100, (tour.bookedSeats / tour.groupSize) * 100)}%`
                           }}
                        />
                     </div>
                  </div>
               )}

               {tour.highlights && tour.highlights.length > 0 && (
                  <ul className="space-y-1 mb-4">
                     {tour.highlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                           {typeof highlight === 'string' ? highlight : highlight.text}
                        </li>
                     ))}
                  </ul>
               )}
            </CardContent>

            <CardFooter className="p-5 pt-0 flex items-end justify-between">
               <div>
                  {tour.originalPrice && tour.originalPrice > tour.price && (
                     <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(tour.originalPrice)}
                     </p>
                  )}
                  <div className="flex items-baseline gap-1">
                     <span className="text-2xl font-serif font-bold text-primary">
                        {formatPrice(tour.price)}
                     </span>
                     <span className="text-sm font-normal text-muted-foreground">/person</span>
                  </div>
               </div>
               <Button
                  onClick={handleBooking}
                  className="bg-primary hover:bg-primary/90"
                  disabled={tour.availableSeats === 0}
               >
                  {tour.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
               </Button>
            </CardFooter>
         </Card>
      </Link>
   );
};

export default PackageCard;