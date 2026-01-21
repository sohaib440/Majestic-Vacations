// src/pages/tours/[id]/page.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import TourDetailPage from '@/components/shared/TourDetailPage';

const PublicTourPage: React.FC = () => {
   const { id } = useParams<{ id: string }>();

   // Get user from localStorage
   const getCurrentUser = () => {
      if (typeof window === 'undefined') return null;
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
   };

   const currentUser = getCurrentUser();
   const isUserAdmin = currentUser?.role === 'admin';

   // For public page, always show public view
   return <TourDetailPage id={id} isAdmin={false} includeDeleted={false} />;
};

export default PublicTourPage;