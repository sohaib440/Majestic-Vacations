import React, { useState } from 'react';
import BookingsList from '@/components/booking/BookingsList';
import { useGetAllBookings, useCancelBooking } from '@/features/bookingApi';
import { BookingFilters } from '@/types/booking';
import { toast } from '@/hooks/use-toast';

export default function BookingsPage() {
   const [filters, setFilters] = useState<BookingFilters>({
      page: 1,
      limit: 10,
      sort: '-createdAt',
   });
   const [search, setSearch] = useState('');

   const { data: bookingsData, isLoading, refetch } = useGetAllBookings(filters);
   const cancelBookingMutation = useCancelBooking();

   const handleSearch = (searchTerm: string) => {
      setSearch(searchTerm);
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
   };

   const handleStatusFilter = (status: string) => {
      const statusValue = status === "all" ? undefined : status;
      setFilters(prev => ({ ...prev, status: statusValue, page: 1 }));
   };

   const handlePageChange = (page: number) => {
      setFilters(prev => ({ ...prev, page }));
   };

   const handleCancelBooking = async (id: string) => {
      try {
         await cancelBookingMutation.mutateAsync(id);
         toast({
            title: 'Success',
            description: 'Booking cancelled successfully',
         });
         refetch();
      } catch (error) {
         toast({
            title: 'Error',
            description: 'Failed to cancel booking',
            variant: 'destructive',
         });
      }
   };

   const bookings = bookingsData?.data || [];
   const totalPages = bookingsData?.totalPages || 1;

   return (
      <BookingsList
         title="Bookings"
         description="Manage and monitor all bookings"
         filters={filters}
         bookings={bookings}
         isLoading={isLoading}
         totalPages={totalPages}
         currentPage={filters.page || 1}
         onPageChange={handlePageChange}
         onCancelBooking={handleCancelBooking}
         onSearch={handleSearch}
         onStatusFilter={handleStatusFilter}
         showAdminActions={true}
         showCreateButton={true}
         showExportButton={true}
      />
   );
}