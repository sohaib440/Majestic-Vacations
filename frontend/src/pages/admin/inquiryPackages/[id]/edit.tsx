import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InquiryPackageForm from '@/components/inquiry-package/InquiryPackageForm';
import { useGetPackageInquiryById, useUpdatePackageInquiry } from '@/features/packageInquiryApi';
import { CreatePackageInquiryDto } from '@/features/packageInquiryApi';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';

const EditInquiryPackagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: packageInquiry, isLoading, error } = useGetPackageInquiryById(id || '');
  const updateInquiry = useUpdatePackageInquiry();

  const handleSubmit = async ({
    inquiryData,
    media,
  }: {
    inquiryData: CreatePackageInquiryDto;
    media: File[];
  }) => {
    if (!inquiryData.packageName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Package name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!id) return;

    try {
      await updateInquiry.mutateAsync({
        id,
        inquiryData,
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

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Inquiry Package</h1>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Inquiry Package</h1>
          <p className="text-muted-foreground">
            Update the inquiry package details, images, and videos
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
          {packageInquiry && (
            <InquiryPackageForm
              initialData={packageInquiry}
              onSubmit={handleSubmit}
              isSubmitting={updateInquiry.isPending}
              mode="edit"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditInquiryPackagePage;
