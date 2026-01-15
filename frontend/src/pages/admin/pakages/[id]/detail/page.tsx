// src/pages/admin/packages/[id]/detail/page.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import TourDetailPage from '@/components/shared/TourDetailPage';

const AdminTourDetailPage: React.FC = () => {
   const { id } = useParams<{ id: string }>();

   // For admin page, show admin view and include deleted tours
   return <TourDetailPage id={id} isAdmin={true} includeDeleted={true} />;
};

export default AdminTourDetailPage;