// src/components/tour/admin/TourForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Upload, Video, Image as ImageIcon } from 'lucide-react';
import { CreateTourPackageDto, TourPackage, HighlightItem } from '@/types/tour-package';
import { toast } from '@/hooks/use-toast';
import { getTourImageUrl } from '@/lib/image-utils';

// Updated schema
const tourSchema = z.object({
  title: z.string().min(5).max(80),
  destination: z.string().min(3),
  country: z.enum(['Dubai', 'Greece', 'Indonesia', 'Turkey', 'Thailand']),
  startDate: z.string().min(1, 'Start date is required'), // Changed from date to startDate
  duration: z.string().min(1),
  groupSize: z.number().min(1),
  price: z.number().min(0),
  pricePerMonth: z.number().min(0, 'Monthly price is required'), // Added
  originalPrice: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
  highlights: z.array(
    z.object({
      text: z.string().min(1, 'Highlight text is required'),
      media: z.string().nullable().optional(),
      mediaType: z.enum(['image', 'video']).nullable().optional(),
    })
  ).default([]),
  featured: z.boolean().default(false),
});

type TourFormValues = z.infer<typeof tourSchema>;

interface TourFormProps {
  initialData?: TourPackage | Partial<TourPackage>;
  onSubmit: (data: {
    tourData: TourFormValues;
    images: File[];
    highlightMedia: { file: File; index: number }[]
  }) => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

const TourForm: React.FC<TourFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  mode = 'create',
}) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images?.map(img => getTourImageUrl(img)) || []);
  const [highlights, setHighlights] = useState<HighlightItem[]>(initialData?.highlights || []);
  const [highlightMediaFiles, setHighlightMediaFiles] = useState<{ file: File; index: number }[]>([]);
  const [highlightMediaPreviews, setHighlightMediaPreviews] = useState<Map<number, string>>(new Map());

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: initialData?.title || '',
      destination: initialData?.destination || '',
      country: (initialData?.country as 'Dubai') || 'Dubai',
      startDate: initialData?.startDate || '', // Changed from date
      duration: initialData?.duration || '',
      groupSize: initialData?.groupSize || 1,
      price: initialData?.price || 0,
      pricePerMonth: initialData?.pricePerMonth || 0, // Added
      originalPrice: initialData?.originalPrice,
      rating: initialData?.rating || 4.8,
      highlights: initialData?.highlights || [],
      featured: initialData?.featured || false,
    },
  });

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addHighlight = () => {
    const newHighlight: HighlightItem = { text: '', media: null, mediaType: null };
    setHighlights([...highlights, newHighlight]);
    form.setValue('highlights', [...highlights, newHighlight]);
  };

  const updateHighlight = (index: number, field: keyof HighlightItem, value: any) => {
    const newHighlights = [...highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setHighlights(newHighlights);
    form.setValue('highlights', newHighlights);
  };

  const removeHighlight = (index: number) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(newHighlights);
    form.setValue('highlights', newHighlights);

    // Remove associated media file if exists
    setHighlightMediaFiles(prev => prev.filter(m => m.index !== index));
    setHighlightMediaPreviews(prev => {
      const newMap = new Map(prev);
      newMap.delete(index);
      return newMap;
    });
  };

  const handleHighlightMediaChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mediaType = file.type.startsWith('image/') ? 'image' :
      file.type.startsWith('video/') ? 'video' : null;

    if (!mediaType) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image or video file',
        variant: 'destructive',
      });
      return;
    }

    // Add to files list
    setHighlightMediaFiles(prev => [...prev, { file, index }]);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setHighlightMediaPreviews(prev => new Map(prev).set(index, previewUrl));

    // Update highlight data
    updateHighlight(index, 'mediaType', mediaType);
  };

  const handleSubmit = (data: TourFormValues) => {
    if (mode === 'create' && imageFiles.length === 0) {
      toast({
        title: 'Images Required',
        description: 'Please upload at least one tour image',
        variant: 'destructive',
      });
      return;
    }

    if (!data.pricePerMonth || data.pricePerMonth <= 0) {
      toast({
        title: 'Monthly Price Required',
        description: 'Please enter a valid monthly payment price',
        variant: 'destructive',
      });
      return;
    }

    onSubmit({
      tourData: data,
      images: imageFiles,
      highlightMedia: highlightMediaFiles,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the main details of your tour package</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Title *</FormLabel>
                  <FormControl><Input placeholder="e.g., Bali Spiritual Journey" {...field} /></FormControl>
                  <FormDescription>5-80 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="destination" render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination *</FormLabel>
                  <FormControl><Input placeholder="e.g., Bali, Indonesia" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Greece">Greece</SelectItem>
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="Turkey">Turkey</SelectItem>
                      <SelectItem value="Thailand">Thailand</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormDescription>When does this tour start?</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="duration" render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration *</FormLabel>
                  <FormControl><Input placeholder="e.g., 7 Days / 6 Nights" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="groupSize" render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Size *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Price ($)*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="pricePerMonth" render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Payment ($)*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Payment plan price</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="originalPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="For discount display"
                      value={field.value || ''}
                      onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>Strikethrough if higher than current</FormDescription>
                </FormItem>
              )} />
            </div>

            {form.watch('price') > 0 && form.watch('pricePerMonth') > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Payment Plan Details:</h4>
                <p className="text-sm text-blue-700">
                  Monthly payment: ${form.watch('pricePerMonth').toFixed(2)}<br />
                  Total payments: {Math.ceil(form.watch('price') / form.watch('pricePerMonth'))} months<br />
                  Last payment: ${(form.watch('price') - (form.watch('pricePerMonth') * (Math.ceil(form.watch('price') / form.watch('pricePerMonth')) - 1))).toFixed(2)}
                </p>
              </div>
            )}

            <FormField control={form.control} name="rating" render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (1-5)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 4.8)}
                  />
                </FormControl>
                <FormDescription>Default: 4.8</FormDescription>
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Tour Images</CardTitle>
            <CardDescription>Upload multiple images for this tour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="cursor-pointer"
              />

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-40 w-full object-cover rounded-lg border"
                        onError={e => e.currentTarget.src = '/placeholder.svg'}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {mode === 'edit' && initialData?.images && initialData.images.length > 0 && !imagePreviews.some(p => p.includes('upload')) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {initialData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={getTourImageUrl(img)}
                        alt={`Existing ${index + 1}`}
                        className="h-40 w-full object-cover rounded-lg border"
                        onError={e => e.currentTarget.src = '/placeholder.svg'}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
            <CardDescription>Add key highlights with optional images/videos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {highlights.map((highlight, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Highlight #{index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="Enter highlight text"
                    value={highlight.text}
                    onChange={(e) => updateHighlight(index, 'text', e.target.value)}
                  />

                  <div className="space-y-2">
                    <Label>Add Media (Optional)</Label>
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleHighlightMediaChange(index, e)}
                      className="cursor-pointer"
                    />

                    {highlightMediaPreviews.get(index) && (
                      <div className="relative mt-2">
                        {highlight.mediaType === 'image' ? (
                          <img
                            src={highlightMediaPreviews.get(index)}
                            alt="Preview"
                            className="h-32 w-full object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={highlightMediaPreviews.get(index)}
                            className="h-32 w-full object-cover rounded-lg"
                            controls
                          />
                        )}
                      </div>
                    )}

                    {highlight.media && !highlightMediaPreviews.get(index) && (
                      <div className="mt-2 text-sm text-gray-500">
                        Media attached: {highlight.mediaType === 'image' ? 'Image' : 'Video'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" onClick={addHighlight} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Highlight
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
          <CardContent>
            <FormField control={form.control} name="featured" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <FormLabel>Featured Tour</FormLabel>
                  <FormDescription>Show prominently on homepage</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || (mode === 'create' && imageFiles.length === 0)}>
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Tour Package' : 'Update Tour Package'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TourForm;