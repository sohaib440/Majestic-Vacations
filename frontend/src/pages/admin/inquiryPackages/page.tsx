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
import { useGetAllPackageInquiries, useDeletePackageInquiry } from '@/features/packageInquiryApi';
import { formatPrice } from '@/lib/tour-utils';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';

const baseUrl = import.meta.env.VITE_API_URL;

const AdminInquiryPackagesPage: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const [searchInput, setSearchInput] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const { data, isLoading, refetch } = useGetAllPackageInquiries(
    filters.page,
    filters.limit,
    searchInput,
    locationFilter
  );
  const deleteInquiry = useDeletePackageInquiry();

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setLocationFilter('');
    setFilters({ page: 1, limit: 10 });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry package?')) {
      try {
        await deleteInquiry.mutateAsync(id);
        toast({ title: 'Success', description: 'Inquiry package deleted successfully' });
        refetch();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete inquiry package',
          variant: 'destructive',
        });
      }
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (isLoading) return <LoadingSpinner />;

  const inquiries = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.pages || 1;
  const currentPage = filters.page || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiry Packages</h1>
          <p className="text-muted-foreground">Manage all inquiry packages ({total} total)</p>
        </div>
        <Button asChild>
          <Link to="/admin/inquiry-packages/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Inquiry Package
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
              <label className="text-sm font-medium mb-2 block">Search by Package Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by package name..."
                  className="pl-10"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter by Location</label>
              <Input
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
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
                <TableHead>Package Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Average Price</TableHead>
                <TableHead>Media Count</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {inquiry.media && inquiry.media.length > 0 && (
                        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={`${baseUrl}/${inquiry.media[0].url}`}
                            alt={inquiry.packageName}
                            className="h-full w-full object-cover"
                            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{inquiry.packageName}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {inquiry.packageDescription}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{inquiry.location || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>
                    {inquiry.packageAveragePrice > 0
                      ? formatPrice(inquiry.packageAveragePrice)
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{inquiry.media?.length || 0} files</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{inquiry.createdBy?.name || 'Unknown'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/inquiry-packages/${inquiry._id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/inquiry-packages/${inquiry._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(inquiry._id)}
                        disabled={deleteInquiry.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {inquiries.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No inquiry packages found</div>
              <Button asChild>
                <Link to="/admin/inquiry-packages/create">Create your first inquiry package</Link>
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

export default AdminInquiryPackagesPage;
