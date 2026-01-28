import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CreateVacationRentalInquiryDto } from '@/features/vacationRentalInquiryApi';

interface VacationRentalInquiryFormProps {
  onSubmit: (data: CreateVacationRentalInquiryDto) => void;
  isSubmitting?: boolean;
}

const VacationRentalInquiryForm: React.FC<VacationRentalInquiryFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    packageName: '',
    numberOfDays: '1',
    location: '',
    numberOfGuests: '1',
    startDate: '',
    endDate: '',
  });

  const [startDate, setStartDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim() || formData.userName.length < 2) {
      newErrors.userName = 'Name must be at least 2 characters';
    }
    if (!formData.userEmail.trim() || !formData.userEmail.includes('@')) {
      newErrors.userEmail = 'Please enter a valid email address';
    }
    if (!formData.packageName.trim() || formData.packageName.length < 3) {
      newErrors.packageName = 'Package name must be at least 3 characters';
    }
    if (!formData.location.trim() || formData.location.length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    const numDays = parseInt(formData.numberOfDays);
    if (isNaN(numDays) || numDays < 1 || numDays > 365) {
      newErrors.numberOfDays = 'Must be between 1 and 365 days';
    }

    const numGuests = parseInt(formData.numberOfGuests);
    if (isNaN(numGuests) || numGuests < 1) {
      newErrors.numberOfGuests = 'Must have at least 1 guest';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const inquiryData: CreateVacationRentalInquiryDto = {
      userName: formData.userName,
      userEmail: formData.userEmail,
      userPhone: formData.userPhone,
      packageName: formData.packageName,
      numberOfDays: parseInt(formData.numberOfDays),
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      numberOfGuests: parseInt(formData.numberOfGuests),
    };

    onSubmit(inquiryData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Information Section */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200 shadow-sm">
        <h3 className="text-lg font-bold text-amber-900 mb-5 flex items-center gap-2">
          <span>👤</span>
          Personal Information
        </h3>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-amber-900 mb-2">Full Name *</label>
          <Input 
            type="text"
            name="userName"
            placeholder="Enter your full name" 
            value={formData.userName}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`rounded-lg ${errors.userName ? 'border-red-500 focus:border-red-500' : 'border-amber-200'}`}
          />
          {errors.userName && <p className="text-red-500 text-xs mt-2 font-medium">{errors.userName}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-amber-900 mb-2">Email Address *</label>
          <Input 
            type="email"
            name="userEmail"
            placeholder="Enter your email address" 
            value={formData.userEmail}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`rounded-lg ${errors.userEmail ? 'border-red-500 focus:border-red-500' : 'border-amber-200'}`}
          />
          {errors.userEmail && <p className="text-red-500 text-xs mt-2 font-medium">{errors.userEmail}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-amber-900 mb-2">Phone Number (Optional)</label>
          <Input 
            type="tel"
            name="userPhone"
            placeholder="Enter your phone number" 
            value={formData.userPhone}
            onChange={handleChange}
            disabled={isSubmitting}
            className="rounded-lg border-amber-200"
          />
        </div>
      </div>

      {/* Package Information Section */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200 shadow-sm">
        <h3 className="text-lg font-bold text-amber-900 mb-5 flex items-center gap-2">
          <span>🏠</span>
          Vacation Rental Details
        </h3>

        {/* Package Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-amber-900 mb-2">Package Name *</label>
          <Input 
            type="text"
            name="packageName"
            placeholder="e.g., Beach Paradise, Mountain Retreat" 
            value={formData.packageName}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`rounded-lg ${errors.packageName ? 'border-red-500 focus:border-red-500' : 'border-amber-200'}`}
          />
          {errors.packageName && <p className="text-red-500 text-xs mt-2 font-medium">{errors.packageName}</p>}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-amber-900 mb-2">Location *</label>
          <Input 
            type="text"
            name="location"
            placeholder="e.g., Dubai, Greece, Thailand" 
            value={formData.location}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`rounded-lg ${errors.location ? 'border-red-500 focus:border-red-500' : 'border-amber-200'}`}
          />
          {errors.location && <p className="text-red-500 text-xs mt-2 font-medium">{errors.location}</p>}
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">Start Date *</label>
            <Input 
              type="date"
              name="startDate"
              min={new Date().toISOString().split('T')[0]}
              value={formData.startDate}
              onChange={(e) => {
                handleChange(e);
                setStartDate(e.target.value);
              }}
              disabled={isSubmitting}
              className={`rounded-lg ${errors.startDate ? 'border-red-500 focus:border-red-500' : 'border-amber-200'}`}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-2 font-medium">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">End Date *</label>
            <Input 
              type="date"
              name="endDate"
              min={startDate || new Date().toISOString().split('T')[0]}
              value={formData.endDate}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`rounded-lg ${errors.endDate ? 'border-red-500 focus:border-red-500' : 'border-amber-200'}`}
            />
            {errors.endDate && <p className="text-red-500 text-xs mt-2 font-medium">{errors.endDate}</p>}
          </div>
        </div>

        {/* Guest Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Number of Days */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">Number of Days *</label>
            <Input 
              type="number"
              name="numberOfDays"
              min="1"
              max="365"
              placeholder="Enter number of days" 
              value={formData.numberOfDays}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`rounded-lg ${errors.numberOfDays ? 'border-red-500 focus:border-red-500' : 'border-amber-200'}`}
            />
            {errors.numberOfDays && <p className="text-red-500 text-xs mt-2 font-medium">{errors.numberOfDays}</p>}
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">Number of Guests *</label>
            <Input 
              type="number"
              name="numberOfGuests"
              min="1"
              placeholder="Enter number of guests" 
              value={formData.numberOfGuests}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`rounded-lg ${errors.numberOfGuests ? 'border-red-500 focus:border-red-500' : 'border-amber-200'}`}
            />
            {errors.numberOfGuests && <p className="text-red-500 text-xs mt-2 font-medium">{errors.numberOfGuests}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 disabled:hover:bg-gray-400 text-white py-3 text-base font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block animate-spin">⏳</span>
            Submitting...
          </span>
        ) : (
          '✨ Submit Inquiry'
        )}
      </button>
    </form>
  );
};

export default VacationRentalInquiryForm;
