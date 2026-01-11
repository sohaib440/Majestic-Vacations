// src/lib/tour-utils.ts
import { TourPackage } from '@/types/tour-package';
import { getImageUrl } from './image-utils';

export const formatPrice = (price: number) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(price);
};

export const formatMonthlyPayment = (price: number) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(price);
};

export const calculateMonthlyPaymentPlan = (totalPrice: number, monthlyPrice: number) => {
   const monthsRequired = Math.ceil(totalPrice / monthlyPrice);
   const lastPayment = totalPrice - (monthlyPrice * (monthsRequired - 1));

   return {
      monthsRequired,
      lastPayment,
      payments: Array.from({ length: monthsRequired }, (_, i) =>
         i === monthsRequired - 1 ? lastPayment : monthlyPrice
      )
   };
};

// Get first image from array
export const getPrimaryImage = (tour: TourPackage) => {
   return tour.images && tour.images.length > 0
      ? getImageUrl(tour.images[0])
      : '/placeholder.svg';
};

// Get all other images
export const getOtherImages = (tour: TourPackage) => {
   return tour.images && tour.images.length > 1
      ? tour.images.slice(1).map(img => getImageUrl(img))
      : [];
};

// Create form default values
export const defaultTourPackage: Partial<TourPackage> = {
   title: '',
   destination: '',
   country: 'Dubai',
   startDate: new Date().toISOString().split('T')[0],
   images: [],
   duration: '',
   groupSize: 1,
   price: 0,
   pricePerMonth: 0,
   rating: 4.8,
   highlights: [],
   featured: false,
   bookedSeats: 0,
   availableSeats: 0,
};