'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Play, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface MediaItem {
  type: string;
  url: string;
  thumbnail?: string;
}

interface TestimonialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: {
    _id: string;
    name: string;
    location: string;
    avatar: string;
    rating: number;
    text: string;
    destination: string;
    company?: string;
    media: MediaItem[];
  } | null;
}

export function TestimonialModal({
  open,
  onOpenChange,
  testimonial,
}: TestimonialModalProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!testimonial) return null;

  const currentMedia = testimonial.media[selectedMediaIndex];
  const hasMultipleMedia = testimonial.media.length > 1;

  const goToNext = () => {
    setSelectedMediaIndex((prev) => (prev + 1) % testimonial.media.length);
  };

  const goToPrev = () => {
    setSelectedMediaIndex(
      (prev) => (prev - 1 + testimonial.media.length) % testimonial.media.length
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl p-0">
        {/* Content Container - Stacked Layout */}
        <div className="space-y-0">
          {/* Top Section: User Info */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-10 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-28 h-28 rounded-2xl object-cover border-3 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full px-3 py-1 text-sm font-bold text-white flex items-center gap-1 shadow-lg border-2 border-white">
                  <Star className="h-3.5 w-3.5 fill-white" />
                  {testimonial.rating}
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {testimonial.name}
                </h2>
                <p className="text-gray-600 font-medium text-base flex items-center gap-2 mb-2">
                  <span>📍</span>
                  {testimonial.location}
                </p>
                {testimonial.company && (
                  <p className="text-gray-600 text-base flex items-center gap-2">
                    <span>🏢</span>
                    {testimonial.company}
                  </p>
                )}

                {/* Star Rating */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 transition-all ${
                          i < testimonial.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {testimonial.rating}/5 Excellent
                  </span>
                </div>
              </div>
            </div>

            {/* Destination Badge */}
            <div className="bg-white border-2 border-gray-300 px-4 py-3 rounded-xl mt-6 inline-block">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                ✈️ Destination
              </p>
              <p className="text-xl font-bold text-gray-900">{testimonial.destination}</p>
            </div>
          </div>

          {/* Middle Section: Review Text */}
          <div className="px-8 py-8 border-b border-gray-200">
            <div className="bg-blue-50 border-l-4 border-blue-500 px-6 py-5 rounded-r-lg">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                📝 Traveler's Review
              </p>
              <p className="text-gray-800 leading-relaxed text-lg italic font-medium">
                "{testimonial.text}"
              </p>
            </div>
          </div>

          {/* Bottom Section: Media Gallery */}
          {testimonial.media && testimonial.media.length > 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-white relative">
              {/* Gallery Header */}
              <div className="border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900 text-lg font-semibold flex items-center gap-3">
                    <span>🖼️</span>
                    Photo Gallery
                  </h3>
                  <span className="text-sm font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                    {selectedMediaIndex + 1} of {testimonial.media.length}
                  </span>
                </div>
              </div>

              {/* Main Media Display */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 aspect-video flex items-center justify-center overflow-hidden group border-b border-gray-200 m-6 rounded-xl shadow-sm">
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
                    className="w-full h-full object-contain"
                  />
                )}

                {/* Navigation Arrows */}
                {hasMultipleMedia && (
                  <>
                    <button
                      onClick={goToPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-gray-900/80 hover:bg-gray-900 rounded-full transition-all duration-300 text-white z-30 hover:scale-110 shadow-lg"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-gray-900/80 hover:bg-gray-900 rounded-full transition-all duration-300 text-white z-30 hover:scale-110 shadow-lg"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Bar */}
              {hasMultipleMedia && (
                <div className="px-8 py-6 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
                    Navigate Gallery
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {testimonial.media.map((item: MediaItem, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedMediaIndex(idx)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 hover:shadow-md ${
                          selectedMediaIndex === idx
                            ? 'border-amber-400 ring-2 ring-amber-400/50 w-24 h-24'
                            : 'border-gray-300 hover:border-gray-400 w-20 h-20'
                        }`}
                      >
                        <img
                          src={item.thumbnail || item.url}
                          alt="thumbnail"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                            <Play className="h-4 w-4 text-white fill-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-white py-16 text-center border-t border-gray-200">
              <p className="text-gray-500 text-lg font-medium">No media available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}