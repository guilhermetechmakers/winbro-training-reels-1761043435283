export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'trainer' | 'learner' | 'customer_admin' | 'reviewer';
  organization_id?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface SignInInput {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignUpInput {
  email: string;
  password: string;
  full_name: string;
  organization_name?: string;
  terms_accepted: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirm_password: string;
}

export interface EmailVerification {
  token: string;
}
