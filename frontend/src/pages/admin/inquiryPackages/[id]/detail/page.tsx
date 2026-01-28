import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetPackageInquiryById, useDeletePackageMedia } from '@/features/packageInquiryApi';
import { formatPrice } from '@/lib/tour-utils';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';
import { Edit, Trash2, ArrowLeft, Video } from 'lucide-react';

// Fix baseUrl to remove /api suffix for media URLs
const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = apiUrl?.replace('/api', '') || 'http://localhost:5000';

const InquiryPackageDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: inquiry, isLoading, refetch, error } = useGetPackageInquiryById(id || '');
  const deleteMedia = useDeletePackageMedia();

  const handleDeleteMedia = async (mediaIndex: number) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        await deleteMedia.mutateAsync({ id: id || '', mediaIndex });
        toast({ title: 'Success', description: 'Media deleted successfully' });
        refetch();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete media',
          variant: 'destructive',
        });
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (!inquiry) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Inquiry Package Not Found</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/inquiry-packages')}
            className="mt-4"
          >
            Back to Inquiry Packages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/admin/inquiry-packages')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{inquiry.packageName}</h1>
            <p className="text-muted-foreground">
              Created by {inquiry.createdBy?.userName || 'Unknown'} on{' '}
              {new Date(inquiry.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href={`/admin/inquiry-packages/${id}/edit`} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </a>
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 whitespace-pre-wrap">
                {inquiry.packageDescription || 'No description provided'}
              </p>
            </CardContent>
          </Card>

          {/* Media Gallery */}
          {inquiry.media && inquiry.media.length > 0 ? (
            <>
              {console.log('📸 Rendering media gallery with', inquiry.media.length, 'items')}
              <Card>
                <CardHeader>
                  <CardTitle>Media Files ({inquiry.media.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {inquiry.media.map((media, index) => (
                      <div key={index} className="relative group">
                        <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square">
                        {media.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Video className="h-8 w-8 text-gray-400" />
                          </div>
                        ) : (
                          <img
                            src={`${baseUrl}${media.url}`}
                            alt={`media-${index}`}
                            className="w-full h-full object-cover"
                            onLoad={(e) => {
                              // Image loaded successfully
                            }}
                            onError={(e) => {
                              const imgElement = e.currentTarget;
                              imgElement.src = '/placeholder.svg';
                            }}
                          />
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                        onClick={() => handleDeleteMedia(index)}
                        disabled={deleteMedia.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <p className="text-xs text-gray-500 mt-1 capitalize text-center">
                        {media.type}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-gray-500">
                No media files available
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-base py-2 px-3">
                {inquiry.location || 'Not specified'}
              </Badge>
            </CardContent>
          </Card>

          {/* Price Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {inquiry.packageAveragePrice > 0
                  ? formatPrice(inquiry.packageAveragePrice)
                  : 'Not set'}
              </p>
            </CardContent>
          </Card>

          {/* Creator Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Created By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{inquiry.createdBy?.name}</p>
                <p className="text-sm text-gray-500">{inquiry.createdBy?.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Media Count:</span>
                <span>{inquiry.media?.length || 0} files</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InquiryPackageDetailPage;
