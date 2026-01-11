// src/pages/admin/packages/create/page.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TourForm from '@/components/tour/admin/TourForm';
import { useCreateTour } from '@/features/tourPackageApi';
import { CreateTourPackageDto } from '@/types/tour-package';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const CreateTourPage: React.FC = () => {
  const navigate = useNavigate();
  const createTour = useCreateTour();

  // src/pages/admin/packages/create/page.tsx
  const handleSubmit = async ({
    tourData,
    images,
    highlightMedia
  }: {
    tourData: CreateTourPackageDto;
    images: File[];
    highlightMedia: { file: File; index: number }[]
  }) => {
    if (images.length === 0) {
      toast({
        title: 'Images Required',
        description: 'Please upload at least one tour image',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createTour.mutateAsync({ tourData, images, highlightMedia });
      toast({ title: 'Success', description: 'Tour package created successfully' });
      navigate(-1);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create tour', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Tour Package</h1>
          <p className="text-muted-foreground">Add a new spiritual journey for travelers</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/packages')}>Cancel</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Tour Details</CardTitle></CardHeader>
        <CardContent>
          <TourForm onSubmit={handleSubmit} isSubmitting={createTour.isPending} mode="create" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTourPage;