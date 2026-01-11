// src/components/shared/FeaturedPackagesSection.tsx
import React from 'react';
import { SectionHeading } from './SectionHeading';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PackagesGrid from './PackagesGrid';

interface FeaturedPackagesSectionProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  limit?: number;
}

const FeaturedPackagesSection: React.FC<FeaturedPackagesSectionProps> = ({
  title = "Featured Packages",
  subtitle = "Our most popular curated experiences, designed for travelers who seek the extraordinary.",
  showViewAll = true,
  limit = 3
}) => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading
          title={title}
          subtitle={subtitle}
        />

        <PackagesGrid
          filters={{ featured: true }}
          limit={limit}
          variant="featured"
          gridCols={{ sm: 1, md: 2, lg: 3 }}
          emptyMessage="No featured packages available at the moment"
        />

        {showViewAll && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/packages">
                View All Packages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPackagesSection;