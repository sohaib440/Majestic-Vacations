'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Play, ChevronLeft, ChevronRight, Star, X, MapPin, DollarSign } from 'lucide-react';

interface MediaItem {
  type: string;
  url: string;
  thumbnail?: string;
}

interface PackageInquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageInquiry: {
    _id: string;
    packageName: string;
    location: string;
    packageAveragePrice: number;
    packageDescription: string;
    media: MediaItem[];
    createdBy?: {
      name: string;
      email: string;
      avatar?: string;
    };
  } | null;
}

export function PackageInquiryModal({
  open,
  onOpenChange,
  packageInquiry,
}: PackageInquiryModalProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  if (!packageInquiry) return null;

  const currentMedia = packageInquiry.media?.[selectedMediaIndex];
  const hasMultipleMedia = (packageInquiry.media?.length || 0) > 1;

  const goToNext = () => {
    if (packageInquiry.media.length > 0) {
      setSelectedMediaIndex((prev) => (prev + 1) % packageInquiry.media.length);
    }
  };

  const goToPrev = () => {
    if (packageInquiry.media.length > 0) {
      setSelectedMediaIndex(
        (prev) => (prev - 1 + packageInquiry.media.length) % packageInquiry.media.length
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] overflow-hidden bg-white border-0 shadow-2xl rounded-2xl p-0">
        {/* Grid Layout: Left (Info) | Right (Media) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full gap-0">
          
          {/* LEFT SECTION: Package Info */}
          <div className="lg:col-span-2 bg-gradient-to-b from-slate-900 to-slate-800 overflow-y-auto flex flex-col p-6 lg:p-7">
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 lg:hidden p-2 hover:bg-white/20 rounded-full transition-all duration-200 text-white hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Package Name & Basic Info */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                {packageInquiry.packageName}
              </h3>

              {/* Location */}
              <p className="text-sm text-gray-300 flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-amber-400" />
                {packageInquiry.location || "Location not specified"}
              </p>

              {/* Price */}
              <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 mb-6">
                <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">
                  Average Price
                </p>
                <p className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  {packageInquiry.packageAveragePrice.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Description
              </p>
              <p className="text-sm text-gray-200 leading-relaxed italic">
                {packageInquiry.packageDescription || "No description provided"}
              </p>
            </div>
          </div>

          {/* RIGHT SECTION: Media Gallery */}
          <div className="lg:col-span-3 bg-black flex flex-col overflow-hidden">
            {packageInquiry.media && packageInquiry.media.length > 0 ? (
              <>
                {/* Main Media Display */}
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black relative group overflow-hidden">
                  {currentMedia.type === 'video' ? (
                    <video
                      src={currentMedia.url}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={currentMedia.thumbnail || currentMedia.url}
                      alt="media"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Navigation Arrows */}
                  {hasMultipleMedia && (
                    <>
                      <button
                        onClick={goToPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 rounded-full transition-all duration-300 text-white z-20 hover:scale-110"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={goToNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 rounded-full transition-all duration-300 text-white z-20 hover:scale-110"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      
                      {/* Counter */}
                      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {selectedMediaIndex + 1}/{packageInquiry.media.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Bar */}
                {hasMultipleMedia && (
                  <div className="bg-black/50 border-t border-gray-700 px-3 py-3 flex gap-2 overflow-x-auto">
                    {packageInquiry.media.map((item: MediaItem, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedMediaIndex(idx)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                          selectedMediaIndex === idx
                            ? 'border-amber-400 ring-2 ring-amber-400 w-16 h-16'
                            : 'border-gray-600 hover:border-gray-400 w-14 h-14'
                        }`}
                      >
                        <img
                          src={item.thumbnail || item.url}
                          alt="thumbnail"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="h-3 w-3 text-white fill-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">No media available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
