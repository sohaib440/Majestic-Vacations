// src/components/shared/PackagesGrid.tsx
import React from 'react';
import PackageCard, { PackageCardProps } from './PackageCard';
import { useGetAllTours } from '@/features/tourPackageApi';
import { TourPackageFilters } from '@/types/tour-package';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface PackagesGridProps extends Omit<PackageCardProps, 'tour'> {
   filters?: TourPackageFilters;
   variant?: PackageCardProps['variant'];
   showActions?: boolean;
   emptyMessage?: string;
   gridCols?: {
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
   };
   className?: string;
   limit?: number;
   country?: string; 
   featured?: boolean; // Optional: show only featured
}

const PackagesGrid: React.FC<PackagesGridProps> = ({
   filters = {},
   variant = 'default',
   showActions = true,
   emptyMessage = 'No tour packages found',
   gridCols = { sm: 1, md: 2, lg: 3, xl: 4 },
   className = '',
   limit,
   country,
   featured,
   onInquire,
   onView
}) => {
   // Build final filters
   const finalFilters: TourPackageFilters = {
      ...filters,
      ...(limit && { limit }),
      ...(country && { country }), // Add country filter
   };
   // Only add featured filter if explicitly provided (not undefined)
   if (featured !== undefined) {
      finalFilters.featured = featured;
   }

   const { data, isLoading } = useGetAllTours(finalFilters);

   if (isLoading) {
      return (
         <div className="flex justify-center py-12">
            <LoadingSpinner />
         </div>
      );
   }

   const tours = data?.data?.tours || [];
   const results = data?.results || 0;

   if (tours.length === 0) {
      return (
         <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">{emptyMessage}</div>
         </div>
      );
   }

   const gridColsClass = `
    grid
    grid-cols-${gridCols.sm || 1}
    ${gridCols.md ? `md:grid-cols-${gridCols.md}` : ''}
    ${gridCols.lg ? `lg:grid-cols-${gridCols.lg}` : ''}
    ${gridCols.xl ? `xl:grid-cols-${gridCols.xl}` : ''}
    gap-6
  `;

   return (
      <div className={`${gridColsClass} ${className}`}>
         {tours.map((tour) => (
            <PackageCard
               key={tour._id}
               tour={tour}
               variant={variant}
               onInquire={onInquire}
               onView={onView}
            />
         ))}
      </div>
   );
};

export default PackagesGrid;