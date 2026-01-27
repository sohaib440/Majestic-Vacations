import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, X } from 'lucide-react';
import { useGetTestimonialById, useUpdateTestimonial, useDeleteTestimonialMedia } from '@/features/testimonialApi';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

const EditTestimonialPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: testimonial, isLoading, refetch } = useGetTestimonialById(id);
  const { mutate: updateTestimonial } = useUpdateTestimonial();
  const { mutate: deleteMedia } = useDeleteTestimonialMedia();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUserProfilePic, setNewUserProfilePic] = useState<File | null>(null);
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

  const handleNewUserProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewUserProfilePic(file);
    }
  };

  const removeNewUserProfilePic = () => {
    setNewUserProfilePic(null);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    setNewMediaFiles((prev) => [...prev, ...files]);
  };

  const removeNewMedia = (index: number) => {
    setNewMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingMedia = (mediaIndex: number) => {
    if (window.confirm('Are you sure you want to delete this media? This action cannot be undone.')) {
      deleteMedia(
        { id: id!, mediaIndex },
        {
          onSuccess: () => {
            toast({
              title: 'Success',
              description: 'Media deleted successfully',
            });
            refetch();
          },
          onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast({
              title: 'Error',
              description: error?.response?.data?.message || 'Failed to delete media',
              variant: 'destructive',
            });
          },
        }
      );
    }
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

    if (newUserProfilePic) {
      form.append('userProfilePic', newUserProfilePic);
    }

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
            {/* User Profile Picture Section - TOP */}
            <div className="flex flex-col items-center justify-center space-y-4 pb-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">User Profile Picture</h2>
              
              {/* Update Profile Picture */}
              <div className="space-y-4 w-full flex flex-col items-center">
                <p className="text-sm text-gray-600 text-center">
                  {testimonial.userProfilePic && !newUserProfilePic ? 'Current picture or upload new' : 'Upload profile picture'}
                </p>

                {/* Circular Upload Box with Image */}
                <div className="relative">
                  {newUserProfilePic ? (
                    // Show new uploaded image
                    <div className="relative w-40 h-40">
                      <img
                        src={URL.createObjectURL(newUserProfilePic)}
                        alt="New Profile Preview"
                        className="w-40 h-40 object-cover rounded-full border-4 border-green-400 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeNewUserProfilePic}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : testimonial.userProfilePic ? (
                    // Show current picture with upload option
                    <label className="flex items-center justify-center w-40 h-40 border-4 border-dashed border-blue-300 rounded-full cursor-pointer bg-blue-50 hover:bg-blue-100 transition group relative overflow-hidden">
                      <img
                        src={testimonial.userProfilePic}
                        alt="Current Profile"
                        className="absolute inset-0 w-full h-full object-cover rounded-full"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition">
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white mb-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          <p className="text-xs text-white text-center px-2">Click to update</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewUserProfilePicChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    // Show upload box when no image exists
                    <label className="flex items-center justify-center w-40 h-40 border-4 border-dashed border-blue-300 rounded-full cursor-pointer bg-blue-50 hover:bg-blue-100 transition group">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 text-blue-400 mb-2 group-hover:scale-110 transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <p className="text-xs text-gray-600 text-center px-4">Click to upload</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewUserProfilePicChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

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
                    <div key={idx} className="relative group">
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
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingMedia(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-3 w-3" />
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
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex-1"
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
