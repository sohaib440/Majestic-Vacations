import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InquiryPackageForm from '@/components/inquiry-package/InquiryPackageForm';
import { useCreatePackageInquiry } from '@/features/packageInquiryApi';
import { CreatePackageInquiryDto } from '@/features/packageInquiryApi';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ArrowLeft } from 'lucide-react';

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
        description: 'Your inquiry has been submitted successfully!',
      });
      navigate('/inquiry-packages');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create inquiry. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/vacation-rentals')}
              className="rounded-full hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Create Vacation Rental Inquiry
              </h1>
              <p className="text-muted-foreground mt-2">
                Share details about your perfect vacation rental or B&B property
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <CardTitle className="text-2xl">Tell Us About Your Property</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Fill out the form below with details about your vacation rental or B&B. Include photos and videos to showcase your property.
              </p>
            </CardHeader>
            <CardContent className="pt-8">
              <InquiryPackageForm
                onSubmit={handleSubmit}
                isSubmitting={createInquiry.isPending}
                mode="create"
              />
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-900 mb-2">✓ Property Details</h3>
                <p className="text-sm text-blue-800">Include property name, location, and description</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-green-900 mb-2">✓ Pricing Information</h3>
                <p className="text-sm text-green-800">Provide average price per night</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-purple-900 mb-2">✓ Media Files</h3>
                <p className="text-sm text-purple-800">Add photos and videos of your property</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateInquiryPackagePage;
