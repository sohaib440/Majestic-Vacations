// src/features/authApi.ts
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, LoginCredentials, LoginResponse, ApiResponse } from '@/types';

// Direct API functions
export const loginAPI = async (data: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getMeAPI = async (): Promise<ApiResponse<User>> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: loginAPI,
    onSuccess: (data) => {
      const { token, user } = data;

      // Store token
      localStorage.setItem('token', token);

      // Transform user data
      const transformedUser: User = {
        ...user,
        name: user.userName,
        role: user.userRole,
        email: user.userEmail,
        permissions: user.userPermissions || [],
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.userName,
        email: user.userEmail,
        role: user.userRole
      }));

      // Update query cache
      queryClient.setQueryData(['user'], transformedUser);

      return transformedUser;
    },
    onError: (error) => {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  });
};

// Update the useGetMe hook in authApi.ts
export const useGetMe = (options?: Partial<UseQueryOptions<User, Error>>) => {
  const queryClient = useQueryClient();

  // Check if we have a token in localStorage
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');

  // Also check if token is valid (not expired)
  const isTokenValid = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Simple check - you could decode JWT to check expiration
      // For now, just check if it exists
      return !!token;
    } catch {
      return false;
    }
  };

  const isEnabled = hasToken && isTokenValid();

  return useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: async (): Promise<User> => {
      try {
        const response = await getMeAPI();

        if (!response.success || !response.data) {
          throw new Error(response.message || 'No user data received');
        }

        const userData = response.data;

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          name: userData.userName,
          email: userData.userEmail,
          role: userData.userRole
        }));

        // Transform to User type
        return {
          ...userData,
          name: userData.userName,
          role: userData.userRole,
          email: userData.userEmail,
          permissions: userData.userPermissions || [],
          contactNumber: userData.contactNumber || null,
        };
      } catch (error) {
        // Clear token on auth errors
        if ((error as any).response?.status === 401 || (error as any).response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          queryClient.setQueryData(['user'], null);
        }
        throw error;
      }
    },
    retry: false,
    enabled: isEnabled && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
    queryClient.removeQueries();
    queryClient.invalidateQueries();
  };
};