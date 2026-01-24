export interface CustomerInfo {
   fullName: string;
   email: string;
   phone: string;
   nationality?: string;
   passportNumber?: string;
}

export interface Pricing {
   totalAmount: number;
   currency: string;
   paymentPlan: 'full' | 'monthly';
   monthlyAmount?: number;
   monthsRequired?: number;
}

export interface Booking {
   _id: string;
   tour: {
      _id: string;
      title: string;
      destination: string;
      country: string;
      images: string[];
      price: number;
      pricePerMonth: number;

      bookedSeats: number;
      availableSeats: number;
      startDate: string;
      duration: string;
   };
   bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
   bookingReference: string;
   customerInfo: CustomerInfo;

   pricing: Pricing;
   paymentStatus: 'unpaid' | 'partial' | 'paid' | 'failed';
   adminNotes?: string;
   termsAccepted: boolean;
   createdAt: string;
   updatedAt: string;
}

export interface CreateBookingDto {
   tour: string; // Tour ID
   customerInfo: {
      fullName: string;
      email: string;
      phone: string;
      nationality?: string;
      passportNumber?: string;
   participants: Array<{
      ageGroup: string;
      count: number;
   }>;
   pricing: {
      totalAmount: number;
      currency: string;
      paymentPlan: 'full' | 'monthly';
      monthlyAmount?: number;
      monthsRequired?: number;
   };
   termsAccepted: boolean;
   adminNotes?: string;
}

export interface UpdateBookingDto {
   bookingStatus?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
   paymentStatus?: 'unpaid' | 'partial' | 'paid' | 'failed';
   customerInfo?: Partial<CustomerInfo>;
   seatsBooked?: number;
   pricing?: Partial<Pricing>;
   adminNotes?: string;
   termsAccepted?: boolean;
}

export interface BookingFilters {
   page?: number;
   limit?: number;
   status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
   paymentStatus?: 'unpaid' | 'partial' | 'paid' | 'failed';
   search?: string;
   tourId?: string;
   email?: string;
   fromDate?: string;
   toDate?: string;
   sort?: string;
}

export interface BookingResponse {
   success: boolean;
   message: string;
   data?: Booking;
}

export interface BookingListResponse {
   success: boolean;
   count: number;
   data: Booking[];
}

export interface BookingByIdResponse {
   success: boolean;
   data: Booking;
}

export interface CancelBookingResponse {
   success: boolean;
   message: string;
}

export interface TourAvailability {
   tourId: string;
   tourTitle: string;
   totalSeats: number;
   bookedSeats: number;
   availableSeats: number;
   requiredSeats: number;
   isAvailable: boolean;
   message: string;
}

export interface TourForBooking {
   _id: string;
   title: string;
   destination: string;
   country: string;
   price: number;
   pricePerMonth: number;

   bookedSeats: number;
   availableSeats: number;
   startDate: string;
   duration: string;
   images: string[];
   monthlyPaymentInfo?: {
      totalPrice: number;
      monthlyPrice: number;
      monthsRequired: number;
      lastPayment: number;
   };
}