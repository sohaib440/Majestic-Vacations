// src/pages/admin/bookings/[id]/page.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
   ArrowLeft,
   Calendar,
   Users,
   MapPin,
   Phone,
   Mail,
   User,
   FileText,
   AlertCircle,
   Copy,
   CheckCircle,
   Building,
   Shield,
   CreditCard,
   Package
} from 'lucide-react';
import { useGetBookingById, useCancelBooking, useUpdateBooking } from '@/features/bookingApi';
import { BookingForm } from '@/components/booking/BookingForm';
import { toast } from '@/hooks/use-toast';
import { UpdateBookingDto } from '@/types/booking';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
   pending: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      icon: <AlertCircle className="h-5 w-5" />
   },
   confirmed: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      icon: <CheckCircle className="h-5 w-5" />
   },
   cancelled: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      icon: <AlertCircle className="h-5 w-5" />
   },
   completed: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      icon: <CheckCircle className="h-5 w-5" />
   },
};

export default function BookingDetailPage() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const [copied, setCopied] = useState(false);
   const [isEditing, setIsEditing] = useState(false);

   const { data: bookingData, isLoading, refetch } = useGetBookingById(id!);
   const cancelBookingMutation = useCancelBooking();
   const updateBookingMutation = useUpdateBooking();

   const booking = bookingData?.data;

   const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
         title: 'Copied!',
         description: 'Booking reference copied to clipboard',
      });
   };

   const handleCancelBooking = async () => {
      if (!window.confirm('Are you sure you want to cancel this booking?')) return;

      try {
         await cancelBookingMutation.mutateAsync(id!);
         toast({
            title: 'Success',
            description: 'Booking cancelled successfully',
         });
         refetch();
      } catch (error) {
         toast({
            title: 'Error',
            description: 'Failed to cancel booking',
            variant: 'destructive',
         });
      }
   };

   const handleUpdateBooking = async (data: UpdateBookingDto) => {
      try {
         await updateBookingMutation.mutateAsync({ id: id!, bookingData: data });
         toast({
            title: 'Success',
            description: 'Booking updated successfully',
         });
         setIsEditing(false);
         refetch();
      } catch (error) {
         toast({
            title: 'Error',
            description: 'Failed to update booking',
            variant: 'destructive',
         });
      }
   };

   if (isLoading) {
      return (
         <div className="space-y-6">
            <div className="flex items-center gap-4">
               <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4" />
               </Button>
               <Skeleton className="h-8 w-48" />
            </div>
            <div className="space-y-4">
               <Skeleton className="h-48 w-full" />
               <Skeleton className="h-96 w-full" />
            </div>
         </div>
      );
   }

   if (!booking) {
      return (
         <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Booking not found</h2>
            <p className="text-muted-foreground mt-2">
               The booking you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => navigate('/admin/bookings')}>
               Back to Bookings
            </Button>
         </div>
      );
   }

   const status = statusColors[booking.bookingStatus];

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4" />
               </Button>
               <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                     Booking Details
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                     <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} ${status.text}`}>
                        {status.icon}
                        <span className="font-medium">{booking.displayStatus || booking.bookingStatus}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                           {booking.bookingReference}
                        </span>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="h-6 w-6"
                           onClick={() => copyToClipboard(booking.bookingReference)}
                        >
                           {copied ? (
                              <CheckCircle className="h-3 w-3" />
                           ) : (
                              <Copy className="h-3 w-3" />
                           )}
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-2">
               {booking.bookingStatus !== 'cancelled' && (
                  <Button
                     variant="destructive"
                     onClick={handleCancelBooking}
                     disabled={cancelBookingMutation.isPending}
                  >
                     Cancel Booking
                  </Button>
               )}
               <Button onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'View Details' : 'Edit Booking'}
               </Button>
            </div>
         </div>

         {isEditing ? (
            <Card>
               <CardContent className="pt-6">
                  <BookingForm
                     initialData={booking}
                     onSubmit={handleUpdateBooking}
                     isLoading={updateBookingMutation.isPending}
                     isUpdate={true}
                  />
               </CardContent>
            </Card>
         ) : (
            <Tabs defaultValue="overview" className="space-y-6">
               <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="tour">Tour Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
               </TabsList>

               <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {/* Booking Summary */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Booking Summary
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-2">
                              <div className="flex justify-between">
                                 <span className="text-muted-foreground">Booking Date:</span>
                                 <span className="font-medium">
                                    {format(new Date(booking.createdAt), 'PPP')}
                                 </span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-muted-foreground">Tour Date:</span>
                                 <span className="font-medium">
                                    {format(new Date(booking.bookingDetails.tourDate), 'PPP')}
                                 </span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-muted-foreground">Total Travelers:</span>
                                 <span className="font-medium">
                                    {booking.totalTravelers ||
                                       (booking.bookingDetails.numberOfTravelers.adults +
                                          booking.bookingDetails.numberOfTravelers.children +
                                          booking.bookingDetails.numberOfTravelers.infants)}
                                 </span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-muted-foreground">Room Preference:</span>
                                 <span className="font-medium capitalize">
                                    {booking.bookingDetails.roomPreference}
                                 </span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-muted-foreground">Travel Insurance:</span>
                                 <span className="font-medium">
                                    {booking.travelInsurance ? 'Yes' : 'No'}
                                 </span>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     {/* Seat Information */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Users className="h-5 w-5" />
                              Seat Information
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           {booking.seatInfo ? (
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Total Seats:</span>
                                    <span className="text-2xl font-bold">{booking.seatInfo.totalSeats}</span>
                                 </div>
                                 <div className="space-y-2">
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Booked:</span>
                                       <span className="font-medium">{booking.seatInfo.bookedSeats}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Available:</span>
                                       <span className="font-medium text-green-600">
                                          {booking.seatInfo.availableSeats}
                                       </span>
                                    </div>
                                 </div>
                                 <Separator />
                                 <div className="pt-2">
                                    <p className="text-sm text-muted-foreground">
                                       This booking uses {booking.seatInfo.booked || booking.totalTravelers} seats
                                    </p>
                                 </div>
                              </div>
                           ) : (
                              <div className="text-center py-4">
                                 <p className="text-muted-foreground">Seat information not available</p>
                              </div>
                           )}
                        </CardContent>
                     </Card>

                     {/* Timeline */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              Timeline
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                 <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                 <div>
                                    <p className="font-medium">Booking Created</p>
                                    <p className="text-sm text-muted-foreground">
                                       {format(new Date(booking.createdAt), 'PPpp')}
                                    </p>
                                 </div>
                              </div>
                              {booking.updatedAt !== booking.createdAt && (
                                 <div className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                                    <div>
                                       <p className="font-medium">Last Updated</p>
                                       <p className="text-sm text-muted-foreground">
                                          {format(new Date(booking.updatedAt), 'PPpp')}
                                       </p>
                                    </div>
                                 </div>
                              )}
                              {booking.expiresAt && booking.bookingStatus === 'pending' && (
                                 <div className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
                                    <div>
                                       <p className="font-medium">Expires</p>
                                       <p className="text-sm text-muted-foreground">
                                          {format(new Date(booking.expiresAt), 'PPpp')}
                                       </p>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  {/* Special Requests & Dietary */}
                  {(booking.bookingDetails.specialRequests || booking.bookingDetails.dietaryRestrictions?.length) && (
                     <Card>
                        <CardHeader>
                           <CardTitle>Special Requirements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {booking.bookingDetails.specialRequests && (
                              <div>
                                 <h4 className="font-medium mb-2">Special Requests:</h4>
                                 <p className="text-muted-foreground">{booking.bookingDetails.specialRequests}</p>
                              </div>
                           )}
                           {booking.bookingDetails.dietaryRestrictions?.length > 0 && (
                              <div>
                                 <h4 className="font-medium mb-2">Dietary Restrictions:</h4>
                                 <div className="flex flex-wrap gap-2">
                                    {booking.bookingDetails.dietaryRestrictions.map((restriction) => (
                                       <Badge key={restriction} variant="secondary">
                                          {restriction}
                                       </Badge>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  )}
               </TabsContent>

               <TabsContent value="customer" className="space-y-6">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <User className="h-5 w-5" />
                           Customer Information
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span className="text-sm">Full Name</span>
                                 </div>
                                 <p className="text-lg font-medium">{booking.customerInfo.fullName}</p>
                              </div>
                              <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-sm">Email</span>
                                 </div>
                                 <p className="font-medium">{booking.customerInfo.email}</p>
                              </div>
                              <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-sm">Phone</span>
                                 </div>
                                 <p className="font-medium">{booking.customerInfo.phone}</p>
                              </div>
                           </div>
                           <div className="space-y-4">
                              {booking.customerInfo.nationality && (
                                 <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Nationality</span>
                                    <p className="font-medium">{booking.customerInfo.nationality}</p>
                                 </div>
                              )}
                              {booking.customerInfo.passportNumber && (
                                 <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Passport Number</span>
                                    <p className="font-medium font-mono">{booking.customerInfo.passportNumber}</p>
                                 </div>
                              )}
                           </div>
                        </div>

                        {booking.customerInfo.address && (
                           <>
                              <Separator />
                              <div>
                                 <h4 className="font-medium mb-3">Address</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(booking.customerInfo.address).map(([key, value]) => (
                                       value && (
                                          <div key={key} className="space-y-1">
                                             <span className="text-sm text-muted-foreground capitalize">
                                                {key.replace(/([A-Z])/g, ' $1')}
                                             </span>
                                             <p className="font-medium">{value}</p>
                                          </div>
                                       )
                                    ))}
                                 </div>
                              </div>
                           </>
                        )}
                     </CardContent>
                  </Card>

                  {booking.emergencyContact && (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Shield className="h-5 w-5" />
                              Emergency Contact
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {booking.emergencyContact.name && (
                                 <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Contact Name</span>
                                    <p className="font-medium">{booking.emergencyContact.name}</p>
                                 </div>
                              )}
                              {booking.emergencyContact.phone && (
                                 <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Contact Phone</span>
                                    <p className="font-medium">{booking.emergencyContact.phone}</p>
                                 </div>
                              )}
                              {booking.emergencyContact.relationship && (
                                 <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Relationship</span>
                                    <p className="font-medium">{booking.emergencyContact.relationship}</p>
                                 </div>
                              )}
                           </div>
                        </CardContent>
                     </Card>
                  )}
               </TabsContent>

               <TabsContent value="tour">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Package className="h-5 w-5" />
                           Tour Details
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-6">
                           <div className="flex items-start justify-between">
                              <div>
                                 <h3 className="text-2xl font-bold">{booking.tour.title}</h3>
                                 <div className="flex items-center gap-2 mt-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                       {booking.tour.destination}, {booking.tour.country}
                                    </span>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-3xl font-bold text-primary">${booking.tour.price}</p>
                                 <p className="text-sm text-muted-foreground">Per person</p>
                              </div>
                           </div>

                           <Separator />

                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="space-y-1">
                                 <p className="text-sm text-muted-foreground">Group Size</p>
                                 <p className="text-lg font-semibold">{booking.tour.groupSize} people</p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-sm text-muted-foreground">Current Booked</p>
                                 <p className="text-lg font-semibold">{booking.tour.bookedSeats || 0}</p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-sm text-muted-foreground">Available</p>
                                 <p className="text-lg font-semibold text-green-600">
                                    {(booking.tour.groupSize - (booking.tour.bookedSeats || 0))}
                                 </p>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-sm text-muted-foreground">Tour Duration</p>
                                 <p className="text-lg font-semibold">7 Days</p>
                              </div>
                           </div>

                           <div className="mt-6">
                              <Button
                                 variant="outline"
                                 onClick={() => navigate(`/admin/pakages/${booking.tour._id}/detail`)}
                              >
                                 View Tour Details
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="payment">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <CreditCard className="h-5 w-5" />
                           Payment Information
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="text-center py-12">
                           <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                           <h3 className="text-lg font-semibold mb-2">Payment Integration Coming Soon</h3>
                           <p className="text-muted-foreground max-w-md mx-auto">
                              Payment processing and transaction history will be available once payment gateway integration is complete.
                           </p>
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>
            </Tabs>
         )}
      </div>
   );
}