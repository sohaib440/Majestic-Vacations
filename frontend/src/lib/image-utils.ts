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

   const baseUrl = import.meta.env.VITE_API_URL;

   // Ensure imagePath doesn't start with a slash to avoid double slashes
   const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

   // Properly construct the URL
   return `${baseUrl}/${cleanPath}`;
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