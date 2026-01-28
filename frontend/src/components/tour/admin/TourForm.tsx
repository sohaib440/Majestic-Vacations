// src/components/tour/admin/TourForm.tsx
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Upload, Video, Image as ImageIcon } from "lucide-react";
import {
  CreateTourPackageDto,
  TourPackage,
  HighlightItem,
  PriceTier,
} from "@/types/tour-package";
import { toast } from "@/hooks/use-toast";
import { getTourImageUrl } from "@/lib/image-utils";

const baseUrl = import.meta.env.VITE_API_URL;

// Define price tier types
const PRICE_TIER_TYPES = [
  { id: "infant", label: "Infant", ageRange: "0-2 years", description: "Ages 0 to 2 years" },
  { id: "child", label: "Child", ageRange: "2-12 years", description: "Ages 2 to 12 years" },
  { id: "adult", label: "Adult", ageRange: "12+ years", description: "Ages 12 and above" },
] as const;

type PriceTierType = typeof PRICE_TIER_TYPES[number]['id'];

// Updated schema
const tourSchema = z.object({
  title: z.string().min(5).max(80),
  destination: z.string().min(3),
  country: z.enum(["Dubai", "Greece", "Indonesia", "Turkey", "Thailand"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  duration: z.string().min(1),
  remaining_seats: z.number().min(0, "Remaining seats cannot be negative"),

  priceTiers: z
    .array(
      z.object({
        type: z.enum(["infant", "child", "adult"]),
        ageGroup: z.string().min(1, "Age group is required"),
        ageRange: z.string().min(1, "Age range is required"),
        price: z.number().min(0, "Price is required"),
      })
    )
    .refine(
      (tiers) => {
        const types = tiers.map(tier => tier.type);
        // Check if all three required types are present
        return ["infant", "child", "adult"].every(type => types.includes(type as PriceTierType));
      },
      {
        message: "All three price tiers (Infant, Child, Adult) are required",
      }
    )
    .refine(
      (tiers) => {
        const uniqueTypes = new Set(tiers.map(tier => tier.type));
        return uniqueTypes.size === tiers.length;
      },
      {
        message: "Duplicate price tiers are not allowed",
      }
    ),
  rating: z.number().min(1).max(5).optional(),
  highlights: z
    .array(
      z.object({
        text: z.string().min(1, "Highlight text is required"),
        media: z.string().nullable().optional(),
        mediaType: z.enum(["image", "video"]).nullable().optional(),
      })
    )
    .default([]),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

type TourFormValues = z.infer<typeof tourSchema>;

interface TourFormProps {
  initialData?: TourPackage | Partial<TourPackage>;
  onSubmit: (data: {
    tourData: TourFormValues;
    images: File[];
    highlightMedia: { file: File; index: number }[];
  }) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const TourForm: React.FC<TourFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<HighlightItem[]>(
    initialData?.highlights || []
  );
  const [selectedTierTypes, setSelectedTierTypes] = useState<Set<PriceTierType>>(new Set());

  const [highlightMediaFiles, setHighlightMediaFiles] = useState<
    { file: File; index: number }[]
  >([]);
  const [highlightMediaPreviews, setHighlightMediaPreviews] = useState<
    Map<number, string>
  >(new Map());
  const [existingHighlightMedia, setExistingHighlightMedia] = useState<
    Map<number, { url: string; type: string }>
  >(new Map());

  // Initialize form with initial data
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: initialData?.title || "",
      destination: initialData?.destination || "",
      country: (initialData?.country as "Dubai") || "Dubai",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      duration: initialData?.duration || "",
      remaining_seats: initialData?.remaining_seats || 0,
      priceTiers: initialData?.priceTiers || [
        { type: "adult", ageGroup: "Adult", ageRange: "12+ years", price: 0 },
        { type: "child", ageGroup: "Child", ageRange: "2-12 years", price: 0 },
        { type: "infant", ageGroup: "Infant", ageRange: "0-2 years", price: 0 },
      ],
      rating: initialData?.rating || 4.8,
      highlights: initialData?.highlights || [],
      featured:
        initialData?.featured !== undefined ? initialData.featured : false,
      isActive: initialData?.isActive ?? true,
      isDeleted: initialData?.isDeleted || false,
    },
  });

  const {
    fields: priceTiersFields,
    append: appendPriceTier,
    remove: removePriceTier,
  } = useFieldArray({
    control: form.control,
    name: "priceTiers",
  });

  // Initialize selected tier types
  useEffect(() => {
    if (initialData?.priceTiers) {
      const types = new Set(initialData.priceTiers.map(tier => tier.type as PriceTierType));
      setSelectedTierTypes(types);
    } else {
      // Default to all three tiers selected
      setSelectedTierTypes(new Set(["infant", "child", "adult"]));
    }
  }, [initialData]);

  // Initialize images and highlights when initialData changes
  useEffect(() => {
    if (initialData?.images) {
      const images = initialData.images.map((img) => getTourImageUrl(img));
      setExistingImages(images);
    }

    // Initialize highlight media previews
    if (initialData?.highlights) {
      const mediaMap = new Map<number, { url: string; type: string }>();
      initialData.highlights.forEach((highlight, index) => {
        if (highlight.media && highlight.mediaType) {
          const mediaUrl = highlight.media.startsWith("http")
            ? highlight.media
            : getTourImageUrl(highlight.media);
          mediaMap.set(index, {
            url: mediaUrl,
            type: highlight.mediaType,
          });
        }
      });
      setExistingHighlightMedia(mediaMap);
    }
  }, [initialData]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);

    // Create previews for new files
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number, isNewImage: boolean = true) => {
    if (isNewImage) {
      // Remove from new image files
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));

      // Revoke object URL
      if (imagePreviews[index]) {
        URL.revokeObjectURL(imagePreviews[index]);
      }
    } else {
      // Remove from existing images
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addHighlight = () => {
    const newHighlight: HighlightItem = {
      text: "",
      media: null,
      mediaType: null,
    };
    const newHighlights = [...highlights, newHighlight];
    setHighlights(newHighlights);
    form.setValue("highlights", newHighlights);
  };

  const updateHighlight = (
    index: number,
    field: keyof HighlightItem,
    value: any
  ) => {
    const newHighlights = [...highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setHighlights(newHighlights);
    form.setValue("highlights", newHighlights);
  };

  const removeHighlight = (index: number) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(newHighlights);
    form.setValue("highlights", newHighlights);

    // Remove associated media file if exists
    setHighlightMediaFiles((prev) => prev.filter((m) => m.index !== index));

    // Remove preview if exists
    const preview = highlightMediaPreviews.get(index);
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setHighlightMediaPreviews((prev) => {
      const newMap = new Map(prev);
      newMap.delete(index);
      return newMap;
    });

    // Remove existing media reference
    setExistingHighlightMedia((prev) => {
      const newMap = new Map(prev);
      newMap.delete(index);
      return newMap;
    });
  };

  const handleHighlightMediaChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mediaType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : null;

    if (!mediaType) {
      toast({
        title: "Invalid file",
        description: "Please select an image or video file",
        variant: "destructive",
      });
      return;
    }

    // Add to files list
    setHighlightMediaFiles((prev) => {
      // Remove existing entry for this index if any
      const filtered = prev.filter((m) => m.index !== index);
      return [...filtered, { file, index }];
    });

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setHighlightMediaPreviews((prev) => {
      const newMap = new Map(prev);
      newMap.set(index, previewUrl);
      return newMap;
    });

    // Clear existing media preview for this index
    setExistingHighlightMedia((prev) => {
      const newMap = new Map(prev);
      newMap.delete(index);
      return newMap;
    });

    // Update highlight data
    updateHighlight(index, "mediaType", mediaType);
  };

  const handleAddPriceTier = (tierType: PriceTierType) => {
    const tierConfig = PRICE_TIER_TYPES.find(tier => tier.id === tierType);
    if (!tierConfig || selectedTierTypes.has(tierType)) return;

    appendPriceTier({
      type: tierType,
      ageGroup: tierConfig.label,
      ageRange: tierConfig.ageRange,
      price: 0,
    });
    setSelectedTierTypes(prev => new Set([...prev, tierType]));
  };

  const handleRemovePriceTier = (index: number, tierType: PriceTierType) => {
    removePriceTier(index);
    setSelectedTierTypes(prev => {
      const newSet = new Set(prev);
      newSet.delete(tierType);
      return newSet;
    });
  };

  const getAvailableTiers = () => {
    return PRICE_TIER_TYPES.filter(tier => !selectedTierTypes.has(tier.id));
  };

  const handleSubmit = (data: TourFormValues) => {
    console.log("Form data before submit:", data);
    
    // Ensure all three tiers are present
    if (data.priceTiers.length !== 3) {
      toast({
        title: "Price Tiers Required",
        description: "All three price tiers (Infant, Child, Adult) are required",
        variant: "destructive",
      });
      return;
    }

    if (mode === "create" && imageFiles.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one tour image",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      tourData: data,
      images: imageFiles,
      highlightMedia: highlightMediaFiles,
    });
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      highlightMediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews, highlightMediaPreviews]);

  // Sync form with initialData when it changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || "",
        destination: initialData.destination || "",
        country: initialData.country || "Dubai",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        duration: initialData.duration || "",
        remaining_seats: initialData.remaining_seats || 0,
        priceTiers: initialData.priceTiers || [
          { type: "adult", ageGroup: "Adult", ageRange: "12+ years", price: 0 },
          { type: "child", ageGroup: "Child", ageRange: "2-12 years", price: 0 },
          { type: "infant", ageGroup: "Infant", ageRange: "0-2 years", price: 0 },
        ],
        rating: initialData.rating || 4.8,
        highlights: initialData.highlights || [],
        featured: initialData.featured !== undefined ? initialData.featured : false,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        isDeleted: initialData.isDeleted || false,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the main details of your tour package
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bali Spiritual Journey" {...field} />
                    </FormControl>
                    <FormDescription>5-80 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bali, Indonesia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>When does this tour start?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>When does this tour end?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 7 Days / 6 Nights" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remaining_seats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remaining Seats *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Set prices for all three required age groups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Display existing price tiers */}
            {priceTiersFields.map((field, index) => {
              const tierConfig = PRICE_TIER_TYPES.find(t => t.id === field.type);
              return (
                <div
                  key={field.id}
                  className="flex items-center gap-4 p-4 border rounded-md"
                >
                  <div className="flex-1">
                    <div className="font-medium">{tierConfig?.label}</div>
                    <div className="text-sm text-gray-500">{tierConfig?.description}</div>
                    <div className="text-xs text-gray-400 mt-1">Age: {tierConfig?.ageRange}</div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`priceTiers.${index}.price`}
                    render={({ field: priceField }) => (
                      <FormItem className="w-48">
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...priceField}
                            onChange={(e) =>
                              priceField.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Only show remove button if we have more than 3 tiers (shouldn't happen) */}
                  {priceTiersFields.length > 3 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemovePriceTier(index, field.type as PriceTierType)}
                      className="mt-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}

            {/* Add tier dropdown (only shows if not all tiers are added) */}
            {getAvailableTiers().length > 0 && (
              <div className="flex items-center gap-4">
                <Select onValueChange={(value) => handleAddPriceTier(value as PriceTierType)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Add price tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTiers().map((tier) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        {tier.label} ({tier.ageRange})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" onClick={() => {
                  // Add all missing tiers
                  getAvailableTiers().forEach(tier => handleAddPriceTier(tier.id));
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add All Missing Tiers
                </Button>
              </div>
            )}

            {/* Show warning if not all tiers are present */}
            {selectedTierTypes.size < 3 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="text-yellow-600 font-medium">
                    {3 - selectedTierTypes.size} price tier(s) missing
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Required
                  </Badge>
                </div>
                <p className="text-sm text-yellow-600 mt-1">
                  All three price tiers (Infant, Child, Adult) are required for this tour.
                </p>
                <div className="flex gap-2 mt-2">
                  {PRICE_TIER_TYPES.map(tier => (
                    <Badge 
                      key={tier.id}
                      variant={selectedTierTypes.has(tier.id) ? "default" : "outline"}
                      className={selectedTierTypes.has(tier.id) ? "bg-green-100 text-green-800" : ""}
                    >
                      {tier.label}
                      {selectedTierTypes.has(tier.id) ? " ✓" : ""}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Show success message when all tiers are present */}
            {selectedTierTypes.size === 3 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="text-green-600 font-medium">
                    All price tiers are configured
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Complete
                  </Badge>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  All required price tiers are present. You can update prices as needed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Tour Images</CardTitle>
            <CardDescription>
              Upload multiple images for this tour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="images">Add New Images</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="cursor-pointer mt-2"
                />
              </div>

              {/* Show new image previews */}
              {imagePreviews.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">New Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={preview}
                          alt={`New preview ${index + 1}`}
                          className="h-40 w-full object-cover rounded-lg border"
                          onError={(e) =>
                            (e.currentTarget.src = "/placeholder.svg")
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show existing images in edit mode */}
              {mode === "edit" && existingImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Existing Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((img, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={img}
                          alt={`Existing image ${index + 1}`}
                          className="h-40 w-full object-cover rounded-lg border"
                          onError={(e) =>
                            (e.currentTarget.src = "/placeholder.svg")
                          }
                        />
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            Existing
                          </Badge>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index, false)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mode === "create" && imagePreviews.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">No images uploaded yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Upload at least one image for your tour
                  </p>
                </div>
              )}

              {mode === "edit" &&
                imagePreviews.length === 0 &&
                existingImages.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">No images available</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Add new images or this tour won't have any images
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
            <CardDescription>
              Add key highlights with optional images/videos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {highlights.map((highlight, index) => {
              const existingMedia = existingHighlightMedia.get(index);
              const newMediaPreview = highlightMediaPreviews.get(index);

              return (
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
                      onChange={(e) =>
                        updateHighlight(index, "text", e.target.value)
                      }
                    />

                    <div className="space-y-2">
                      <Label>Add Media (Optional)</Label>
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => handleHighlightMediaChange(index, e)}
                        className="cursor-pointer"
                      />

                      {/* Show existing media if available */}
                      {existingMedia && !newMediaPreview && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">
                              Existing {existingMedia.type}
                            </Badge>
                          </div>
                          {existingMedia.type === "image" ? (
                            <img
                              src={existingMedia.url}
                              alt={`Existing highlight ${index + 1}`}
                              className="h-32 w-full object-cover rounded-lg"
                              onError={(e) =>
                                (e.currentTarget.src = "/placeholder.svg")
                              }
                            />
                          ) : (
                            <video
                              src={existingMedia.url}
                              className="h-32 w-full object-cover rounded-lg"
                              controls
                            >
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      )}

                      {/* Show new media preview if available */}
                      {newMediaPreview && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default">New Upload</Badge>
                          </div>
                          {highlight.mediaType === "image" ? (
                            <img
                              src={newMediaPreview}
                              alt="Preview"
                              className="h-32 w-full object-cover rounded-lg"
                            />
                          ) : (
                            <video
                              src={newMediaPreview}
                              className="h-32 w-full object-cover rounded-lg"
                              controls
                            >
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <Button type="button" onClick={addHighlight} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Highlight
            </Button>

            {highlights.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No highlights added yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add highlights to showcase the best features of your tour
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>Featured Tour</FormLabel>
                    <FormDescription>
                      Show prominently on homepage
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      {field.value
                        ? "Tour is visible to users"
                        : "Tour is hidden from users"}
                    </FormDescription>
                    {initialData?.isDeleted && (
                      <div className="text-sm text-red-500 mt-1">
                        ⚠️ Tour is currently marked as deleted
                      </div>
                    )}
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting || 
              (mode === "create" && imageFiles.length === 0) ||
              selectedTierTypes.size < 3
            }
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
              ? "Create Tour Package"
              : "Update Tour Package"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TourForm;