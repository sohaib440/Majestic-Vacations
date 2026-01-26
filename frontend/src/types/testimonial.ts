export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface TravelerLocation {
  city?: string;
  country?: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  content: string;
  rating: number;
  company?: string;
  destination?: string;
  tripType?: string;
  travelerLocation?: TravelerLocation;
  media?: MediaItem[];
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialDto {
  name: string;
  content: string;
  rating?: number;
  company?: string;
  destination?: string;
  tripType?: string;
  travelerLocation?: TravelerLocation;
  media?: MediaItem[];
}

export interface UpdateTestimonialDto {
  name?: string;
  content?: string;
  rating?: number;
  company?: string;
  destination?: string;
  tripType?: string;
  travelerLocation?: TravelerLocation;
}

export interface TestimonialFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface TestimonialResponse {
  success: boolean;
  message: string;
  data?: Testimonial;
}

export interface TestimonialListResponse {
  success: boolean;
  total: number;
  data: Testimonial[];
}
