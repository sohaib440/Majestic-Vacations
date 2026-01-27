import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllTestimonials,
  useDeleteTestimonial,
} from '@/features/testimonialApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash2, Search, Eye, Plus, MoreVertical, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

const TestimonialPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data: testimonials = [], isLoading, refetch } = useGetAllTestimonials();
  const { mutate: deleteTestimonial } = useDeleteTestimonial();

  // Function to get full media URL
  const getMediaUrl = (url) => {
    // If URL already starts with http, return as is (external URL)
    if (url.startsWith('http')) {
      return url;
    }
    
    // If URL starts with /uploads, prepend the API base URL
    // Adjust this based on your actual API base URL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  // Filter testimonials
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (testimonial.company?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    return matchesSearch;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      deleteTestimonial(id, {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Testimonial deleted successfully',
          });
          refetch();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to delete testimonial',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
        ★
      </span>
    ));
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">Manage all customer testimonials</p>
        </div>
        <Button onClick={() => navigate('/admin/testimonial/create')} className="bg-amber-700 hover:bg-amber-800 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, or content..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No testimonials found
                </TableCell>
              </TableRow>
            ) : (
              filteredTestimonials.map((testimonial) => (
                <TableRow key={testimonial._id}>
                  <TableCell>
                    <div className="font-medium">{testimonial.name}</div>
                    {testimonial.media && testimonial.media.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {testimonial.media.length} media file(s)
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{testimonial.company || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {testimonial.travelerLocation
                      ? `${testimonial.travelerLocation.city || ''}, ${testimonial.travelerLocation.country || ''}`.trim()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTestimonial(testimonial);
                            setShowModal(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/testimonial/${testimonial._id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(testimonial._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Modal */}
      {showModal && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            <CardHeader className="border-b shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedTestimonial.name}</CardTitle>
                  {selectedTestimonial.company && (
                    <p className="text-sm text-muted-foreground mt-1">{selectedTestimonial.company}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* User Profile Picture */}
              {selectedTestimonial.userProfilePic && (
                <div className="flex justify-center">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-3">User Profile Picture</h4>
                    <img
                      src={getMediaUrl(selectedTestimonial.userProfilePic)}
                      alt={`${selectedTestimonial.name}'s profile`}
                      className="w-32 h-32 object-cover rounded-full border-4 border-blue-400 shadow-lg mx-auto"
                      onError={(e) => {
                        console.error('Profile image failed to load:', getMediaUrl(selectedTestimonial.userProfilePic));
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/128?text=No+Image';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Rating */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Rating</h4>
                <div className="flex items-center gap-2">
                  {renderStars(selectedTestimonial.rating)}
                  <span className="text-gray-700 font-medium">{selectedTestimonial.rating}/5</span>
                </div>
              </div>

              {/* Testimonial Content */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Testimonial</h4>
                <p className="text-gray-700 leading-relaxed text-justify">
                  "{selectedTestimonial.content}"
                </p>
              </div>

              {/* Destination & Trip Type */}
              <div className="grid grid-cols-2 gap-6">
                {selectedTestimonial.destination && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Destination</h4>
                    <p className="text-gray-700">{selectedTestimonial.destination}</p>
                  </div>
                )}
                {selectedTestimonial.tripType && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Trip Type</h4>
                    <p className="text-gray-700">{selectedTestimonial.tripType}</p>
                  </div>
                )}
              </div>

              {/* Location */}
              {selectedTestimonial.travelerLocation && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Traveler Location</h4>
                  <p className="text-gray-700">
                    {selectedTestimonial.travelerLocation.city && selectedTestimonial.travelerLocation.country
                      ? `${selectedTestimonial.travelerLocation.city}, ${selectedTestimonial.travelerLocation.country}`
                      : selectedTestimonial.travelerLocation.city || selectedTestimonial.travelerLocation.country || '-'}
                  </p>
                </div>
              )}

              {/* Media Gallery */}
              {selectedTestimonial.media && selectedTestimonial.media.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Media Gallery ({selectedTestimonial.media.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedTestimonial.media.map((media, idx) => {
                      const mediaUrl = getMediaUrl(media.url);
                      
                      return (
                        <div key={idx} className="relative group cursor-pointer">
                          {media.type === 'image' ? (
                            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-video">
                              <img
                                src={mediaUrl}
                                alt={`Media ${idx + 1} for ${selectedTestimonial.name}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  console.error('Image failed to load:', mediaUrl);
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="relative overflow-hidden rounded-lg bg-black aspect-video flex items-center justify-center">
                              <video
                                src={mediaUrl}
                                className="w-full h-full object-cover"
                                controls
                                preload="metadata"
                                onError={(e) => {
                                  console.error('Video failed to load:', mediaUrl);
                                  e.target.onerror = null;
                                }}
                              >
                                <source src={mediaUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                                <svg
                                  className="w-10 h-10 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {media.type === 'image' ? 'Image' : 'Video'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="text-xs text-gray-500 pt-4 border-t">
                <p>Created: {new Date(selectedTestimonial.createdAt).toLocaleString()}</p>
                {selectedTestimonial.updatedAt && selectedTestimonial.updatedAt !== selectedTestimonial.createdAt && (
                  <p>Updated: {new Date(selectedTestimonial.updatedAt).toLocaleString()}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => navigate(`/admin/testimonial/${selectedTestimonial._id}/edit`)}
                  className="flex-1 bg-amber-700 hover:bg-amber-800 text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TestimonialPage;