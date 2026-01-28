import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import VacationRentalInquiryForm from '../vacation-rental/VacationRentalInquiryForm';
import { CreateVacationRentalInquiryDto } from '@/features/vacationRentalInquiryApi';

interface VacationRentalInquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateVacationRentalInquiryDto) => void;
  isSubmitting?: boolean;
}

export function VacationRentalInquiryModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: VacationRentalInquiryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl p-0">
        {/* Content Container - Stacked Layout */}
        <div className="space-y-0">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 px-8 py-10 border-b border-amber-200">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              {/* Icon/Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-2xl object-cover border-3 border-white shadow-lg bg-gradient-to-br from-amber-200/40 to-orange-300/40 flex items-center justify-center text-5xl">
                  🏡
                </div>
              </div>

              {/* Header Content */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Vacation Rental Inquiry
                </h2>
                <p className="text-gray-700 font-medium text-base flex items-center gap-2 mb-4">
                  <span>✈️</span>
                  Fill in your details and preferences for your dream vacation
                </p>

                {/* Description Box */}
                <div className="bg-amber-100 border-l-4 border-amber-600 px-4 py-3 rounded-r-lg">
                  <p className="text-sm text-amber-900 leading-relaxed font-medium">
                    Tell us about your ideal vacation rental. We'll help you find the perfect match!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            <VacationRentalInquiryForm
              onSubmit={(data) => {
                onSubmit(data);
                onOpenChange(false);
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
