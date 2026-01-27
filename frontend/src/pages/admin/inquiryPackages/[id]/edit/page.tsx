import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InquiryPackageForm from '@/components/inquiry-package/InquiryPackageForm';
import {
  useUpdatePackageInquiry,
  useGetPackageInquiryById,
  CreatePackageInquiryDto,
} from '@/features/packageInquiryApi';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';

const EditInquiryPackagePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const updateInquiry = useUpdatePackageInquiry();
  const { data: inquiryData, isLoading } = useGetPackageInquiryById(id || '');

  const handleSubmit = async ({
    inquiryData: formData,
    media,
  }: {
    inquiryData: CreatePackageInquiryDto;
    media: File[];
  }) => {
    if (!formData.packageName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Package name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!id) {
      toast({
        title: 'Error',
        description: 'Package ID not found',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateInquiry.mutateAsync({
        id,
        inquiryData: formData,
        media,
      });
      toast({
        title: 'Success',
        description: 'Inquiry package updated successfully',
      });
      navigate('/admin/inquiry-packages');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update inquiry package',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (!inquiryData) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Inquiry Package</h1>
          <p className="text-muted-foreground">
            Update inquiry package details, images, and videos
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/inquiry-packages')}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InquiryPackageForm
            initialData={inquiryData}
            onSubmit={handleSubmit}
            isSubmitting={updateInquiry.isPending}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditInquiryPackagePage;
