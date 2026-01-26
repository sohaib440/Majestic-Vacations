import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, X } from 'lucide-react';
import { useGetTestimonialById, useUpdateTestimonial } from '@/features/testimonialApi';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

const EditTestimonialPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: testimonial, isLoading } = useGetTestimonialById(id);
  const { mutate: updateTestimonial } = useUpdateTestimonial();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    rating: 5,
    company: '',
    destination: '',
    tripType: '',
    travelerLocation: { city: '', country: '' },
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        content: testimonial.content,
        rating: testimonial.rating || 5,
        company: testimonial.company || '',
        destination: testimonial.destination || '',
        tripType: testimonial.tripType || '',
        travelerLocation: testimonial.travelerLocation || { city: '', country: '' },
      });
    }
  }, [testimonial]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      travelerLocation: {
        ...prev.travelerLocation,
        [name]: value,
      },
    }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    setNewMediaFiles((prev) => [...prev, ...files]);
  };

  const removeNewMedia = (index: number) => {
    setNewMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Name and content are required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const form = new FormData();
    form.append('name', formData.name);
    form.append('content', formData.content);
    form.append('rating', formData.rating.toString());
    form.append('company', formData.company);
    form.append('destination', formData.destination);
    form.append('tripType', formData.tripType);
    form.append('travelerLocation', JSON.stringify(formData.travelerLocation));

    newMediaFiles.forEach((file) => {
      form.append('media', file);
    });

    updateTestimonial(
      { id: id!, formData: form },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Testimonial updated successfully',
          });
          navigate('/admin/testimonial');
          setIsSubmitting(false);
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
          toast({
            title: 'Error',
            description: error?.response?.data?.message || 'Failed to update testimonial',
            variant: 'destructive',
          });
          setIsSubmitting(false);
        },
      }
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (!testimonial) return <div className="text-center py-8">Testimonial not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/admin/testimonial')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Testimonial</h1>
          <p className="text-muted-foreground">Update customer testimonial</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Rating Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Name *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Rating</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Testimonial Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="What did the customer say?"
                rows={5}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500">
                {formData.content.length} / 1000 characters
              </p>
            </div>

            {/* Company and Destination Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Company</label>
                <Input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company name (optional)"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Destination</label>
                <Input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Where they traveled (optional)"
                />
              </div>
            </div>

            {/* Trip Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Trip Type</label>
                <Input
                  type="text"
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleInputChange}
                  placeholder="E.g., Honeymoon, Family, Adventure (optional)"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">City</label>
                <Input
                  type="text"
                  name="city"
                  value={formData.travelerLocation.city}
                  onChange={handleLocationChange}
                  placeholder="Traveler city (optional)"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Country</label>
                <Input
                  type="text"
                  name="country"
                  value={formData.travelerLocation.country}
                  onChange={handleLocationChange}
                  placeholder="Traveler country (optional)"
                />
              </div>
            </div>

            {/* Existing Media */}
            {testimonial.media && testimonial.media.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Current Media ({testimonial.media.length})
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {testimonial.media.map((media, idx) => (
                    <div key={idx} className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedMediaIndex(idx)}
                        className="w-full cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Media ${idx}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                        ) : (
                          <div className="relative w-full h-24 bg-black rounded-lg border border-gray-300 overflow-hidden">
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="white"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Media Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Add New Media Files</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">Click to upload media</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Images & Videos (Max 50MB per file)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* New Media Preview */}
            {newMediaFiles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  New Files ({newMediaFiles.length})
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {newMediaFiles.map((file, idx) => (
                    <div key={idx} className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedMediaIndex(-(idx + 1))}
                        className="w-full h-24 cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                        ) : (
                          <div className="relative w-full h-24 bg-black rounded-lg border border-gray-300 overflow-hidden">
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="white"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeNewMedia(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-medium"
              >
                {isSubmitting ? 'Updating...' : 'Update Testimonial'}
              </Button>
              <Button
                type="button"
                onClick={() => navigate('/admin/testimonial')}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Media Lightbox Modal */}
      {selectedMediaIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            {selectedMediaIndex >= 0 ? (
              // Existing media
              testimonial.media?.[selectedMediaIndex]?.type === 'image' ? (
                <img
                  src={testimonial.media[selectedMediaIndex].url}
                  alt="Full view"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={testimonial.media?.[selectedMediaIndex]?.url}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  controls
                  autoPlay
                />
              )
            ) : (
              // New media
              newMediaFiles[-(selectedMediaIndex + 1)].type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(newMediaFiles[-(selectedMediaIndex + 1)])}
                  alt="Full view"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={URL.createObjectURL(newMediaFiles[-(selectedMediaIndex + 1)])}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  controls
                  autoPlay
                />
              )
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedMediaIndex(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTestimonialPage;
