// src/components/booking/BookingForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertCircle, Calendar, CreditCard } from 'lucide-react';
import { CreateBookingDto, Booking, TourForBooking } from '@/types/booking';
import { useGetToursForBooking, useCreateBooking } from '@/features/bookingApi';
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
  participants: z.array(
    z.object({
      ageGroup: z.string().min(1, 'Age group is required'),
      count: z.number().min(0),
    })
  ),

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
        participants: [],
        pricing: {
          totalAmount: 0,
          currency: currentCurrency,
          paymentPlan: 'full',
        },
        termsAccepted: false,
      },
  });
  const { fields: participantFields, append: appendParticipant, update: updateParticipant } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const selectedTourId = form.watch('tour');
  const participants = form.watch('participants');
  const totalParticipants = participants.reduce((total, p) => total + p.count, 0);

  // Auto-fill tour from URL and initialize participants
  useEffect(() => {
    if (tourIdFromUrl && !initialData && tours.length > 0) {
      setIsLoadingTour(true);
      const tour = tours.find(t => t._id === tourIdFromUrl);

      if (tour) {
        form.setValue('tour', tourIdFromUrl);
        setSelectedTour(tour);

        // Initialize participants based on priceTiers
        if (tour.priceTiers && tour.priceTiers.length > 0) {
          form.setValue(
            'participants',
            tour.priceTiers.map(tier => ({
              ageGroup: tier.ageGroup,
              count: tier.ageGroup === 'Adult' ? 1 : 0,
            })),
            { shouldDirty: true, shouldValidate: true }
          );
        } else {
          // Fallback if no priceTiers, though schema requires at least one
          form.setValue('participants', [{ ageGroup: 'Adult', count: 1 }], {
            shouldDirty: true,
            shouldValidate: true,
          });
        }

        // The total amount will be calculated in a separate effect
        form.setValue('pricing.totalAmount', 0); // Reset for recalculation


        setIsLoadingTour(false);
      }
    }
    }, [tourIdFromUrl, tours, form, initialData]);

  // Update total when participants or tour changes
  useEffect(() => {
    if (selectedTour && participants.length > 0) {
      let calculatedTotal = 0;
      for (const participant of participants) {
        const priceTier = selectedTour.priceTiers.find(
          (tier) => tier.ageGroup === participant.ageGroup
        );
        if (priceTier) {
          calculatedTotal += priceTier.price * participant.count;
        }
      }

      const currentTotal = form.getValues('pricing.totalAmount');
      if (currentTotal !== calculatedTotal) {
        form.setValue('pricing.totalAmount', calculatedTotal);
      }

      // Recalculate monthly amount based on total calculated and total participants
      if (selectedTour.monthlyPaymentInfo) {
        const monthsRequired = selectedTour.monthlyPaymentInfo.monthsRequired || 1;
        const monthlyAmount = calculatedTotal / monthsRequired;
        const currentMonthly = form.getValues('pricing.monthlyAmount');
        const currentMonths = form.getValues('pricing.monthsRequired');

        if (currentMonthly !== monthlyAmount) {
          form.setValue('pricing.monthlyAmount', monthlyAmount);
        }
        if (currentMonths !== monthsRequired) {
          form.setValue('pricing.monthsRequired', monthsRequired);
        }
      }
    }
  }, [selectedTour, participants, form]);

useEffect(() => {
    if (selectedTourId) {
      const tour = tours.find(t => t._id === selectedTourId);
      // Only update selectedTour if it's actually different to prevent infinite loops
      if (tour?._id !== selectedTour?._id) {
        setSelectedTour(tour || null);
      }

      // If a tour is selected, and it has price tiers, ensure participants are aligned
      if (tour && tour.priceTiers && tour.priceTiers.length > 0) {
        const currentFormParticipants = form.getValues('participants');
        const currentParticipantAgeGroups = currentFormParticipants.map(p => p.ageGroup);
        const tourPriceTierAgeGroups = tour.priceTiers.map(pt => pt.ageGroup);

        const needsUpdate =
          currentParticipantAgeGroups.length !== tourPriceTierAgeGroups.length ||
          !currentParticipantAgeGroups.every(ag => tourPriceTierAgeGroups.includes(ag));

        if (needsUpdate) {
          const shouldSeedDefault = currentFormParticipants.length === 0;
          form.setValue(
            'participants',
            tour.priceTiers.map(tier => {
              const existingParticipant = currentFormParticipants.find(p => p.ageGroup === tier.ageGroup);
              return {
                ageGroup: tier.ageGroup,
                count: existingParticipant
                  ? existingParticipant.count
                  : shouldSeedDefault && tier.ageGroup === 'Adult'
                  ? 1
                  : 0,
              };
            }),
            { shouldDirty: true, shouldValidate: true }
          );
        }
      } else {
        const currentFormParticipants = form.getValues('participants');
        if (currentFormParticipants.length > 0) {
          form.setValue('participants', []); // Clear if no price tiers
        }
      }
    }
  }, [selectedTourId, tours, form, selectedTour]); // Added selectedTour to dependencies
const onSubmit = async (values: BookingFormValues) => {
  // Create a deep copy to avoid mutating the original form state
  const valuesInUSD = JSON.parse(JSON.stringify(values));
  valuesInUSD.participants = values.participants.filter((p) => p.count > 0);
  if (valuesInUSD.participants.length === 0) {
    toast({
      variant: "destructive",
      title: "Participants required",
      description: "Please add at least one participant to proceed.",
    });
    return;
  }

  valuesInUSD.pricing.currency = values.pricing.currency || currentCurrency || 'USD';

  if (values.pricing.paymentPlan === 'monthly' && !valuesInUSD.pricing.monthlyAmount) {
    if (values.pricing.monthsRequired) {
      valuesInUSD.pricing.monthlyAmount = values.pricing.totalAmount / values.pricing.monthsRequired;
    }
  }

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
      const bookingId = response.data?._id;
      if (!bookingId) {
        toast({
          variant: "destructive",
          title: "Booking created, but missing ID",
          description: "Please try again or contact support.",
        });
        return;
      }

      toast({
        title: "Booking Created Successfully",
        description: "Redirecting to secure payment page...",
      });

      // Automatic redirect to payment page
      setTimeout(() => {
        navigate(`/payment/${bookingId}`);
      }, 1200);
    } else {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: response?.message || "Failed to create booking",
      });
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
  if (!selectedTour || participants.length === 0) return 0;
  let total = 0;
  for (const participant of participants) {
    const priceTier = selectedTour.priceTiers.find(
      (tier) => tier.ageGroup === participant.ageGroup
    );
    if (priceTier) {
      total += priceTier.price * participant.count;
    }
  }
  return total;
};

return (
  <div className="min-h-screen bg-muted/20">
    <div className="w-full px-4 md:px-6 lg:px-10 py-10">
      <div className="w-full space-y-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Book Your Tour</h1>
          <p className="text-muted-foreground mt-2">
            Complete your details below to confirm your booking.
          </p>
        </div>

        <div className="grid xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* ── Tour Selection ── */}
              <Card className="shadow-sm">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Tour Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
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
                    <SelectValue placeholder="Choose a tour" />
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
                <div className="p-5 bg-muted/40 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold">{selectedTour.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedTour.destination}, {selectedTour.country}
                      </p>
                    </div>
                    <div className="md:text-right space-y-1">
                      {selectedTour.priceTiers.map((tier, index) => (
                        <div key={index} className="flex items-center justify-between gap-3 text-sm md:justify-end">
                          <span className="text-muted-foreground">
                            {tier.ageGroup} ({tier.ageRange})
                          </span>
                          <span className="font-semibold">
                            <CurrencyPrice amount={tier.price} variant="compact" />
                          </span>
                        </div>
                      ))}
                      {selectedTour.monthlyPaymentInfo && (
                        <div className="text-sm mt-2">
                          <span className="text-muted-foreground">Monthly starting from</span>{' '}
                          <span className="font-semibold">
                            <CurrencyPrice amount={selectedTour.monthlyPaymentInfo.monthlyPrice} variant="compact" />
                            /month
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg border p-4">
                <FormLabel>Participants by Age Group *</FormLabel>
                <FormDescription className="mb-3">
                  Specify the number of participants for each age group.
                </FormDescription>
                <div className="space-y-3">
                  {participantFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_160px] gap-4 items-center">
                      <div className="space-y-1">
                        <Input
                          type="text"
                          value={`${selectedTour?.priceTiers.find(pt => pt.ageGroup === field.ageGroup)?.ageGroup} (${selectedTour?.priceTiers.find(pt => pt.ageGroup === field.ageGroup)?.ageRange})`}
                          readOnly
                          className="bg-gray-100 dark:bg-gray-800"
                        />
                        {selectedTour && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CurrencyPrice
                              amount={selectedTour.priceTiers.find(pt => pt.ageGroup === field.ageGroup)?.price || 0}
                              variant="compact"
                            />
                            <span className="ml-1">/ person</span>
                          </div>
                        )}
                      </div>
                      <FormField
                        control={form.control}
                        name={`participants.${index}.count`}
                        render={({ field: countField }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...countField}
                                onChange={e => {
                                  countField.onChange(parseInt(e.target.value) || 0);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
                {participantFields.length === 0 && (
                  <Alert variant="warning">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No price tiers defined for the selected tour. Please select a tour with defined price tiers.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

            </>
          )}
        </CardContent>
      </Card>

              {/* ── Customer Information ── */}
              <Card className="shadow-sm">
                <CardHeader className="bg-muted/30">
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField control={form.control} name="customerInfo.fullName" render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="customerInfo.email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="customerInfo.phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <FormControl>
                <Input placeholder="+1 555 123 4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="customerInfo.nationality" render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Canadian" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </CardContent>
      </Card>

              {/* ── Pricing & Payment Plan ── */}
              <Card className="shadow-sm">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
          <div className="p-5 bg-muted/40 rounded-lg border">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="text-xl font-bold">
                  Total: <CurrencyPrice amount={calculateTotalAmount()} variant="detail" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalParticipants} participants
                </p>
              </div>
              {selectedTour?.monthlyPaymentInfo && (
                <Badge variant="secondary" className="text-base px-4 py-1">
                  Monthly:
                  <CurrencyPrice
                    amount={calculateTotalAmount() / (selectedTour.monthlyPaymentInfo.monthsRequired || 1)}
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
                        <div className="cursor-pointer font-medium">
                          Pay in Full <CurrencyPrice amount={calculateTotalAmount()} variant="compact" />
                        </div>
                      </div>
                    </div>

                    {selectedTour?.monthlyPaymentInfo && (
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors" onClick={() => field.onChange("monthly")}>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="monthly" id="monthly" />
                        <div className="cursor-pointer font-medium">
                            Monthly Installments ({selectedTour.monthlyPaymentInfo.monthsRequired} months)
                        </div>
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border rounded-lg p-4 bg-muted/20">
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
                    disabled={isCreating || isLoadingTour || form.formState.isSubmitting || totalParticipants === 0}
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

          <div className="space-y-6 lg:sticky lg:top-6 h-fit">
            <Card className="shadow-sm">
              <CardHeader className="bg-muted/30">
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTour ? (
                  <>
                    <div>
                      <p className="font-semibold">{selectedTour.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTour.destination}, {selectedTour.country}
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Participants</span>
                        <span className="font-medium">{totalParticipants}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-semibold">
                          <CurrencyPrice amount={calculateTotalAmount()} variant="compact" />
                        </span>
                      </div>
                      {selectedTour.monthlyPaymentInfo && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Monthly</span>
                          <span className="font-medium">
                            <CurrencyPrice
                              amount={calculateTotalAmount() / (selectedTour.monthlyPaymentInfo.monthsRequired || 1)}
                              variant="compact"
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Select a tour to see your booking summary.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="bg-muted/30">
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Our team is here to assist with group sizes, payment options, or custom requests.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};



