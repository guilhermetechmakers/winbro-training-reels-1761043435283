import { api } from '@/lib/api';
import type { AuthResponse, SignInInput, SignUpInput, PasswordResetRequest, PasswordResetConfirm, EmailVerification } from '@/types/auth';

export const authApi = {
  // Sign in with email and password
  signIn: async (credentials: SignInInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store auth tokens
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  // Sign up with email and password
  signUp: async (credentials: SignUpInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    
    // Optionally store token on signup
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await api.post('/auth/logout', {});
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  // Reset password - send reset email
  resetPassword: async (data: PasswordResetRequest): Promise<void> => {
    await api.post('/auth/forgot-password', data);
  },

  // Update password with reset token
  updatePassword: async (data: PasswordResetConfirm): Promise<void> => {
    await api.post('/auth/reset-password', data);
  },

  // Refresh auth token
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken });
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (data: EmailVerification): Promise<void> => {
    await api.post('/auth/verify-email', data);
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
