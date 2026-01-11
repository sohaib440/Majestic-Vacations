// src/types/index.ts
export interface User {
   id: string;
   userName: string;
   userEmail: string;
   userRole: string;
   userPermissions: string[];
   contactNumber: string | null;
   isActive: boolean;
   createdAt: string;
   updatedAt: string;

   // Aliases for compatibility
   name?: string;
   role?: string;
   email?: string;
   permissions?: string[];
}

export interface LoginCredentials {
   userEmail: string;
   userPassword: string;
}

export interface LoginResponse {
   token: string;
   user: Omit<User, 'password' | 'loginAttempts' | 'lockUntil'>;
}

export interface ApiResponse<T = any> {
   success: boolean;
   data?: T;
   message?: string;
   error?: string;
}

export interface AuthState {
   user: User | null;
   token: string | null;
   isLoading: boolean;
   isAuthenticated: boolean;
   error: string | null;
}