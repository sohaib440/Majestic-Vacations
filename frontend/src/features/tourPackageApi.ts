// src/features/tourPackageApi.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  TourPackage,
  CreateTourPackageDto,
  UpdateTourPackageDto,
  TourPackageFilters,
  TourPackageResponse,
  TourPackageListResponse,
  HighlightItem,
} from '@/types/tour-package';
import { TourAvailability } from '@/types/booking';

// Check tour availability
export const checkTourAvailabilityAPI = async (tourId: string, requiredSeats: number): Promise<TourAvailability> => {
  const params = new URLSearchParams();
  params.append('tourId', tourId);
  params.append('requiredSeats', requiredSeats.toString());

  const response = await api.get(`/tour/check/availability?${params.toString()}`);
  return response.data.data;
};

// React Query Hook for availability
export const useCheckTourAvailability = (tourId: string, requiredSeats: number) => {
  return useQuery({
    queryKey: ['tourAvailability', tourId, requiredSeats],
    queryFn: () => checkTourAvailabilityAPI(tourId, requiredSeats),
    enabled: !!tourId && requiredSeats > 0,
    staleTime: 30 * 1000,
  });
};

// Get all tours with filters
export const getAllToursAPI = async (filters: TourPackageFilters = {}): Promise<TourPackageListResponse> => {
  const params = new URLSearchParams();

  // Add all filter parameters
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.title) params.append('title', filters.title);
  if (filters.destination) params.append('destination', filters.destination);
  if (filters.country) params.append('country', filters.country);
  if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
  if (filters.availableOnly !== undefined) params.append('availableOnly', filters.availableOnly.toString());
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.minMonthlyPrice !== undefined) params.append('minMonthlyPrice', filters.minMonthlyPrice.toString());
  if (filters.maxMonthlyPrice !== undefined) params.append('maxMonthlyPrice', filters.maxMonthlyPrice.toString());

  const response = await api.get(`/tour?${params.toString()}`);
  return response.data;
};

export const getTourByIdAPI = async (id: string): Promise<TourPackageResponse> => {
  const response = await api.get(`/tour/${id}`);
  return response.data;
};

// Get featured tours
export const getFeaturedToursAPI = async (): Promise<TourPackageListResponse> => {
  const response = await api.get('/tour/featured');
  return response.data;
};

export const createTourAPI = async (formData: FormData): Promise<TourPackageResponse> => {
  const response = await api.post('/tour', formData);
  return response.data;
};

export const updateTourAPI = async (id: string, formData: FormData): Promise<TourPackageResponse> => {
  const response = await api.patch(`/tour/${id}`, formData);
  return response.data;
};

export const deleteTourAPI = async (id: string) => {
  const response = await api.delete(`/tour/${id}`);
  return response.data;
};

// Helper to build form data for tour creation/update
export const buildTourFormData = (
  tourData: CreateTourPackageDto | UpdateTourPackageDto,
  images?: File[],
  highlightMedia?: { file: File; index: number }[]
): FormData => {
  const formData = new FormData();

  // Add tour data as JSON
  const processedData = { ...tourData };

  // Process highlights to include media index references
  if (processedData.highlights && highlightMedia) {
    processedData.highlights = processedData.highlights.map((highlight, index) => {
      const mediaInfo = highlightMedia.find(m => m.index === index);
      return {
        ...highlight,
        mediaIndex: mediaInfo ? index : undefined
      };
    });
  }

  formData.append('tourData', JSON.stringify(processedData));

  // Add multiple images
  if (images && images.length > 0) {
    images.forEach((image, index) => {
      formData.append('images', image);
    });
  }

  // Add highlight media files
  if (highlightMedia && highlightMedia.length > 0) {
    highlightMedia.forEach(({ file }) => {
      formData.append('highlightMedia', file);
    });
  }

  return formData;
};

export const useGetAllTours = (filters: TourPackageFilters = {}) => {
  return useQuery({
    queryKey: ['tours', filters],
    queryFn: () => getAllToursAPI(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetFeaturedTours = () => {
  return useQuery({
    queryKey: ['tours', 'featured'],
    queryFn: () => getFeaturedToursAPI(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetTourById = (id: string) => {
  return useQuery({
    queryKey: ['tour', id],
    queryFn: () => getTourByIdAPI(id),
    enabled: !!id,
  });
};

export const useCreateTour = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      tourData,
      images,
      highlightMedia
    }: {
      tourData: CreateTourPackageDto;
      images: File[];
      highlightMedia?: { file: File; index: number }[]
    }) =>
      createTourAPI(buildTourFormData(tourData, images, highlightMedia)),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['tours'] });
      if (data.data?.tour?._id) qc.setQueryData(['tour', data.data.tour._id], data);
    },
  });
};

export const useUpdateTour = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      tourData,
      images,
      highlightMedia
    }: {
      id: string;
      tourData: UpdateTourPackageDto;
      images?: File[];
      highlightMedia?: { file: File; index: number }[]
    }) =>
      updateTourAPI(id, buildTourFormData(tourData, images, highlightMedia)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['tours'] });
      qc.invalidateQueries({ queryKey: ['tour', vars.id] });
    },
  });
};

export const useDeleteTour = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTourAPI,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['tours'] });
      qc.removeQueries({ queryKey: ['tour', id] });
    },
  });
};