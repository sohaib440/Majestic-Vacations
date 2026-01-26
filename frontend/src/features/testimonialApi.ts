import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Testimonial, CreateTestimonialDto, UpdateTestimonialDto } from '@/types/testimonial';

// Create testimonial with media
export const createTestimonialAPI = async (formData: FormData): Promise<Testimonial> => {
  const response = await api.post('/testimonials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

// Get all testimonials
export const getAllTestimonialsAPI = async (): Promise<Testimonial[]> => {
  const response = await api.get(`/testimonials`);
  return response.data.data;
};

// Get single testimonial
export const getTestimonialByIdAPI = async (id: string): Promise<Testimonial> => {
  const response = await api.get(`/testimonials/${id}`);
  return response.data.data;
};

// Update testimonial
export const updateTestimonialAPI = async (id: string, formData: FormData): Promise<Testimonial> => {
  const response = await api.put(`/testimonials/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

// Delete testimonial
export const deleteTestimonialAPI = async (id: string): Promise<void> => {
  await api.delete(`/testimonials/${id}`);
};

// Delete testimonial media
export const deleteTestimonialMediaAPI = async (id: string, mediaIndex: number): Promise<Testimonial> => {
  const response = await api.delete(`/testimonials/${id}/media/${mediaIndex}`);
  return response.data.data;
};

// React Query Hooks

export const useGetAllTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: () => getAllTestimonialsAPI(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetTestimonialById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['testimonial', id],
    queryFn: () => getTestimonialByIdAPI(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTestimonialAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateTestimonialAPI(id, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial', data._id] });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTestimonialAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
};

export const useDeleteTestimonialMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, mediaIndex }: { id: string; mediaIndex: number }) =>
      deleteTestimonialMediaAPI(id, mediaIndex),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial', data._id] });
    },
  });
};
