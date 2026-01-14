import React from 'react';
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
   Download,
   Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Booking } from '@/types/booking';

interface BookingsListProps {
   title?: string;
   description?: string;
   showCreateButton?: boolean;
   showExportButton?: boolean;
   filters?: any;
   onFiltersChange?: (filters: any) => void;
   bookings: Booking[];
   isLoading: boolean;
   totalPages: number;
   currentPage: number;
   onPageChange: (page: number) => void;
   onCancelBooking?: (id: string) => void;
   onSearch?: (search: string) => void;
   onStatusFilter?: (status: string) => void;
   showCustomerActions?: boolean;
   showAdminActions?: boolean;
}

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

const BookingsList: React.FC<BookingsListProps> = ({
   title = "Bookings",
   description = "Manage and monitor all bookings",
   showCreateButton = true,
   showExportButton = true,
   filters = {},
   onFiltersChange,
   bookings = [],
   isLoading = false,
   totalPages = 1,
   currentPage = 1,
   onPageChange,
   onCancelBooking,
   onSearch,
   onStatusFilter,
   showCustomerActions = false,
   showAdminActions = true,
}) => {
   const navigate = useNavigate();
   const [searchInput, setSearchInput] = React.useState(filters.search || '');

   const handleSearch = () => {
      if (onSearch) {
         onSearch(searchInput);
      }
   };

   const handleStatusFilter = (status: string) => {
      if (onStatusFilter) {
         onStatusFilter(status);
      }
   };

   const handleCancel = (id: string) => {
      if (window.confirm('Are you sure you want to cancel this booking?')) {
         if (onCancelBooking) {
            onCancelBooking(id);
         }
      }
   };

   // Filter bookings for customers page (only show paid & confirmed/completed)
   const filteredBookings = showCustomerActions
      ? bookings.filter(booking =>
         booking.paymentStatus === 'paid' &&
         (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'completed')
      )
      : bookings;

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
               <p className="text-muted-foreground">
                  {showCustomerActions
                     ? "View your confirmed and completed bookings"
                     : description}
               </p>
            </div>
            <div className="flex items-center gap-2">
               {showCreateButton && (
                  <Button onClick={() => navigate('/admin/bookings/create')}>
                     <Plus className="mr-2 h-4 w-4" />
                     Create Booking
                  </Button>
               )}
            </div>
         </div>

         {/* Filters */}
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
                           placeholder={
                              showCustomerActions
                                 ? "Search your bookings..."
                                 : "Search by name, email, or booking reference..."
                           }
                           className="pl-9"
                           value={searchInput}
                           onChange={(e) => setSearchInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                     </div>
                  </div>
                  {!showCustomerActions && (
                     <div className="w-full md:w-48">
                        <Select
                           onValueChange={handleStatusFilter}
                           defaultValue={filters.status || "all"}
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
                  )}
                  <Button onClick={handleSearch}>
                     <Filter className="mr-2 h-4 w-4" />
                     Apply Filters
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Table */}
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
                              {!showCustomerActions && <TableHead>Customer</TableHead>}
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
                           {filteredBookings.map((booking) => (
                              <TableRow key={booking._id}>
                                 <TableCell className="font-mono text-sm">
                                    {booking.bookingReference}
                                 </TableCell>
                                 {!showCustomerActions && (
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
                                 )}
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
                                          {showAdminActions && (
                                             <>
                                                <DropdownMenuItem onClick={() => navigate(`/admin/bookings/${booking._id}/edit`)}>
                                                   <Edit className="mr-2 h-4 w-4" />
                                                   Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {booking.bookingStatus !== 'cancelled' && (
                                                   <DropdownMenuItem
                                                      className="text-red-600"
                                                      onClick={() => handleCancel(booking._id)}
                                                   >
                                                      <Trash2 className="mr-2 h-4 w-4" />
                                                      Cancel Booking
                                                   </DropdownMenuItem>
                                                )}
                                             </>
                                          )}
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>

                     {filteredBookings.length === 0 && (
                        <div className="text-center py-12">
                           <p className="text-muted-foreground">
                              {showCustomerActions
                                 ? "No confirmed bookings found"
                                 : "No bookings found"}
                           </p>
                        </div>
                     )}
                  </>
               )}
            </CardContent>
         </Card>

         {/* Pagination */}
         {totalPages > 1 && !showCustomerActions && (
            <Pagination>
               <PaginationContent>
                  <PaginationItem>
                     <PaginationPrevious
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                     />
                  </PaginationItem>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                     const pageNum = i + 1;
                     return (
                        <PaginationItem key={pageNum}>
                           <PaginationLink
                              onClick={() => onPageChange(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                           >
                              {pageNum}
                           </PaginationLink>
                        </PaginationItem>
                     );
                  })}

                  <PaginationItem>
                     <PaginationNext
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                     />
                  </PaginationItem>
               </PaginationContent>
            </Pagination>
         )}
      </div>
   );
};

export default BookingsList;