// src/protectedRoute.tsx
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
   children: ReactNode;
   allowedRoles?: string[];
   requireAuth?: boolean;
   redirectTo?: string;
}

export default function ProtectedRoute({
   children,
   allowedRoles = [],
   requireAuth = true,
   redirectTo = '/'
}: ProtectedRouteProps) {
   const { user, isLoading, isAuthenticated, hasToken } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      if (!isLoading) {
         // If no token, redirect to homepage
         if (!hasToken) {
            navigate('/');
            return;
         }

         // If requireAuth but not authenticated, redirect
         if (requireAuth && !isAuthenticated) {
            navigate(redirectTo);
            return;
         }

         // Check roles if specified
         if (isAuthenticated && user && allowedRoles.length > 0) {
            const userRole = user?.role || user?.userRole;
            if (!allowedRoles.includes(userRole)) {
               navigate('/');
            }
         }
      }
   }, [user, isLoading, isAuthenticated, hasToken, navigate, allowedRoles, requireAuth, redirectTo]);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center space-y-4">
               <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-gray-600">Loading...</p>
            </div>
         </div>
      );
   }

   // If no token, don't render anything (will redirect)
   if (!hasToken) {
      return null;
   }

   // If requireAuth but not authenticated, don't render
   if (requireAuth && !isAuthenticated) {
      return null;
   }

   // Check roles
   if (isAuthenticated && allowedRoles.length > 0 && user) {
      const userRole = user?.role || user?.userRole;
      if (!allowedRoles.includes(userRole)) {
         return null;
      }
   }

   return <>{children}</>;
}