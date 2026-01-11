// src/components/shared/DestinationPackagesSection.tsx
import React from 'react';
import { SectionHeading } from './SectionHeading';
import PackagesGrid from './PackagesGrid';

interface DestinationPackagesSectionProps {
   country: string; // Changed from destination to country
   title?: string;
   subtitle?: string;
   variant?: 'default' | 'featured';
   limit?: number;
   showOnlyFeatured?: boolean;
}

const DestinationPackagesSection: React.FC<DestinationPackagesSectionProps> = ({
   country,
   title = "Tour Packages",
   subtitle = "Choose from our carefully crafted packages for an unforgettable experience.",
   variant = 'default',
   limit = 6,
   showOnlyFeatured = false
}) => {
   return (
      <section className="py-20 bg-background">
         <div className="container mx-auto px-4">
            <SectionHeading
               title={title}
               subtitle={subtitle}
            />

            <PackagesGrid
               country={country} // Pass country instead of destination
               featured={showOnlyFeatured ? true : undefined} // Pass undefined to show all
               limit={limit}
               variant={variant}
               gridCols={{ sm: 1, md: 2, lg: 3 }}
               emptyMessage={`No packages available for ${country} at the moment.`}
            />
         </div>
      </section>
   );
};

export default DestinationPackagesSection;