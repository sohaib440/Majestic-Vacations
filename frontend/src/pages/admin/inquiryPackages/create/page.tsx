import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InquiryPackageForm from '@/components/inquiry-package/InquiryPackageForm';
import { useCreatePackageInquiry } from '@/features/packageInquiryApi';
import { CreatePackageInquiryDto } from '@/features/packageInquiryApi';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const CreateInquiryPackagePage: React.FC = () => {
  const navigate = useNavigate();
  const createInquiry = useCreatePackageInquiry();

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

    try {
      await createInquiry.mutateAsync({ inquiryData, media });
      toast({
        title: 'Success',
        description: 'Inquiry package created successfully',
      });
      navigate('/admin/inquiry-packages');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create inquiry package',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Inquiry Package</h1>
          <p className="text-muted-foreground">
            Add a new inquiry package with images and videos
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
            onSubmit={handleSubmit}
            isSubmitting={createInquiry.isPending}
            mode="create"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateInquiryPackagePage;
