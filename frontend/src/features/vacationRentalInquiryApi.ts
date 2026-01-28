import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface VacationRentalInquiry {
  _id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  packageName: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
  location: string;
  numberOfGuests: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVacationRentalInquiryDto {
  userName: string;
  userEmail: string;
  userPhone: string;
  packageName: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
  location: string;
  numberOfGuests: number;
}

export interface VacationRentalInquiriesResponse {
  success: boolean;
  count: number;
  data: VacationRentalInquiry[];
}

// Create vacation rental inquiry
export const useCreateVacationRentalInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVacationRentalInquiryDto) => {
      const response = await api.post('/vacation-rental-inquiries', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacationRentalInquiries'] });
    },
  });
};

// Get all vacation rental inquiries (by email)
export const useGetVacationRentalInquiriesByEmail = (email: string) => {
  return useQuery<VacationRentalInquiriesResponse>({
    queryKey: ['vacationRentalInquiries', email],
    queryFn: async () => {
      const response = await api.get(`/vacation-rental-inquiries/email/${email}`);
      return response.data;
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single vacation rental inquiry
export const useGetVacationRentalInquiry = (id: string) => {
  return useQuery({
    queryKey: ['vacationRentalInquiry', id],
    queryFn: async () => {
      const response = await api.get(`/vacation-rental-inquiries/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get inquiries by date range
export const useGetVacationRentalInquiriesByDateRange = (startDate: string, endDate: string) => {
  return useQuery<VacationRentalInquiriesResponse>({
    queryKey: ['vacationRentalInquiriesByDate', startDate, endDate],
    queryFn: async () => {
      const response = await api.get('/vacation-rental-inquiries/date-range', {
        params: { startDate, endDate },
      });
      return response.data;
    },
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Update vacation rental inquiry
export const useUpdateVacationRentalInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateVacationRentalInquiryDto> }) => {
      const response = await api.patch(`/vacation-rental-inquiries/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacationRentalInquiries'] });
    },
  });
};

// Delete vacation rental inquiry
export const useDeleteVacationRentalInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/vacation-rental-inquiries/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacationRentalInquiries'] });
    },
  });
};
