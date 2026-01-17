// src/components/shared/TourDetailPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
   ArrowLeft,
   Edit,
   Trash2,
   Calendar,
   Users,
   Star,
   MapPin,
   CheckCircle,
   DollarSign,
   TrendingUp,
   Eye,
   Share2,
   Heart,
   AlertTriangle
} from 'lucide-react';
import { useGetTourById, useDeleteTour } from '@/features/tourPackageApi';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { formatPrice } from '@/lib/tour-utils';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CurrencyPrice } from './currency/CurrencyPrice'; 
const baseUrl = import.meta.env.VITE_API_URL

// import { useAuth } from '@/contexts/AuthContext';

interface TourDetailPageProps {
   id?: string;
   isAdmin?: boolean;
   includeDeleted?: boolean;
}

const TourDetailPage: React.FC<TourDetailPageProps> = ({
   id,
   isAdmin: propIsAdmin,
   includeDeleted = false
}) => {
   const navigate = useNavigate();
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

   // Get user from localStorage directly
   const getCurrentUser = () => {
      if (typeof window === 'undefined') return null;
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
   };

   const currentUser = getCurrentUser();
   const userRole = currentUser?.role;

   // Determine if user is admin
   const isUserAdmin = userRole === 'admin';

   // Use props if provided, otherwise determine from context
   const isAdmin = propIsAdmin !== undefined ? propIsAdmin : isUserAdmin;

   const { data: tourResponse, isLoading, error } = useGetTourById(id || '', includeDeleted);
   const deleteTour = useDeleteTour();

   if (isLoading) {
      return (
         <div className="container mx-auto py-8">
            <LoadingSpinner />
         </div>
      );
   }

   if (error || !tourResponse?.data?.tour) {
      return (
         <div className="container mx-auto py-8">
            <Card>
               <CardContent className="py-12 text-center">
                  <div className="text-gray-400 mb-4">Tour package not found</div>
                  <Button onClick={() => navigate(-1)}>
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Go Back
                  </Button>
               </CardContent>
            </Card>
         </div>
      );
   }

   const tour = tourResponse.data.tour;

   const handleDelete = async () => {
      try {
         await deleteTour.mutateAsync(tour._id);
         toast({
            title: 'Success',
            description: 'Tour package deleted successfully',
         });
         navigate('/admin/packages');
      } catch (error: any) {
         toast({
            title: 'Error',
            description: error.message || 'Failed to delete tour package',
            variant: 'destructive',
         });
      }
   };

   const discountPercentage = tour.originalPrice && tour.originalPrice > tour.price
      ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
      : 0;

   return (
      <div className="container mx-auto py-8 space-y-6">
         {/* Header - Different for public vs admin */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(-1)}
               >
                  <ArrowLeft className="h-4 w-4" />
               </Button>
               <div>
                  <h1 className="text-3xl font-bold tracking-tight">{tour.title}</h1>
                  <p className="text-muted-foreground">
                     {isAdmin && `Created on ${new Date(tour.createdAt).toLocaleDateString()}`}
                     {!isAdmin && `${tour.destination} • ${tour.duration}`}
                  </p>
               </div>
            </div>

            {/* Conditional header buttons */}
            {isAdmin ? (
               <div className="flex items-center gap-2">
                  <Button
                     variant="outline"
                     onClick={() => navigate(`/admin/packages/${tour._id}/edit`)}
                  >
                     <Edit className="mr-2 h-4 w-4" />
                     Edit
                  </Button>
                  <Button
                     variant="destructive"
                     onClick={() => setShowDeleteDialog(true)}
                     disabled={deleteTour.isPending}
                  >
                     <Trash2 className="mr-2 h-4 w-4" />
                     Delete
                  </Button>
               </div>
            ) : (
               <div className="flex items-center gap-2">
                  <Button
                     className="bg-primary hover:bg-primary/90"
                        onClick={() => navigate(`/booking/create?tourId=${tour._id}`)}
                  >
                     Book Now
                  </Button>
               </div>
            )}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info (Same for both) */}
            <div className="lg:col-span-2 space-y-6">
               {/* Main Image */}
               <Card className={!isAdmin ? "border-0 shadow-none" : ""}>
                  <CardContent className="p-0">
                     <div className="relative">
                        <img
                           src={
                              tour.images && tour.images.length > 0
                                 ? `${baseUrl}/${tour.images[0]}`
                                 : '/placeholder.svg'
                           }
                           alt={tour.title}
                           className="w-full h-96 object-cover rounded-lg"
                           onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                        />
                        <div className="absolute top-4 right-4 space-y-2">
                           {tour.featured && (
                              <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-sm">
                                 Featured
                              </Badge>
                           )}
                           {discountPercentage > 0 && (
                              <Badge className="bg-red-500 hover:bg-red-600 text-white text-sm">
                                 {discountPercentage}% OFF
                              </Badge>
                           )}
                        </div>
                     </div>
                  </CardContent>
               </Card>
               {/* Highlights */}
               {tour.highlights && tour.highlights.length > 0 && (
                  <Card className={!isAdmin  ? "border-0 shadow-none" : ""}>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <CheckCircle className="h-5 w-5 text-green-500" />
                           Tour Highlights
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           {tour.highlights.map((highlight, index) => (
                              <div key={index} className="space-y-2">
                                 {/* Render the highlight text */}
                                 <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{highlight.text}</span>
                                 </div>

                                 {/* Render media if it exists */}
                                 {highlight.media && highlight.mediaType && (
                                    <div className="ml-6 mt-2">
                                       {highlight.mediaType === 'image' ? (
                                          <img
                                             src={`${baseUrl}/${highlight.media}`}
                                             alt={`Highlight ${index + 1}`}
                                             className="max-w-md rounded-lg border"
                                             onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                                          />
                                       ) : highlight.mediaType === 'video' ? (
                                          <video
                                             src={`${baseUrl}/${highlight.media}`}
                                             controls
                                             className="max-w-md rounded-lg border"
                                          >
                                             Your browser does not support the video tag.
                                          </video>
                                       ) : null}
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Admin-only details section */}
               {isAdmin && (
                  <Card>
                     <CardHeader>
                        <CardTitle>Package Details</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Created</p>
                              <p className="text-sm">{new Date(tour.createdAt).toLocaleDateString()}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Last Updated</p>
                              <p className="text-sm">{new Date(tour.updatedAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
               {/* Quick Stats */}
               <Card className={!isAdmin  ? "border-0 shadow-none" : ""}>
                  <CardHeader>
                     <CardTitle>Tour Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <MapPin className="h-4 w-4 text-blue-500" />
                           <span className="text-sm">Destination</span>
                        </div>
                        <span className="font-medium">{tour.destination}</span>
                     </div>

                     <Separator />

                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-purple-500" />
                           <span className="text-sm">Duration</span>
                        </div>
                        <span className="font-medium">{tour.duration}</span>
                     </div>

                     <Separator />

                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-green-500" />
                           <span className="text-sm">Group Size</span>
                        </div>
                        <span className="font-medium">{tour.groupSize}</span>
                     </div>

                     <Separator />

                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Star className="h-4 w-4 text-yellow-500" />
                           <span className="text-sm">Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="font-medium">{tour.rating?.toFixed(1) || '4.8'}</span>
                           <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                 <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < Math.floor(tour.rating || 4.8)
                                       ? 'text-yellow-500 fill-yellow-500'
                                       : 'text-gray-300'
                                       }`}
                                 />
                              ))}
                           </div>
                        </div>
                     </div>

                     <Separator />

                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">Seat Availability</span>
                           </div>
                           <span className={`text-sm font-medium ${tour.availableSeats === 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {tour.availableSeats} / {tour.groupSize} available
                           </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                           <div
                              className={`h-2 rounded-full ${tour.availableSeats === 0 ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{
                                 width: `${Math.min(100, (tour.bookedSeats / tour.groupSize) * 100)}%`
                              }}
                           />
                        </div>

                        {/* Detailed breakdown (optional) */}
                        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                           <div className="text-center">
                              <div className="font-medium">{tour.groupSize}</div>
                              <div>Total Seats</div>
                           </div>
                           <div className="text-center">
                              <div className="font-medium">{tour.bookedSeats}</div>
                              <div>Booked</div>
                           </div>
                           <div className="text-center">
                              <div className={`font-medium ${tour.availableSeats === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                 {tour.availableSeats}
                              </div>
                              <div>Available</div>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Pricing Card */}
               <Card className={!isAdmin  ? "border-2 border-primary/20 shadow-lg" : ""}>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        {!isAdmin  ? "Package Price" : "Pricing Details"}
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <span className="text-sm text-muted-foreground">
                              {!isAdmin  ? "Price per person" : "Current Price"}
                           </span>
                           <CurrencyPrice
                              amount={tour.price}
                              variant="detail"
                              className={!isAdmin ? "text-primary" : "text-green-600"}
                           />
                        </div>

                        {tour.originalPrice && tour.originalPrice > tour.price && (
                           <>
                              <div className="flex items-center justify-between">
                                 <span className="text-sm text-muted-foreground">Original Price</span>
                                 <CurrencyPrice
                                    amount={tour.originalPrice}
                                    variant="compact"
                                    className="text-lg line-through text-gray-500"
                                 />
                              </div>

                              <div className="flex items-center justify-between">
                                 <span className="text-sm text-muted-foreground">You Save</span>
                                 <div className="text-lg font-semibold text-red-600">
                                    <CurrencyPrice
                                       amount={tour.originalPrice - tour.price}
                                       variant="compact"
                                       showSymbol={false}
                                    />
                                    <span className="text-sm ml-1">({discountPercentage}%)</span>
                                 </div>
                              </div>
                           </>
                        )}
                     </div>

                     <Separator />

                     {!isAdmin  ? (
                        <Button
                           className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                           onClick={() => navigate(`/booking/create?tourId=${tour._id}`)}
                        >
                           Book This Tour
                        </Button>
                     ) : (
                        <div className="bg-blue-50 p-3 rounded-lg">
                           <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium text-blue-700">Revenue Potential</span>
                           </div>
                           <p className="text-xs text-blue-600">
                              Based on an average group size, this package can generate approximately{' '}
                              <span className="font-semibold">
                                 {formatPrice(tour.price * 6)}
                              </span>{' '}
                              per booking.
                           </p>
                        </div>
                     )}
                  </CardContent>
               </Card>

               {/* Conditional Actions */}
               {isAdmin && (
                  <Card>
                     <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <Button
                           variant="outline"
                           className="w-full justify-start"
                           onClick={() => navigate(`/admin/packages/${tour._id}/edit`)}
                        >
                           <Edit className="mr-2 h-4 w-4" />
                           Edit Package
                        </Button>
                        <Button
                           variant="outline"
                           className="w-full justify-start"
                           onClick={() => {
                              window.open(`/tours/${tour._id}`, '_blank');
                           }}
                        >
                           <Eye className="mr-2 h-4 w-4" />
                           View Public Page
                        </Button>
                        <Button
                           variant="destructive"
                           className="w-full justify-start"
                           onClick={() => setShowDeleteDialog(true)}
                           disabled={deleteTour.isPending}
                        >
                           <Trash2 className="mr-2 h-4 w-4" />
                           Delete Package
                        </Button>
                     </CardContent>
                  </Card>
               )}
            </div>
         </div>

         {/* Delete Confirmation Dialog (Admin only) */}
         {isAdmin && (
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                     <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the tour package
                        "{tour.title}" and remove it from the database.
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel>Cancel</AlertDialogCancel>
                     <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                     >
                        Delete
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         )}
         {isAdmin && tour.isDeleted && (
            <Alert variant="destructive">
               <AlertTriangle className="h-4 w-4" />
               <AlertTitle>This tour is deleted</AlertTitle>
               <AlertDescription>
                  This tour is marked as deleted and hidden from public view.
                  You can restore it by editing and setting it to active.
               </AlertDescription>
            </Alert>
         )}
      </div>
   );
};

export default TourDetailPage;