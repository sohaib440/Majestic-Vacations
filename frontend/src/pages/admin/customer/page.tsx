import React, { useState } from 'react';
import BookingsList from '@/components/booking/BookingsList';
import { useGetAllBookings } from '@/features/bookingApi';
import { BookingFilters } from '@/types/booking';

export default function CustomersPage() {
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
    sort: '-createdAt',
  });
  const [search, setSearch] = useState('');

  const { data: bookingsData, isLoading, refetch } = useGetAllBookings(filters);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // For customers page, we can optionally filter for paid bookings only
  // but we'll let the BookingsList component handle the filtering
  const bookings = bookingsData?.data || [];
  const totalPages = bookingsData?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Customer Bookings List */}
      <BookingsList
        title="Customer Bookings"
        description="View customer bookings and payment status"
        filters={filters}
        bookings={bookings}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={filters.page || 1}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        showCustomerActions={true} // This enables customer view mode
        showAdminActions={false} // Hide admin actions
        showCreateButton={false} // Hide create button
        showExportButton={true}
      />
    </div>
  );
}