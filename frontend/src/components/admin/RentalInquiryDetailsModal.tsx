import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

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

interface RentalInquiryDetailsModalProps {
  inquiry: RentalInquiry | null;
  isOpen: boolean;
  onClose: () => void;
}

const RentalInquiryDetailsModal: React.FC<RentalInquiryDetailsModalProps> = ({
  inquiry,
  isOpen,
  onClose,
}) => {
  if (!inquiry) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-primary">
            Rental Inquiry Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-amber-200">
              Guest Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{inquiry.userName}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{inquiry.userEmail}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {inquiry.userPhone || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-amber-200">
              Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Package Name</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{inquiry.packageName}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{inquiry.location}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Start Date</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatDate(inquiry.startDate)}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">End Date</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatDate(inquiry.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Capacity & Duration Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-amber-200">
              Duration & Capacity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Number of Days</label>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-2xl font-bold text-amber-600">{inquiry.numberOfDays}</p>
                  <Badge className="bg-amber-100 text-amber-800">days</Badge>
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Number of Guests</label>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-2xl font-bold text-amber-600">{inquiry.numberOfGuests}</p>
                  <Badge className="bg-amber-100 text-amber-800">guest{inquiry.numberOfGuests !== 1 ? 's' : ''}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Info Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-gray-600">Inquiry Submitted</label>
            <p className="text-gray-700 mt-1 font-medium">
              {formatDateTime(inquiry.createdAt)}
            </p>
         
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalInquiryDetailsModal;
