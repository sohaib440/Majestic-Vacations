import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
   Booking,
   CreateBookingDto,
   UpdateBookingDto,
   BookingFilters,
   BookingResponse,
   BookingListResponse,
   BookingByIdResponse,
   CancelBookingResponse,
   TourAvailability,
   TourForBooking
} from '@/types/booking';

// Get all bookings (Admin)
export const getAllBookingsAPI = async (filters: BookingFilters = {}): Promise<BookingListResponse> => {
   const params = new URLSearchParams();

   if (filters.page) params.append('page', filters.page.toString());
   if (filters.limit) params.append('limit', filters.limit.toString());
   if (filters.status) params.append('bookingStatus', filters.status);
   if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
   if (filters.search) params.append('search', filters.search);
   if (filters.tourId) params.append('tour', filters.tourId);
   if (filters.email) params.append('email', filters.email);
   if (filters.fromDate) params.append('fromDate', filters.fromDate);
   if (filters.toDate) params.append('toDate', filters.toDate);
   if (filters.sort) params.append('sort', filters.sort);

   const response = await api.get(`/booking?${params.toString()}`);
   return response.data;
};

// Get booking by ID or reference
export const getBookingByIdAPI = async (id: string): Promise<BookingByIdResponse> => {
   const response = await api.get(`/booking/${id}`);
   return response.data;
};

// Create new booking
export const createBookingAPI = async (bookingData: CreateBookingDto): Promise<BookingResponse> => {
   const response = await api.post('/booking', bookingData);
   return response.data;
};

// Update booking (Admin)
export const updateBookingAPI = async (id: string, bookingData: UpdateBookingDto): Promise<BookingResponse> => {
   const response = await api.put(`/booking/${id}`, bookingData);
   return response.data;
};

// Cancel/Delete booking (Admin)
export const cancelBookingAPI = async (id: string): Promise<CancelBookingResponse> => {
   const response = await api.delete(`/booking/${id}`);
   return response.data;
};

// Check tour availability
export const checkTourAvailabilityAPI = async (tourId: string, requiredSeats: number): Promise<TourAvailability> => {
   const params = new URLSearchParams();
   params.append('tourId', tourId);
   params.append('requiredSeats', requiredSeats.toString());

   const response = await api.get(`/tour/check/availability?${params.toString()}`);
   return response.data.data;
};

// Get tours for booking (active tours with availability)
export const getToursForBookingAPI = async (): Promise<TourForBooking[]> => {
   const response = await api.get('/tour?availableOnly=true&limit=50');
   return response.data.data.tours;
};

// Confirm booking (update status and payment)
export const confirmBookingAPI = async (id: string): Promise<BookingResponse> => {
   const response = await api.patch(`/booking/${id}/confirm`);
   return response.data;
};

// Update payment status
export const updatePaymentStatusAPI = async (id: string, paymentStatus: string): Promise<BookingResponse> => {
   const response = await api.patch(`/booking/${id}/payment-status`, { paymentStatus });
   return response.data;
};

// React Query Hooks
export const useGetAllBookings = (filters: BookingFilters = {}) => {
   return useQuery({
      queryKey: ['bookings', filters],
      queryFn: () => getAllBookingsAPI(filters),
      staleTime: 5 * 60 * 1000,
   });
};

export const useGetBookingById = (id: string) => {
   return useQuery({
      queryKey: ['booking', id],
      queryFn: () => getBookingByIdAPI(id),
      enabled: !!id,
   });
};

export const useCreateBooking = () => {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: (bookingData: CreateBookingDto) => createBookingAPI(bookingData),
      onSuccess: () => {
         qc.invalidateQueries({ queryKey: ['bookings'] });
      },
   });
};

export const useUpdateBooking = () => {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: ({ id, bookingData }: { id: string; bookingData: UpdateBookingDto }) =>
         updateBookingAPI(id, bookingData),
      onSuccess: (_, vars) => {
         qc.invalidateQueries({ queryKey: ['bookings'] });
         qc.invalidateQueries({ queryKey: ['booking', vars.id] });
      },
   });
};

export const useCancelBooking = () => {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: cancelBookingAPI,
      onSuccess: (_, id) => {
         qc.invalidateQueries({ queryKey: ['bookings'] });
         qc.invalidateQueries({ queryKey: ['booking', id] });
      },
   });
};

export const useCheckTourAvailability = (tourId: string, requiredSeats: number) => {
   return useQuery({
      queryKey: ['tourAvailability', tourId, requiredSeats],
      queryFn: () => checkTourAvailabilityAPI(tourId, requiredSeats),
      enabled: !!tourId && requiredSeats > 0,
      staleTime: 30 * 1000,
   });
};

export const useGetToursForBooking = () => {
   return useQuery({
      queryKey: ['toursForBooking'],
      queryFn: getToursForBookingAPI,
      staleTime: 5 * 60 * 1000,
   });
};

export const useConfirmBooking = () => {
   const qc = useQueryClient();
   return useMutation({
      mutationFn: confirmBookingAPI,
      onSuccess: (_, id) => {
         qc.invalidateQueries({ queryKey: ['bookings'] });
         qc.invalidateQueries({ queryKey: ['booking', id] });
      },
   });
};