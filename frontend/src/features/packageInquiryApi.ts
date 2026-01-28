import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface MediaItem {
  type: string;
  url: string;
  thumbnail?: string;
}

export interface PackageInquiry {
  _id: string;
  packageName: string;
  packageDescription: string;
  location: string;
  packageAveragePrice: number;
  media: MediaItem[];
  createdBy: {
    _id: string;
    userName: string;
    userEmail: string;
    userRole?: string;
  };
  createdAt: string;
  isDeleated: boolean;
}

export interface PackageInquiriesResponse {
  success: boolean;
  data: PackageInquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreatePackageInquiryDto {
  packageName: string;
  packageDescription?: string;
  location?: string;
  packageAveragePrice?: number;
}

// Get all package inquiries
export const useGetAllPackageInquiries = (page = 1, limit = 12, search = '', location = '') => {
  return useQuery<PackageInquiriesResponse>({
    queryKey: ['packageInquiries', page, limit, search, location],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (location) params.append('location', location);

      const response = await api.get(
        `/inquiry-packages?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single package inquiry
export const useGetPackageInquiryById = (id: string) => {
  return useQuery({
    queryKey: ['packageInquiry', id],
    queryFn: async () => {
      const response = await api.get(`/inquiry-packages/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get package statistics
export const useGetPackageStats = () => {
  return useQuery({
    queryKey: ['packageStats'],
    queryFn: async () => {
      const response = await api.get('/inquiry-packages/stats/overview');
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get inquiries by location
export const useGetPackagesByLocation = (location: string, page = 1, limit = 12) => {
  return useQuery({
    queryKey: ['packagesByLocation', location, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(
        `/inquiry-packages/by-location/${location}?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!location,
    staleTime: 5 * 60 * 1000,
  });
};

// Create package inquiry
export const useCreatePackageInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      inquiryData,
      media,
    }: {
      inquiryData: CreatePackageInquiryDto;
      media: File[];
    }) => {
      const formData = new FormData();
      formData.append('packageName', inquiryData.packageName);
      formData.append('packageDescription', inquiryData.packageDescription || '');
      formData.append('location', inquiryData.location || '');
      formData.append('packageAveragePrice', (inquiryData.packageAveragePrice || 0).toString());

      media.forEach((file) => {
        formData.append('media', file);
      });

      const response = await api.post('/inquiry-packages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packageInquiries'] });
    },
  });
};

// Update package inquiry
export const useUpdatePackageInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      inquiryData,
      media,
    }: {
      id: string;
      inquiryData: CreatePackageInquiryDto;
      media: File[];
    }) => {
      const formData = new FormData();
      formData.append('packageName', inquiryData.packageName);
      formData.append('packageDescription', inquiryData.packageDescription || '');
      formData.append('location', inquiryData.location || '');
      formData.append('packageAveragePrice', (inquiryData.packageAveragePrice || 0).toString());

      media.forEach((file) => {
        formData.append('media', file);
      });

      const response = await api.put(`/inquiry-packages/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packageInquiries'] });
      queryClient.invalidateQueries({ queryKey: ['packageInquiry'] });
    },
  });
};

// Delete package inquiry
export const useDeletePackageInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/inquiry-packages/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packageInquiries'] });
    },
  });
};

// Delete media from package inquiry
export const useDeletePackageMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, mediaIndex }: { id: string; mediaIndex: number }) => {
      const response = await api.delete(`/inquiry-packages/${id}/media/${mediaIndex}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packageInquiry'] });
    },
  });
};

// Get user's package inquiries
export const useGetUserInquiries = (userId: string, page = 1, limit = 12) => {
  return useQuery({
    queryKey: ['userPackageInquiries', userId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(
        `/inquiry-packages/user/${userId}?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// Search package inquiries
export const useSearchPackageInquiries = (
  keyword?: string,
  location?: string,
  minPrice?: number,
  maxPrice?: number,
  page = 1,
  limit = 12
) => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/inquiry-packages/search', {
        keyword,
        location,
        minPrice,
        maxPrice,
        page,
        limit,
      });
      return response.data;
    },
  });
};
