import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TourForm from '@/components/tour/admin/TourForm';
import { useGetTourById, useUpdateTour } from '@/features/tourPackageApi';
import { UpdateTourPackageDto } from '@/types/tour-package';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const EditTourPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // For admin edit page, include deleted tours
  const { data: tourResponse, isLoading, error, isError } = useGetTourById(id || '', true);
  const updateTour = useUpdateTour();

  const tour = tourResponse?.data?.tour;
  const apiError = tourResponse?.message;

  useEffect(() => {
    if (isError || apiError) {
      toast({
        title: 'Error',
        description: error?.message || apiError || 'Failed to load tour package',
        variant: 'destructive',
      });
    }
  }, [isError, apiError, error]);

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
        images,
        highlightMedia,
      });

      toast({
        title: 'Success',
        description: 'Tour package updated successfully',
      });
      navigate('/admin/packages');
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

  // Show error message if tour not found
  if (apiError === 'Tour not found' || isError || !tour) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Tour Package</h1>
            <p className="text-muted-foreground">Tour not found</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/packages')}>
            Go Back
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Tour Not Found</AlertTitle>
          <AlertDescription>
            The tour with ID "{id}" could not be found. It may have been deleted or the ID is incorrect.
          </AlertDescription>
        </Alert>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/admin/packages')}>
            View All Packages
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/packages/create')}>
            Create New Package
          </Button>
        </div>
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

      {tour.isDeleted && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>This tour is deleted</AlertTitle>
          <AlertDescription>
            This tour is marked as deleted and hidden from public view.
            You can restore it by setting it to active.
          </AlertDescription>
        </Alert>
      )}

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