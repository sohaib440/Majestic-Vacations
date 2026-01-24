// src/pages/admin/packages/page.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { useGetAllTours, useDeleteTour } from '@/features/tourPackageApi';
import { TourPackageFilters } from '@/types/tour-package';
import { formatPrice } from '@/lib/tour-utils';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';
const baseUrl = import.meta.env.VITE_API_URL
const AdminPackagesPage: React.FC = () => {
  const [filters, setFilters] = useState<TourPackageFilters>({
    page: 1,
    limit: 10,
    sort: '-createdAt',
  });

  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, refetch } = useGetAllTours(filters);
  const deleteTour = useDeleteTour();

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      title: searchInput.trim() || undefined,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters({ page: 1, limit: 10, sort: '-createdAt' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tour package?')) {
      try {
        await deleteTour.mutateAsync(id);
        toast({ title: 'Success', description: 'Tour package deleted successfully' });
        refetch();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete tour package',
          variant: 'destructive',
        });
      }
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (isLoading) return <LoadingSpinner />;

  const tours = data?.data?.tours || [];
  const results = data?.results || 0;
  const totalPages = Math.ceil(results / (filters.limit || 10));
  const currentPage = filters.page || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tour Packages</h1>
          <p className="text-muted-foreground">Manage all tour packages ({results} total)</p>
        </div>
        <Button asChild>
          <Link to="/admin/packages/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Package
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search by Title</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by tour title..."
                  className="pl-10"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch}>
                <Filter className="mr-2 h-4 w-4" />
                Apply
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tour</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={`${baseUrl}/${tour.images[0]}`} // Use the utility function here
                          alt={tour.title}
                          className="h-full w-full object-cover"
                          onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{tour.title}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tour.country}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{tour.startDate}</span>
                  </TableCell>
                  <TableCell>{tour.destination}</TableCell>
                  <TableCell>{tour.duration}</TableCell>
                  <TableCell>⭐ {tour.rating.toFixed(1)}</TableCell>
                  <TableCell>
                    {tour.featured ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {tour.isActive ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/packages/${tour._id}/detail`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/packages/${tour._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(tour._id)}
                        disabled={deleteTour.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {tours.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No tour packages found</div>
              <Button asChild>
                <Link to="/admin/packages/create">Create your first package</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminPackagesPage;