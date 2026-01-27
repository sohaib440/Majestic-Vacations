import { useQuery } from '@tanstack/react-query';
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
    name: string;
    email: string;
    avatar?: string;
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
        `/package-inquiries?${params.toString()}`
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
      const response = await api.get(`/package-inquiries/${id}`);
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
      const response = await api.get('/package-inquiries/stats/overview');
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
        `/package-inquiries/by-location/${location}?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!location,
    staleTime: 5 * 60 * 1000,
  });
};
