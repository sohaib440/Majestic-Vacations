import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TourForm from '@/components/tour/admin/TourForm';
import { useGetTourById, useUpdateTour } from '@/features/tourPackageApi';
import { UpdateTourPackageDto } from '@/types/tour-package';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';

const EditTourPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: tourResponse, isLoading, error } = useGetTourById(id || '');
  const updateTour = useUpdateTour();

  const tour = tourResponse?.data?.tour;

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tour package',
        variant: 'destructive',
      });
      navigate('/admin/packages');
    }
  }, [error, navigate]);

  // UPDATED: Match TourForm's onSubmit interface
  const handleSubmit = async ({
    tourData,
    images,
    highlightMedia
  }: {
    tourData: UpdateTourPackageDto;
    images: File[];
    highlightMedia: { file: File; index: number }[]
  }) => {
    if (!id) return;

    try {
      await updateTour.mutateAsync({
        id,
        tourData,
        images: images, // Now passing array
        highlightMedia: highlightMedia
      });

      toast({
        title: 'Success',
        description: 'Tour package updated successfully',
      });
      navigate(-1);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update tour package',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!tour) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Tour package not found</div>
        <Button onClick={() => navigate('/admin/packages')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Tour Package</h1>
          <p className="text-muted-foreground">
            Update "{tour.title}" details
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/packages')}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Tour Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TourForm
            initialData={tour}
            onSubmit={handleSubmit}
            isSubmitting={updateTour.isPending}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTourPage;