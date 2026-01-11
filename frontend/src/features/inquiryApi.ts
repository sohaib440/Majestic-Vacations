import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { CreateInquiryDto, InquiryResponse, InquiryListResponse } from '@/types/inquiry';

/** API calls */

// Get all inquiries (Admin)
export const getAllInquiriesAPI = async (): Promise<InquiryListResponse> => {
  const response = await api.get('/inquiry/getall'); // protected route
  return response.data;
};

// Create inquiry (Public)
export const createInquiryAPI = async (data: CreateInquiryDto): Promise<InquiryResponse> => {
  const response = await api.post('/inquiry/create', data);
  return response.data;
};

/** React Query hooks */

// Fetch all inquiries
export const useGetAllInquiries = () => {
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: getAllInquiriesAPI,
    staleTime: 5 * 60 * 1000,
  });
};

// Create inquiry
export const useCreateInquiry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInquiryDto) => createInquiryAPI(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};
