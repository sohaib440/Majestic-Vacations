// pages/packages/page.tsx
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import PackagesGrid from '@/components/shared/PackagesGrid';
import { TourPackageFilters } from '@/types/tour-package';
import { Sparkles } from 'lucide-react';

// pages/packages/page.tsx
const PackagesPage: React.FC = () => {
  const [filters, setFilters] = useState<TourPackageFilters>({
    page: 1,
    limit: 12,
    sort: '-createdAt',
    featured: true, // This will filter for featured packages only
  });
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Premium Selection</span>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Our Packages
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked premium experiences curated for the discerning traveler
            </p>
          </div>
        </div>

        <div className="container mx-auto p-4">
          <PackagesGrid
            // filters={filters}
            isAdmin={false} // ← ADD THIS
            variant="featured"
            gridCols={{ sm: 1, md: 2, lg: 3 }}
            emptyMessage="No featured packages available at the moment"
          />
        </div>
      </div>
    </Layout>
  );
};

export default PackagesPage;