// src/pages/admin/bookings/page.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
   Search,
   MoreVertical,
   Eye,
   Edit,
   Trash2,
   Calendar,
   User,
   Phone,
   Mail,
   Filter,
   Download
} from 'lucide-react';
import { useGetAllBookings, useCancelBooking } from '@/features/bookingApi';
import { BookingFilters } from '@/types/booking';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

// Status badge colors
const statusColors: Record<string, string> = {
   pending: 'bg-yellow-100 text-yellow-800',
   confirmed: 'bg-green-100 text-green-800',
   cancelled: 'bg-red-100 text-red-800',
   completed: 'bg-blue-100 text-blue-800',
};

const paymentStatusColors: Record<string, string> = {
   unpaid: 'bg-gray-100 text-gray-800',
   partial: 'bg-orange-100 text-orange-800',
   paid: 'bg-green-100 text-green-800',
   failed: 'bg-red-100 text-red-800',
};

export default function BookingsPage() {
   const navigate = useNavigate();
   const [filters, setFilters] = useState<BookingFilters>({
      page: 1,
      limit: 10,
      sort: '-createdAt',
   });
   const [search, setSearch] = useState('');

   const { data: bookingsData, isLoading, refetch } = useGetAllBookings(filters);
   const cancelBookingMutation = useCancelBooking();

   const handleSearch = () => {
      setFilters(prev => ({ ...prev, search, page: 1 }));
   };

   const handleStatusFilter = (status: string) => {
      const statusValue = status === "all" ? undefined : status;
      setFilters(prev => ({ ...prev, status: statusValue, page: 1 }));
   };

   const handlePageChange = (page: number) => {
      setFilters(prev => ({ ...prev, page }));
   };

   const handleCancelBooking = async (id: string) => {
      if (!window.confirm('Are you sure you want to cancel this booking?')) return;

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
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
               <p className="text-muted-foreground">
                  Manage and monitor all bookings
               </p>
            </div>
            <div className="flex items-center gap-2">
               <Button onClick={() => navigate('/admin/bookings/create')}>
                  Create Booking
               </Button>
            </div>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                     <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                           placeholder="Search by name, email, or booking reference..."
                           className="pl-9"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                     </div>
                  </div>
                  <div className="w-full md:w-48">
                     <Select
                        onValueChange={handleStatusFilter}
                        defaultValue="all"
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Status</SelectItem>
                           <SelectItem value="pending">Pending</SelectItem>
                           <SelectItem value="confirmed">Confirmed</SelectItem>
                           <SelectItem value="cancelled">Cancelled</SelectItem>
                           <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <Button onClick={handleSearch}>
                     <Filter className="mr-2 h-4 w-4" />
                     Apply Filters
                  </Button>
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardContent className="p-0">
               {isLoading ? (
                  <div className="space-y-3 p-6">
                     {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                     ))}
                  </div>
               ) : (
                  <>
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Booking Ref</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Tour</TableHead>
                              <TableHead>Seats</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Payment</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {bookings.map((booking) => (
                              <TableRow key={booking._id}>
                                 <TableCell className="font-mono text-sm">
                                    {booking.bookingReference}
                                 </TableCell>
                                 <TableCell>
                                    <div className="space-y-1">
                                       <div className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          <span className="font-medium">{booking.customerInfo.fullName}</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Mail className="h-3 w-3" />
                                          {booking.customerInfo.email}
                                       </div>
                                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Phone className="h-3 w-3" />
                                          {booking.customerInfo.phone}
                                       </div>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div>
                                       <p className="font-medium">{booking.tour.title}</p>
                                       <p className="text-sm text-muted-foreground">
                                          {booking.tour.destination}, {booking.tour.country}
                                       </p>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="text-center">
                                       <span className="font-bold text-lg">
                                          {booking.seatsBooked}
                                       </span>
                                       <p className="text-xs text-muted-foreground">
                                          Seats
                                       </p>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div>
                                       <p className="font-medium">${booking.pricing.totalAmount}</p>
                                       <p className="text-xs text-muted-foreground capitalize">
                                          {booking.pricing.paymentPlan} payment
                                       </p>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <Badge className={statusColors[booking.bookingStatus]}>
                                       {booking.bookingStatus}
                                    </Badge>
                                 </TableCell>
                                 <TableCell>
                                    <Badge className={paymentStatusColors[booking.paymentStatus]}>
                                       {booking.paymentStatus}
                                    </Badge>
                                 </TableCell>
                                 <TableCell>
                                    {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                                 </TableCell>
                                 <TableCell className="text-right">
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                             <MoreVertical className="h-4 w-4" />
                                          </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                          <DropdownMenuItem onClick={() => navigate(`/admin/bookings/${booking._id}`)}>
                                             <Eye className="mr-2 h-4 w-4" />
                                             View Details
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => navigate(`/admin/bookings/${booking._id}/edit`)}>
                                             <Edit className="mr-2 h-4 w-4" />
                                             Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          {booking.bookingStatus !== 'cancelled' && (
                                             <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => handleCancelBooking(booking._id)}
                                             >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Cancel Booking
                                             </DropdownMenuItem>
                                          )}
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>

                     {bookings.length === 0 && (
                        <div className="text-center py-12">
                           <p className="text-muted-foreground">No bookings found</p>
                        </div>
                     )}
                  </>
               )}
            </CardContent>
         </Card>

         {totalPages > 1 && (
            <Pagination>
               <PaginationContent>
                  <PaginationItem>
                     <PaginationPrevious
                        onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                        className={filters.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                     />
                  </PaginationItem>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                     const pageNum = i + 1;
                     return (
                        <PaginationItem key={pageNum}>
                           <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={filters.page === pageNum}
                              className="cursor-pointer"
                           >
                              {pageNum}
                           </PaginationLink>
                        </PaginationItem>
                     );
                  })}

                  <PaginationItem>
                     <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, (filters.page || 1) + 1))}
                        className={filters.page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                     />
                  </PaginationItem>
               </PaginationContent>
            </Pagination>
         )}
      </div>
   );
}