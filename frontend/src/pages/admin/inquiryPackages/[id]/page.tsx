import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetPackageInquiryById, useDeletePackageInquiry } from '@/features/packageInquiryApi';
import { toast } from '@/hooks/use-toast';
import { MapPin, DollarSign, Calendar, User, ChevronLeft, ChevronRight, Edit, Trash2, X } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useState } from 'react';

const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ViewInquiryPackagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);

  const { data: packageInquiry, isLoading, error } = useGetPackageInquiryById(id || '');
  const deleteInquiry = useDeletePackageInquiry();

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this inquiry package?')) {
      try {
        await deleteInquiry.mutateAsync(id);
        toast({
          title: 'Success',
          description: 'Inquiry package deleted successfully',
        });
        navigate('/admin/inquiry-packages');
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete inquiry package',
          variant: 'destructive',
        });
      }
    }
  };

  const handleNextMedia = () => {
    if (packageInquiry?.media) {
      setCurrentMediaIndex((prev) => (prev + 1) % packageInquiry.media.length);
    }
  };

  const handlePrevMedia = () => {
    if (packageInquiry?.media) {
      setCurrentMediaIndex((prev) =>
        prev === 0 ? packageInquiry.media.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !packageInquiry) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">View Inquiry Package</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>Failed to load inquiry package. Please try again.</p>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/inquiry-packages')}
                className="mt-4"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentMedia = packageInquiry.media?.[currentMediaIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/inquiry-packages')}
            className="mb-4"
          >
            ← Back to Packages
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{packageInquiry.packageName}</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href={`/admin/inquiry-packages/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </a>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteInquiry.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Media Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {packageInquiry.media && packageInquiry.media.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Media Display */}
                  <div 
                    className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center cursor-pointer hover:opacity-90 transition"
                    onClick={() => setShowFullscreenModal(true)}
                  >
                    {currentMedia?.type === 'video' ? (
                      <video
                        src={`${baseUrl}${currentMedia.url}`}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={`${baseUrl}${currentMedia?.thumbnail || currentMedia?.url}`}
                        alt="Package media"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80';
                        }}
                      />
                    )}

                    {packageInquiry.media.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevMedia}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleNextMedia}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {currentMediaIndex + 1}/{packageInquiry.media.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {packageInquiry.media.map((media, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                          index === currentMediaIndex
                            ? 'border-amber-500'
                            : 'border-gray-300 opacity-60 hover:opacity-100'
                        }`}
                      >
                        {media.type === 'video' ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="text-xs text-gray-600">Video</div>
                          </div>
                        ) : (
                          <img
                            src={`${baseUrl}${media.thumbnail || media.url}`}
                            alt={`Thumbnail ${index}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&q=80';
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No media available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Package Info Card */}
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Location */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Location</h3>
                <div className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">{packageInquiry.location || 'Not specified'}</span>
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Average Price</h3>
                <div className="flex items-center gap-2 text-2xl font-bold text-amber-600">
                  <DollarSign className="h-6 w-6" />
                  <span>{packageInquiry.packageAveragePrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Created Date */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Created</h3>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>{new Date(packageInquiry.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Creator */}
              {packageInquiry.createdBy && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Created By</h3>
                  <div>
                    <p className="font-medium text-gray-900">{packageInquiry.createdBy.userName}</p>
                    <p className="text-sm text-gray-600">{packageInquiry.createdBy.userEmail}</p>
                  </div>
                </div>
              )}

              {/* Media Count */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Media Files</h3>
                <Badge variant="secondary" className="text-base py-1">
                  {packageInquiry.media?.length || 0} files
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description Section */}
      {packageInquiry.packageDescription && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {packageInquiry.packageDescription}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Fullscreen Media Modal */}
      {showFullscreenModal && currentMedia && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullscreenModal(false)}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowFullscreenModal(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition"
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Navigation buttons */}
            {packageInquiry.media.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentMediaIndex((prev) => (prev === 0 ? packageInquiry.media.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 text-white hover:bg-white/20 p-3 rounded-full transition"
                  aria-label="Previous media"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentMediaIndex((prev) => (prev + 1) % packageInquiry.media.length);
                  }}
                  className="absolute right-4 text-white hover:bg-white/20 p-3 rounded-full transition"
                  aria-label="Next media"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>

                {/* Media counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {currentMediaIndex + 1} / {packageInquiry.media.length}
                </div>
              </>
            )}

            {/* Media content */}
            {currentMedia.type === 'video' ? (
              <video
                src={`${baseUrl}${currentMedia.url}`}
                controls
                className="max-w-full max-h-[90vh] object-contain"
                autoPlay
              />
            ) : (
              <img
                src={`${baseUrl}${currentMedia.url}`}
                alt="Package media fullscreen"
                className="max-w-full max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInquiryPackagePage;
