// src/hooks/useAuth.ts
import { useNavigate } from 'react-router-dom';
import { useGetMe, useLogout } from '@/features/authApi';
import { User } from '@/types';

export interface UseAuthReturn {
   user: User | null;
   isLoading: boolean;
   isAuthenticated: boolean;
   hasRole: (allowedRoles: string[]) => boolean;
   hasPermission: (permission: string) => boolean;
   error: Error | null;
   hasToken: boolean;
   isUnauthorized: boolean;
   logout: () => void;
   refetch: () => Promise<any>;
}

export const useAuth = (): UseAuthReturn => {
   const navigate = useNavigate();
   const {
      data: user,
      isLoading,
      error,
      isError,
      refetch,
      isFetching
   } = useGetMe();

   const logoutMutation = useLogout();

   const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;

   const isUnauthorized = isError && ((error as any)?.response?.status === 401);
   const isAuthenticated = !!user && !error && !isLoading && !isFetching && hasToken;

   const hasRole = (allowedRoles: string[] = []): boolean => {
      if (!user || !allowedRoles.length) return false;
      const userRole = user?.role || user?.userRole;
      return allowedRoles.includes(userRole);
   };

   const hasPermission = (permission: string): boolean => {
      if (!user) return false;
      const permissions = user?.permissions || user?.userPermissions || [];
      if (permissions.includes('all')) return true;
      return permissions.includes(permission);
   };

   const logout = () => {
      logoutMutation();
      navigate('/');
   };

   return {
      user: user || null,
      isLoading: isLoading || isFetching,
      isAuthenticated,
      hasRole,
      hasPermission,
      error,
      hasToken,
      isUnauthorized,
      logout,
      refetch
   };
};