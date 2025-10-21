import { supabase } from '@/lib/supabase';
import type { AuthResponse, SignInInput, SignUpInput, PasswordResetRequest, PasswordResetConfirm, EmailVerification, User } from '@/types/auth';

export const authApi = {
  // Sign in with email and password
  signIn: async (credentials: SignInInput): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Authentication failed');
    }

    // Update last login
    await supabase.rpc('update_last_login', { user_id: data.user.id });

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      throw new Error('Failed to fetch user profile');
    }

    return {
      user: userProfile as User,
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  },

  // Sign up with email and password
  signUp: async (credentials: SignUpInput): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.full_name,
          organization_name: credentials.organization_name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Sign up failed');
    }

    // Update user profile with additional data
    const { error: updateError } = await supabase
      .from('users')
      .update({
        full_name: credentials.full_name,
        role: 'learner', // Default role
      })
      .eq('id', data.user.id);

    if (updateError) {
      console.warn('Failed to update user profile:', updateError);
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      throw new Error('Failed to fetch user profile');
    }

    return {
      user: userProfile as User,
      token: data.session?.access_token || '',
      refresh_token: data.session?.refresh_token || '',
    };
  },

  // Sign out
  signOut: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  // Reset password - send reset email
  resetPassword: async (data: PasswordResetRequest): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/password-reset`,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  // Update password with reset token
  updatePassword: async (data: PasswordResetConfirm): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  // Verify email with token
  verifyEmail: async (data: EmailVerification): Promise<void> => {
    const { error } = await supabase.auth.verifyOtp({
      token: data.token,
      type: 'email',
      email: '', // This will be extracted from the token
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error('Not authenticated');
    }

    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw new Error('Failed to fetch user profile');
    }

    return userProfile as User;
  },

  // SSO Sign in with Google
  signInWithGoogle: async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  // SSO Sign in with SAML
  signInWithSAML: async (organizationId: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google', // Use Google as fallback since SAML might not be available
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          organization_id: organizationId,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  },
};
