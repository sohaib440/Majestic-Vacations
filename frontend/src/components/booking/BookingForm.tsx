// src/components/booking/BookingForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
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
import { CreateBookingDto, Booking, TourForBooking } from '@/types/booking';
import { useCheckTourAvailability, useGetToursForBooking, useCreateBooking } from '@/features/bookingApi';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'react-router-dom';
import { CurrencyPrice } from '@/components/shared/currency/CurrencyPrice';
import { useCurrency } from '@/hooks/useCurrency';


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
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  initialData?: Booking;
  isUpdate?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialData,
  isUpdate = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const tourIdFromUrl = searchParams.get('tourId');
  const { currentCurrency, convert } = useCurrency();
  const [selectedTour, setSelectedTour] = useState<TourForBooking | null>(null);
  const [isLoadingTour, setIsLoadingTour] = useState(false);

  const { data: tours = [] } = useGetToursForBooking();
  const { mutateAsync: createBooking, isPending: isCreating } = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: initialData
      ? {
          tour: initialData.tour._id,
          customerInfo: initialData.customerInfo,
          seatsBooked: initialData.seatsBooked,
          pricing: initialData.pricing,
          termsAccepted: initialData.termsAccepted,
        }
      : {
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
            currency: currentCurrency,
            paymentPlan: 'full',
          },
          termsAccepted: false,
        },
  });

  const selectedTourId = form.watch('tour');
  const seatsBooked = form.watch('seatsBooked');

  const { data: availability } = useCheckTourAvailability(selectedTourId, seatsBooked);

  // Auto-fill tour from URL
  useEffect(() => {
    if (tourIdFromUrl && !initialData && tours.length > 0) {
      setIsLoadingTour(true);
      const tour = tours.find(t => t._id === tourIdFromUrl);

      if (tour) {
        form.setValue('tour', tourIdFromUrl);
        setSelectedTour(tour);

        const totalAmount = tour.price * form.getValues().seatsBooked;
        form.setValue('pricing.totalAmount', totalAmount);

        if (tour.monthlyPaymentInfo) {
          form.setValue('pricing.monthlyAmount', tour.monthlyPaymentInfo.monthlyPrice * seatsBooked);
          form.setValue('pricing.monthsRequired', tour.monthlyPaymentInfo.monthsRequired);
        }
      }
      setIsLoadingTour(false);
    }
  }, [tourIdFromUrl, tours, form, initialData, seatsBooked]);

  // Update total when seats or tour changes
  useEffect(() => {
    if (selectedTour) {
      const total = selectedTour.price * seatsBooked;
      form.setValue('pricing.totalAmount', total);

      if (selectedTour.monthlyPaymentInfo) {
        form.setValue('pricing.monthlyAmount', selectedTour.monthlyPaymentInfo.monthlyPrice * seatsBooked);
        form.setValue('pricing.monthsRequired', selectedTour.monthlyPaymentInfo.monthsRequired);
      }
    }
  }, [selectedTour, seatsBooked, form]);

  useEffect(() => {
    if (selectedTourId) {
      const tour = tours.find(t => t._id === selectedTourId);
      setSelectedTour(tour || null);
    }
  }, [selectedTourId, tours]);

  const onSubmit = async (values: BookingFormValues) => {
    // Create a deep copy to avoid mutating the original form state
    const valuesInUSD = JSON.parse(JSON.stringify(values));

    if (currentCurrency !== 'USD') {
      const totalAmountInUSD = convert(values.pricing.totalAmount, currentCurrency, 'USD');
      valuesInUSD.pricing.totalAmount = totalAmountInUSD;

      if (values.pricing.monthlyAmount) {
        const monthlyAmountInUSD = convert(values.pricing.monthlyAmount, currentCurrency, 'USD');
        valuesInUSD.pricing.monthlyAmount = monthlyAmountInUSD;
      }
      
      valuesInUSD.pricing.currency = 'USD';
    }

    try {
      const response = await createBooking(valuesInUSD);

      if (response?.success) {
        const bookingId = response.data?._id || response.bookingId;

        toast({
          title: "Booking Created Successfully",
          description: "Redirecting to secure payment page...",
        });

        // Automatic redirect to payment page
        setTimeout(() => {
          navigate(`/payment/${bookingId}`);
        }, 1200);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Failed to create booking",
      });
    }
  };

  const calculateTotalAmount = () => {
    if (!selectedTour) return 0;
    return selectedTour.price * seatsBooked;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ── Tour Selection ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tour Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingTour ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
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
                        disabled={!!tourIdFromUrl && !isUpdate}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tour" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tours.map((tour) => (
                            <SelectItem key={tour._id} value={tour._id}>
                              <div className="flex justify-between items-center w-full">
                                <span>{tour.title}</span>
                                <Badge variant="outline" className="ml-3">
                                  {tour.availableSeats} seats left
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedTour && (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold">{selectedTour.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedTour.destination}, {selectedTour.country}
                        </p>
                      </div>
                        <div className="text-right">
                          <p>Price per person:
                            <strong>
                              <CurrencyPrice amount={selectedTour.price} variant="compact" showSymbol={false} />
                            </strong>
                          </p>
                          {selectedTour.pricePerMonth && (
                            <p>Monthly:
                              <strong>
                                <CurrencyPrice amount={selectedTour.pricePerMonth} variant="compact" showSymbol={false} />
                                /month
                              </strong>
                            </p>
                          )}
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
                          max={selectedTour?.availableSeats || 20}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum available: {selectedTour?.availableSeats || 0}
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

        {/* ── Customer Information ── */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField control={form.control} name="customerInfo.fullName" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="customerInfo.email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="customerInfo.phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="customerInfo.nationality" render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* ── Pricing & Payment Plan ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-5 bg-muted/40 rounded-lg border">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xl font-bold">
                    Total: <CurrencyPrice amount={calculateTotalAmount()} variant="detail" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {seatsBooked} × <CurrencyPrice amount={selectedTour?.price || 0} variant="compact" showSymbol={false} />
                  </p>
                </div>
                {selectedTour?.monthlyPaymentInfo && (
                  <Badge variant="secondary" className="text-base px-4 py-1">
                    Monthly:
                    <CurrencyPrice
                      amount={selectedTour.monthlyPaymentInfo.monthlyPrice * seatsBooked}
                      variant="compact"
                      showSymbol={false}
                    />
                    /month
                  </Badge>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="pricing.paymentPlan"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Choose Payment Plan</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors" onClick={() => field.onChange("full")}>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="full" id="full" />
                          <Label htmlFor="full" className="cursor-pointer font-medium">
                            Pay in Full <CurrencyPrice amount={calculateTotalAmount()} variant="compact" />
                          </Label>
                        </div>
                      </div>

                      {selectedTour?.monthlyPaymentInfo && (
                        <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors" onClick={() => field.onChange("monthly")}>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <Label htmlFor="monthly" className="cursor-pointer font-medium">
                              Monthly Installments ({selectedTour.monthlyPaymentInfo.monthsRequired} months)
                            </Label>
                          </div>
                        </div>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* ── Terms & Submit ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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
                  <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                    I accept the terms and conditions *
                  </FormLabel>
                  <FormDescription className="text-xs">
                    By proceeding, you agree to our cancellation policy, terms of service, and privacy policy.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 w-full md:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 md:flex-none"
              disabled={isCreating || isLoadingTour}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isCreating || isLoadingTour || form.formState.isSubmitting}
              className="flex-1 md:flex-none min-w-[220px]"
            >
              {isCreating || isLoadingTour || form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Create Booking & Proceed to Payment"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};