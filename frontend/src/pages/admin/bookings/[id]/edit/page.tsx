// src/pages/admin/bookings/[id]/edit/page.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BookingForm } from '@/components/booking/BookingForm';
import { useGetBookingById, useUpdateBooking } from '@/features/bookingApi';
import { UpdateBookingDto } from '@/types/booking';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditBookingPage() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();

   const { data: bookingData, isLoading } = useGetBookingById(id!);
   const updateBookingMutation = useUpdateBooking();

   const handleSubmit = async (data: UpdateBookingDto) => {
      try {
         await updateBookingMutation.mutateAsync({ id: id!, bookingData: data });
         toast({
            title: 'Success',
            description: 'Booking updated successfully',
         });
         navigate(-1);
      } catch (error: any) {
         toast({
            title: 'Error',
            description: error.response?.data?.message || 'Failed to update booking',
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
            <Skeleton className="h-[600px] w-full" />
         </div>
      );
   }

   if (!bookingData?.data) {
      return (
         <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Booking not found</h2>
            <p className="text-muted-foreground mt-2">
               The booking you're trying to edit doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => navigate('/admin/bookings')}>
               Back to Bookings
            </Button>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
               <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
               <h1 className="text-3xl font-bold tracking-tight">Edit Booking</h1>
               <p className="text-muted-foreground">
                  Update booking details and status
               </p>
            </div>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>
                  Editing: {bookingData.data.bookingReference}
               </CardTitle>
            </CardHeader>
            <CardContent>
               <BookingForm
                  initialData={bookingData.data}
                  onSubmit={handleSubmit}
                  isLoading={updateBookingMutation.isPending}
                  isUpdate={true}
               />
            </CardContent>
         </Card>
      </div>
   );
}