// src/types/tour-package.ts
// Main tour package as returned from the API

export interface PriceTier {
  ageGroup: string;
  ageRange: string;
  price: number;
}
export interface TourPackage {
  _id: string;
  title: string;
  destination: string;
  country: 'Dubai' | 'Greece' | 'Indonesia' | 'Turkey' | 'Thailand';
  startDate: string;  
  endDate: string;
  images: string[];  
  duration: string;
  groupSize: number;
  priceTiers: PriceTier[];
  originalPrice?: number;
  rating: number;
  highlights: HighlightItem[]; 
  featured: boolean;
  bookedSeats: number;
  availableSeats: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  seatInfo?: {
    totalSeats: number;
    bookedSeats: number;
    availableSeats: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Highlight item with optional media
export interface HighlightItem {
  text: string;
  media?: string | null;
  mediaType?: 'image' | 'video' | null;
}

// DTO for creating a new tour
export interface CreateTourPackageDto {
  title: string;
  destination: string;
  country: 'Dubai' | 'Greece' | 'Indonesia' | 'Turkey' | 'Thailand';
  startDate: string;
  endDate: string;
  duration: string;
  groupSize: number;
  priceTiers: PriceTier[];
  isActive?: boolean;
  originalPrice?: number;
  rating?: number;
  highlights?: HighlightItem[];
  featured?: boolean;
}

// DTO for updating a tour
export interface UpdateTourPackageDto extends Partial<CreateTourPackageDto> {
  _id?: string;
  isDeleted?: boolean;
}

// Filters used in the admin list page
export interface TourPackageFilters {
  page?: number;
  limit?: number;
  sort?: string;
  title?: string;
  destination?: string;
  country?: string;
  featured?: boolean;
  availableOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  includeDeleted?: boolean;
  showAll?: boolean;
}

// Generic API response for single tour
export interface TourPackageResponse {
  status: 'success' | 'fail';
  data?: {
    tour?: TourPackage;
    seatInfo?: {
      totalSeats: number;
      bookedSeats: number;
      availableSeats: number;
    };
  };
  message?: string;
}

// Response for list of tours
export interface TourPackageListResponse {
  status: 'success' | 'fail';
  data: {
    tours: TourPackage[];
  };
  results: number;
  message?: string;
}