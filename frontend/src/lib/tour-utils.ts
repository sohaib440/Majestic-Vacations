// src/lib/tour-utils.ts
import { TourPackage } from '@/types/tour-package';
import { getImageUrl } from './image-utils';

// For client-side: use this version
export const formatPrice = (price: number, currencyCode?: string): string => {
   if (typeof window === 'undefined') {
      // Server-side rendering fallback
      return new Intl.NumberFormat('en-US', {
         style: 'currency',
         currency: 'USD',
         minimumFractionDigits: 0,
         maximumFractionDigits: 0,
      }).format(price);
   }

   try {
      // Use the currency service directly (it's already a singleton)
      // We'll create a helper function to handle this
      return formatPriceWithCurrency(price, currencyCode);
   } catch (error) {
      console.error('Error formatting price:', error);
      return new Intl.NumberFormat('en-US', {
         style: 'currency',
         currency: 'USD',
         minimumFractionDigits: 0,
         maximumFractionDigits: 0,
      }).format(price);
   }
};

// Helper function that handles the async import
const formatPriceWithCurrency = (price: number, currencyCode?: string): string => {
   // Dynamic import to avoid server-side issues
   import('@/services/currencyService')
      .then(({ currencyService }) => {
         if (currencyCode) {
            return currencyService.format(price, currencyCode);
         }

         const currentCurrency = currencyService.getCurrentCurrency();
         const convertedAmount = currencyService.convertFromUSD(price, currentCurrency);
         return currencyService.format(convertedAmount, currentCurrency);
      })
      .catch(() => {
         // Fallback to USD formatting
         return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
         }).format(price);
      });

   // Return a temporary value while async operation completes
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(price);
};

// Alternative: Create a simpler formatPrice that doesn't use currency service
// and let the CurrencyPrice component handle conversions
export const formatPriceSimple = (price: number): string => {
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