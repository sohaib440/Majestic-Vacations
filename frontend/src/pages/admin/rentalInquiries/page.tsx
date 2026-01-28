import React, { useState, useEffect } from 'react';
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
import { Search, Trash2, Eye, Filter, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';
import RentalInquiryDetailsModal from '@/components/admin/RentalInquiryDetailsModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RentalInquiry {
  _id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  packageName: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
  location: string;
  numberOfGuests: number;
  createdAt: string;
}

const AdminRentalInquiriesPage: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const [searchInput, setSearchInput] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedLocation, setDebouncedLocation] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<RentalInquiry | null>(null);
  const [deleteInquiryId, setDeleteInquiryId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce location filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(locationFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [locationFilter]);

  // Fetch rental inquiries
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['rentalInquiries', filters.page, filters.limit, debouncedSearch, debouncedLocation],
    queryFn: async () => {
      const response = await api.get('/vacation-rental-inquiries', {
        params: {
          page: filters.page,
          limit: filters.limit,
          search: debouncedSearch,
          location: debouncedLocation,
        },
      });
      return response.data;
    },
  });

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
    }));
    // Trigger search immediately
    setDebouncedSearch(searchInput);
    setDebouncedLocation(locationFilter);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setLocationFilter('');
    setFilters({ page: 1, limit: 10 });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteInquiryId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteInquiryId) return;
    
    try {
      await api.delete(`/vacation-rental-inquiries/${deleteInquiryId}`);
      toast({ 
        title: 'Success', 
        description: 'Rental inquiry deleted successfully',
        variant: 'default'
      });
      setDeleteInquiryId(null);
      refetch();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete rental inquiry';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rental Inquiries</h1>
          <p className="text-muted-foreground">Manage all vacation rental inquiries ({total} total)</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location Filter */}
            <Input
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />

            {/* Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1">
                Search
              </Button>
              <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Rental Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No rental inquiries found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry: RentalInquiry) => (
                      <TableRow key={inquiry._id}>
                        <TableCell className="font-medium">{inquiry.userName}</TableCell>
                        <TableCell className="text-sm">{inquiry.userEmail}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{inquiry.packageName}</Badge>
                        </TableCell>
                        <TableCell>{inquiry.location}</TableCell>
                        <TableCell className="text-sm">
                          {formatDate(inquiry.startDate)} - {formatDate(inquiry.endDate)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-800">{inquiry.numberOfDays} days</Badge>
                        </TableCell>
                        <TableCell>{inquiry.numberOfGuests}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(inquiry.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedInquiry(inquiry)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(inquiry._id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <RentalInquiryDetailsModal
        inquiry={selectedInquiry}
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteInquiryId} onOpenChange={(open) => !open && setDeleteInquiryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rental Inquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this rental inquiry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminRentalInquiriesPage;
