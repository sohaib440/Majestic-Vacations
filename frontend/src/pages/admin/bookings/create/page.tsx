// src/pages/booking/create/page.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BookingForm } from '@/components/booking/BookingForm';
import { useCreateBooking } from '@/features/bookingApi';
import { CreateBookingDto } from '@/types/booking';
import { toast } from '@/hooks/use-toast';

export default function CreateBookingPage() {
   const navigate = useNavigate();
   const location = useLocation();
   const createBookingMutation = useCreateBooking();

   // Get tour ID from query params if coming from tour page
   const queryParams = new URLSearchParams(location.search);
   const tourId = queryParams.get('tourId');

   const handleSubmit = async (data: CreateBookingDto) => {
      try {
         const result = await createBookingMutation.mutateAsync(data);
         toast({
            title: 'Success',
            description: `Booking created successfully! Reference: ${result.data?.bookingReference}`,
         });
         // Go back to tour page or home after booking
         navigate(-1);
      } catch (error: any) {
         toast({
            title: 'Error',
            description: error.response?.data?.message || 'Failed to create booking',
            variant: 'destructive',
         });
      }
   };

   return (
      <div className="container mx-auto py-8">
         <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
               <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4" />
               </Button>
               <div>
                  <h1 className="text-3xl font-bold tracking-tight">Book Your Tour</h1>
                  <p className="text-muted-foreground">
                     Fill in your details to secure your spot
                  </p>
               </div>
            </div>

            <Card>
               <CardHeader>
                  <CardTitle>Booking Information</CardTitle>
               </CardHeader>
               <CardContent>
                  <BookingForm
                     onSubmit={handleSubmit}
                     isLoading={createBookingMutation.isPending}
                     // Pass tourId if available to pre-select the tour
                     availableTours={tourId ? [{ _id: tourId } as any] : undefined}
                  />
               </CardContent>
            </Card>
         </div>
      </div>
   );
}