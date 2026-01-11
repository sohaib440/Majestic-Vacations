// src/components/booking/BookingForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Calendar, CreditCard } from 'lucide-react';
import { CreateBookingDto, UpdateBookingDto, Booking, TourForBooking } from '@/types/booking';
import { useCheckTourAvailability, useGetToursForBooking } from '@/features/bookingApi';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useParams, useSearchParams } from 'react-router-dom';

const statusColors: Record<string, string> = {
   pending: 'bg-yellow-100 text-yellow-800',
   confirmed: 'bg-green-100 text-green-800',
   cancelled: 'bg-red-100 text-red-800',
   completed: 'bg-blue-100 text-blue-800',
};

const paymentStatusColors: Record<string, string> = {
   unpaid: 'bg-gray-100 text-gray-800',
   partial: 'bg-orange-100 text-orange-800',
   paid: 'bg-green-100 text-green-800',
   failed: 'bg-red-100 text-red-800',
};

const bookingFormSchema = z.object({
   tour: z.string().min(1, 'Please select a tour'),
   customerInfo: z.object({
      fullName: z.string().min(2, 'Full name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
      phone: z.string().min(10, 'Please enter a valid phone number'),
      nationality: z.string().optional(),
      passportNumber: z.string().optional(),
   }),
   seatsBooked: z.number().min(1, 'At least 1 seat is required'),
   pricing: z.object({
      totalAmount: z.number().min(1, 'Total amount must be greater than 0'),
      currency: z.string().default('USD'),
      paymentPlan: z.enum(['full', 'monthly']),
      monthlyAmount: z.number().optional(),
      monthsRequired: z.number().optional(),
   }),
   termsAccepted: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions',
   }),
   adminNotes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
   initialData?: Booking;
   onSubmit: (data: CreateBookingDto | UpdateBookingDto) => void;
   isLoading?: boolean;
   isUpdate?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
   initialData,
   onSubmit,
   isLoading = false,
   isUpdate = false,
}) => {
   const [searchParams] = useSearchParams();
   const tourIdFromUrl = searchParams.get('tourId');
   const [selectedTour, setSelectedTour] = useState<TourForBooking | null>(null);
   const [isAdmin, setIsAdmin] = useState(false);
   const [isLoadingTour, setIsLoadingTour] = useState(false);

   const { data: tours = [] } = useGetToursForBooking();
   const toursToUse = tours;

   // Check if user is admin on component mount
   useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
         try {
            const user = JSON.parse(userData);
            setIsAdmin(user.role === 'admin');
         } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            setIsAdmin(false);
         }
      }
   }, []);

   const form = useForm<BookingFormValues>({
      resolver: zodResolver(bookingFormSchema),
      defaultValues: initialData ? {
         tour: initialData.tour._id,
         customerInfo: initialData.customerInfo,
         seatsBooked: initialData.seatsBooked,
         pricing: initialData.pricing,
         termsAccepted: initialData.termsAccepted,
         adminNotes: initialData.adminNotes || '',
      } : {
         tour: tourIdFromUrl || '',
         customerInfo: {
            fullName: '',
            email: '',
            phone: '',
            nationality: '',
            passportNumber: '',
         },
         seatsBooked: 1,
         pricing: {
            totalAmount: 0,
            currency: 'USD',
            paymentPlan: 'full',
         },
         termsAccepted: false,
         adminNotes: '',
      },
   });

   const selectedTourId = form.watch('tour');
   const seatsBooked = form.watch('seatsBooked');

   const { data: availability } = useCheckTourAvailability(
      selectedTourId,
      seatsBooked
   );

   // Auto-select tour from URL on initial load
   useEffect(() => {
      if (tourIdFromUrl && !initialData && toursToUse.length > 0) {
         setIsLoadingTour(true);

         // Find the tour in the available tours
         const tour = toursToUse.find(t => t._id === tourIdFromUrl);

         if (tour) {
            // Set the form values
            form.setValue('tour', tourIdFromUrl);
            setSelectedTour(tour);

            // Calculate initial total amount
            const totalAmount = tour.price * form.getValues().seatsBooked;
            form.setValue('pricing.totalAmount', totalAmount);
            form.setValue('pricing.currency', 'USD');

            if (tour.monthlyPaymentInfo) {
               form.setValue('pricing.monthlyAmount', tour.monthlyPaymentInfo.monthlyPrice * seatsBooked);
               form.setValue('pricing.monthsRequired', tour.monthlyPaymentInfo.monthsRequired);
            }
         }

         setIsLoadingTour(false);
      }
   }, [tourIdFromUrl, toursToUse, form, initialData, seatsBooked]);

   // Update pricing when tour or seats change
   useEffect(() => {
      if (selectedTourId && selectedTour) {
         const totalAmount = selectedTour.price * seatsBooked;
         form.setValue('pricing.totalAmount', totalAmount);

         if (selectedTour.monthlyPaymentInfo) {
            form.setValue('pricing.monthlyAmount', selectedTour.monthlyPaymentInfo.monthlyPrice * seatsBooked);
            form.setValue('pricing.monthsRequired', selectedTour.monthlyPaymentInfo.monthsRequired);
         }
      }
   }, [selectedTourId, seatsBooked, selectedTour, form]);

   // Update selected tour when tour selection changes
   useEffect(() => {
      if (selectedTourId) {
         const tour = toursToUse.find(t => t._id === selectedTourId);
         setSelectedTour(tour || null);
      }
   }, [selectedTourId, toursToUse]);

   const handleSubmit = (values: BookingFormValues) => {
      const submitData = isUpdate
         ? { ...values } as UpdateBookingDto
         : { ...values } as CreateBookingDto;
      onSubmit(submitData);
   };

   const calculateTotalAmount = () => {
      if (!selectedTour) return 0;
      return selectedTour.price * seatsBooked;
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Tour Selection */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Calendar className="h-5 w-5" />
                     Tour Selection
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {isLoadingTour ? (
                     <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Loading tour information...</span>
                     </div>
                  ) : (
                     <>
                        <FormField
                           control={form.control}
                           name="tour"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Select Tour *</FormLabel>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!!tourIdFromUrl && !isUpdate} // Disable if coming from tour page
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Select a tour" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {toursToUse.map((tour) => (
                                          <SelectItem key={tour._id} value={tour._id}>
                                             <div className="flex justify-between w-full">
                                                <span>{tour.title}</span>
                                                <Badge variant="outline" className="ml-2">
                                                   {tour.availableSeats} seats left
                                                </Badge>
                                             </div>
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                                 {tourIdFromUrl && !isUpdate && (
                                    <FormDescription>
                                       Tour pre-selected from your previous selection
                                    </FormDescription>
                                 )}
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {selectedTour && (
                           <div className="bg-muted p-4 rounded-lg">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h4 className="font-semibold">{selectedTour.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                       {selectedTour.destination}, {selectedTour.country}
                                    </p>
                                    <p className="text-sm">
                                       <span className="font-medium">Price per person:</span> ${selectedTour.price}
                                    </p>
                                    <p className="text-sm">
                                       <span className="font-medium">Monthly:</span> ${selectedTour.pricePerMonth}/month
                                    </p>
                                    <p className="text-sm">
                                       <span className="font-medium">Duration:</span> {selectedTour.duration}
                                    </p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-sm">
                                       <span className="font-medium">Group Size:</span> {selectedTour.groupSize}
                                    </p>
                                    <p className="text-sm">
                                       <span className="font-medium">Available:</span> {selectedTour.availableSeats}
                                    </p>
                                    <p className="text-sm">
                                       <span className="font-medium">Start Date:</span> {selectedTour.startDate}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        )}

                        <FormField
                           control={form.control}
                           name="seatsBooked"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Number of Seats *</FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       min="1"
                                       max={selectedTour?.availableSeats}
                                       {...field}
                                       onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Maximum {selectedTour?.availableSeats || 0} seats available
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {availability && (
                           <Alert variant={availability.isAvailable ? "default" : "destructive"}>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{availability.message}</AlertDescription>
                           </Alert>
                        )}
                     </>
                  )}
               </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
               <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="customerInfo.fullName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="customerInfo.email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                 <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="customerInfo.phone"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="customerInfo.nationality"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nationality</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="customerInfo.passportNumber"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Passport Number</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </CardContent>
            </Card>

            {/* Pricing & Payment */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <CreditCard className="h-5 w-5" />
                     Pricing & Payment
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                     <div className="flex justify-between items-center mb-4">
                        <div>
                           <p className="text-lg font-bold">Total Amount: ${calculateTotalAmount()}</p>
                           <p className="text-sm text-muted-foreground">
                              {seatsBooked} seat{seatsBooked > 1 ? 's' : ''} × ${selectedTour?.price || 0}
                           </p>
                        </div>
                        {selectedTour?.monthlyPaymentInfo && (
                           <Badge variant="outline">
                              Monthly: ${selectedTour.monthlyPaymentInfo.monthlyPrice * seatsBooked}/month
                           </Badge>
                        )}
                     </div>

                     <FormField
                        control={form.control}
                        name="pricing.paymentPlan"
                        render={({ field }) => (
                           <FormItem className="space-y-3">
                              <FormLabel>Payment Plan *</FormLabel>
                              <FormControl>
                                 <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                 >
                                    <div className="flex items-center space-x-2">
                                       <RadioGroupItem value="full" id="full" />
                                       <Label htmlFor="full" className="cursor-pointer">
                                          Pay Full Amount: ${calculateTotalAmount()}
                                       </Label>
                                    </div>
                                    {selectedTour?.monthlyPaymentInfo && (
                                       <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="monthly" id="monthly" />
                                          <Label htmlFor="monthly" className="cursor-pointer">
                                             Monthly Installments: {selectedTour.monthlyPaymentInfo.monthsRequired} months ×
                                             ${selectedTour.monthlyPaymentInfo.monthlyPrice * seatsBooked}/month
                                          </Label>
                                       </div>
                                    )}
                                 </RadioGroup>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </CardContent>
            </Card>

            {/* Additional Information - Only show Admin Notes if user is admin */}
            <Card>
               <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {/* Admin Notes field - Only show if user is admin */}
                  {isAdmin && (
                     <FormField
                        control={form.control}
                        name="adminNotes"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Admin Notes</FormLabel>
                              <FormControl>
                                 <Textarea
                                    placeholder="Internal notes about this booking..."
                                    className="min-h-[100px]"
                                    {...field}
                                 />
                              </FormControl>
                              <FormDescription>
                                 These notes are only visible to administrators
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  )}

                  {/* Terms and Conditions - Always show */}
                  <FormField
                     control={form.control}
                     name="termsAccepted"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                           <FormControl>
                              <Checkbox
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                              />
                           </FormControl>
                           <div className="space-y-1 leading-none">
                              <FormLabel>
                                 I accept the terms and conditions *
                              </FormLabel>
                              <FormDescription>
                                 By checking this box, you agree to our cancellation policy, terms of service, and privacy policy.
                              </FormDescription>
                           </div>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </CardContent>
            </Card>

            {/* Booking Status (Update Only) - Only show if user is admin */}
            {isUpdate && initialData && isAdmin && (
               <Card>
                  <CardHeader>
                     <CardTitle>Booking Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div>
                           <p className="text-sm text-muted-foreground">Current Status</p>
                           <Badge variant="outline" className={statusColors[initialData.bookingStatus]}>
                              {initialData.bookingStatus}
                           </Badge>
                        </div>
                        <div>
                           <p className="text-sm text-muted-foreground">Payment Status</p>
                           <Badge variant="outline" className={paymentStatusColors[initialData.paymentStatus]}>
                              {initialData.paymentStatus}
                           </Badge>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="bookingStatus"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Update Booking Status</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Select status" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       <SelectItem value="pending">Pending</SelectItem>
                                       <SelectItem value="confirmed">Confirmed</SelectItem>
                                       <SelectItem value="cancelled">Cancelled</SelectItem>
                                       <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="paymentStatus"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Update Payment Status</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Select payment status" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       <SelectItem value="unpaid">Unpaid</SelectItem>
                                       <SelectItem value="partial">Partial</SelectItem>
                                       <SelectItem value="paid">Paid</SelectItem>
                                       <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  </CardContent>
               </Card>
            )}

            <div className="flex justify-end gap-4">
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
               >
                  Cancel
               </Button>
               <Button type="submit" disabled={isLoading || isLoadingTour}>
                  {(isLoading || isLoadingTour) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUpdate ? 'Update Booking' : 'Create Booking'}
               </Button>
            </div>
         </form>
      </Form>
   );
};