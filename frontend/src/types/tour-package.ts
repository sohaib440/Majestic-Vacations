// src/types/tour-package.ts
// Main tour package as returned from the API
export interface TourPackage {
  _id: string;
  title: string;
  destination: string;
  country: 'Dubai' | 'Greece' | 'Indonesia' | 'Turkey' | 'Thailand';
  startDate: string;  // Changed from 'date' to 'startDate'
  images: string[];   // Changed from 'image' to 'images' (array)
  duration: string;
  groupSize: number;
  price: number;
  pricePerMonth: number;  // Added: Monthly payment price
  originalPrice?: number;
  rating: number;
  highlights: HighlightItem[];  // Changed from string[] to object array
  featured: boolean;
  bookedSeats: number;
  availableSeats: number;
  seatInfo?: {
    totalSeats: number;
    bookedSeats: number;
    availableSeats: number;
  };
  monthlyPaymentInfo?: {  // Added: Monthly payment calculation
    totalPrice: number;
    monthlyPrice: number;
    monthsRequired: number;
    lastPayment: number;
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
  duration: string;
  groupSize: number;
  price: number;
  pricePerMonth: number;  // Added
  originalPrice?: number;
  rating?: number;
  highlights?: HighlightItem[];
  featured?: boolean;
}

// DTO for updating a tour
export interface UpdateTourPackageDto extends Partial<CreateTourPackageDto> {
  _id?: string;
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
  minMonthlyPrice?: number;
  maxMonthlyPrice?: number;
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
    monthlyPaymentInfo?: {
      totalPrice: number;
      monthlyPrice: number;
      monthsRequired: number;
      lastPayment: number;
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