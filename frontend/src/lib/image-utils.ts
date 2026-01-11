// src/lib/image-utils.ts
export const getImageUrl = (imagePath: string): string => {
   if (!imagePath) {
      return '/placeholder.svg';
   }

   // Check if it's already a full URL
   if (imagePath.startsWith('http')) {
      return imagePath;
   }

   // Check if it's a base64 data URL
   if (imagePath.startsWith('data:')) {
      return imagePath;
   }

   // For local uploads
   const baseUrl = import.meta.env.VITE_API_URL;

   // Determine path based on URL structure
   if (imagePath.includes('tour-packages')) {
      return `${baseUrl}${imagePath}`;
   } else if (imagePath.includes('tour-highlights')) {
      return `${baseUrl}${imagePath}`;
   } else {
      // Default path
      return `${baseUrl}/${imagePath}`;
   }
};

export const getTourImageUrl = (imagePath: string): string => {
   return getImageUrl(imagePath);
};

export const getHighlightMediaUrl = (mediaPath: string): string => {
   return getImageUrl(mediaPath);
};

export const getAvatarUrl = (imagePath: string): string => {
   return getImageUrl(`avatars/${imagePath}`);
};