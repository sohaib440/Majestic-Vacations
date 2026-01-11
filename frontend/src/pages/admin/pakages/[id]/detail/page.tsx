// src/pages/admin/packages/[id]/detail/page.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import TourDetailPage from '@/components/shared/TourDetailPage';

const AdminTourDetailPage: React.FC = () => {
   const { id } = useParams<{ id: string }>();

   // For admin page, show admin view
   return <TourDetailPage id={id} isAdmin={true} isPublic={false} />;
};

export default AdminTourDetailPage;