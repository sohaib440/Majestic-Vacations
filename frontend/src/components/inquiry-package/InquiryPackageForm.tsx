import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CreatePackageInquiryDto, PackageInquiry, MediaItem } from '@/features/packageInquiryApi';

const baseUrl = import.meta.env.VITE_API_URL;

const inquiryPackageSchema = z.object({
  packageName: z.string().min(3, 'Package name must be at least 3 characters').max(200),
  packageDescription: z.string().max(2000).optional(),
  location: z.string().optional(),
  packageAveragePrice: z.number().min(0).optional(),
});

type InquiryPackageFormValues = z.infer<typeof inquiryPackageSchema>;

interface InquiryPackageFormProps {
  initialData?: PackageInquiry;
  onSubmit: (data: {
    inquiryData: CreatePackageInquiryDto;
    media: File[];
  }) => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

const InquiryPackageForm: React.FC<InquiryPackageFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  mode = 'create',
}) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<{ file: File; preview: string; type: string }[]>([]);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>(initialData?.media || []);

  const form = useForm<InquiryPackageFormValues>({
    resolver: zodResolver(inquiryPackageSchema),
    defaultValues: {
      packageName: initialData?.packageName || '',
      packageDescription: initialData?.packageDescription || '',
      location: initialData?.location || '',
      packageAveragePrice: initialData?.packageAveragePrice || 0,
    },
  });

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMediaFiles = Array.from(files);

    // Validate total media count
    const totalMedia = mediaPreviews.length + existingMedia.length + newMediaFiles.length;
    if (totalMedia > 10) {
      toast({
        title: 'Limit Exceeded',
        description: 'Maximum 10 media files allowed',
        variant: 'destructive',
      });
      return;
    }

    // Create previews
    newMediaFiles.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        toast({
          title: 'Invalid File',
          description: `Only images and videos are allowed. Received ${file.type}`,
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaPreviews((prev) => [
          ...prev,
          {
            file,
            preview: event.target?.result as string,
            type: isVideo ? 'video' : 'image',
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    setMediaFiles((prev) => [...prev, ...newMediaFiles]);
  };

  const removeNewMedia = (index: number) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = (index: number) => {
    setExistingMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: InquiryPackageFormValues) => {
    const inquiryData: CreatePackageInquiryDto = {
      packageName: values.packageName,
      packageDescription: values.packageDescription,
      location: values.location,
      packageAveragePrice: values.packageAveragePrice,
    };

    onSubmit({
      inquiryData,
      media: mediaFiles,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Package Name */}
        <FormField
          control={form.control}
          name="packageName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter inquiry package name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Package Description */}
        <FormField
          control={form.control}
          name="packageDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter package description (optional)"
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormDescription>Maximum 2000 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Average Price */}
        <FormField
          control={form.control}
          name="packageAveragePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Average Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter average price (optional)"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Media Upload */}
        <div className="space-y-4">
          <FormLabel>Media (Images & Videos)</FormLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="hidden"
              id="media-input"
              disabled={
                mediaPreviews.length + existingMedia.length >= 10 ||
                isSubmitting
              }
            />
            <label
              htmlFor="media-input"
              className="flex items-center justify-center cursor-pointer"
            >
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF, MP4, WebM up to 50MB
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {mediaPreviews.length + existingMedia.length}/10 files
                </p>
              </div>
            </label>
          </div>

          {/* Existing Media */}
          {existingMedia.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Existing Media</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {existingMedia.map((media, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative group rounded-lg overflow-hidden bg-gray-100"
                  >
                    {media.type === 'video' ? (
                      <div className="aspect-square flex items-center justify-center bg-gray-200">
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={`${baseUrl}/${media.url}`}
                        alt="existing-media"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingMedia(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Media Previews */}
          {mediaPreviews.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">New Media</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaPreviews.map((media, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative group rounded-lg overflow-hidden bg-gray-100"
                  >
                    {media.type === 'video' ? (
                      <video
                        src={media.preview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={media.preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeNewMedia(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
            ? 'Create Inquiry Package'
            : 'Update Inquiry Package'}
        </Button>
      </form>
    </Form>
  );
};

export default InquiryPackageForm;
