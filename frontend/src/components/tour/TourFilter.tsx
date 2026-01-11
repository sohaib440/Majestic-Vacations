// src/components/tour/TourFilter.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { TourPackageFilters } from '@/types/tour-package';

interface TourFilterProps {
   filters: TourPackageFilters;
   onFilterChange: (filters: TourPackageFilters) => void;
   onReset: () => void;
}

const TourFilter: React.FC<TourFilterProps> = ({ filters, onFilterChange, onReset }) => {
   const handleInputChange = (key: keyof TourPackageFilters, value: any) => {
      onFilterChange({ ...filters, [key]: value, page: 1 });
   };

   const handlePriceChange = (values: number[]) => {
      onFilterChange({
         ...filters,
         minPrice: values[0],
         maxPrice: values[1],
         page: 1,
      });
   };

   const handleSortChange = (value: string) => {
      onFilterChange({
         ...filters,
         sort: value,
         page: 1,
      });
   };

   return (
      <Card>
         <CardContent className="p-6">
            <div className="space-y-6">
               <div>
                  <Label htmlFor="search" className="flex items-center gap-2 mb-2">
                     <Search className="h-4 w-4" />
                     Search
                  </Label>
                  <Input
                     id="search"
                     placeholder="Search tours by name..."
                     value={filters.search || ''}
                     onChange={(e) => handleInputChange('search', e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && onFilterChange(filters)}
                  />
               </div>

               <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                     value={filters.difficulty || "all"} // Change from "" to "all"
                     onValueChange={(value) => handleInputChange('difficulty', value === "all" ? undefined : value)}
                  >
                     <SelectTrigger id="difficulty">
                        <SelectValue placeholder="All difficulties" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">All difficulties</SelectItem> {/* Changed from "" to "all" */}
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="difficult">Difficult</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <div>
                  <Label>Price Range (Individual)</Label>
                  <Slider
                     defaultValue={[filters.minPrice || 0, filters.maxPrice || 10000]}
                     max={10000}
                     step={100}
                     onValueChange={handlePriceChange}
                     className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                     <span>${filters.minPrice || 0}</span>
                     <span>${filters.maxPrice || 10000}</span>
                  </div>
               </div>

               <div>
                  <Label>Sort By</Label>
                  <Select
                     value={filters.sort || '-createdAt'}
                     onValueChange={handleSortChange}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="-createdAt">Newest First</SelectItem>
                        <SelectItem value="createdAt">Oldest First</SelectItem>
                        <SelectItem value="price.individual.base">Price: Low to High</SelectItem>
                        <SelectItem value="-price.individual.base">Price: High to Low</SelectItem>
                        <SelectItem value="name">Name: A to Z</SelectItem>
                        <SelectItem value="-name">Name: Z to A</SelectItem>
                        <SelectItem value="duration">Duration: Short to Long</SelectItem>
                        <SelectItem value="-duration">Duration: Long to Short</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <div className="flex items-center gap-2">
                  <Label className="flex items-center gap-2 cursor-pointer">
                     <input
                        type="checkbox"
                        checked={filters.isFeatured || false}
                        onChange={(e) => handleInputChange('isFeatured', e.target.checked ? true : undefined)}
                        className="rounded"
                     />
                     Featured Only
                  </Label>
               </div>

               <div className="flex gap-2 pt-2">
                  <Button onClick={() => onFilterChange(filters)} className="flex-1">
                     <Filter className="h-4 w-4 mr-2" />
                     Apply Filters
                  </Button>
                  <Button variant="outline" onClick={onReset}>
                     <X className="h-4 w-4 mr-2" />
                     Reset
                  </Button>
               </div>
            </div>
         </CardContent>
      </Card>
   );
};

export default TourFilter;