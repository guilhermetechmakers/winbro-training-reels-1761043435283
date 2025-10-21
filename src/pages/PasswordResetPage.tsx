import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePasswordReset, usePasswordResetConfirm } from '@/hooks/useAuth';
import { ArrowLeft, Mail } from 'lucide-react';

const resetRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetConfirmSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type ResetRequestForm = z.infer<typeof resetRequestSchema>;
type ResetConfirmForm = z.infer<typeof resetConfirmSchema>;

export function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [emailSent, setEmailSent] = useState(false);
  
  const resetPassword = usePasswordReset();
  const resetPasswordConfirm = usePasswordResetConfirm();

  const requestForm = useForm<ResetRequestForm>({
    resolver: zodResolver(resetRequestSchema),
  });

  const confirmForm = useForm<ResetConfirmForm>({
    resolver: zodResolver(resetConfirmSchema),
  });

  const onRequestSubmit = async (data: ResetRequestForm) => {
    try {
      await resetPassword.mutateAsync(data);
      setEmailSent(true);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const onConfirmSubmit = async (data: ResetConfirmForm) => {
    try {
      await resetPasswordConfirm.mutateAsync({
        token: token!,
        password: data.password,
        confirm_password: data.confirm_password,
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-winbro-gray to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-winbro-teal mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>

          <Card className="shadow-elevation-300 text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-winbro-success/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-winbro-success" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Check your email</CardTitle>
              <CardDescription>
                We've sent password reset instructions to your email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                If you don't see the email in your inbox, check your spam folder.
              </p>
              <Button 
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-winbro-gray to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-winbro-teal mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>

          <Card className="shadow-elevation-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-winbro-teal">Reset your password</CardTitle>
              <CardDescription>
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={confirmForm.handleSubmit(onConfirmSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your new password"
                    {...confirmForm.register('password')}
                    className={confirmForm.formState.errors.password ? 'border-winbro-error' : ''}
                  />
                  {confirmForm.formState.errors.password && (
                    <p className="text-sm text-winbro-error">
                      {confirmForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirm your new password"
                    {...confirmForm.register('confirm_password')}
                    className={confirmForm.formState.errors.confirm_password ? 'border-winbro-error' : ''}
                  />
                  {confirmForm.formState.errors.confirm_password && (
                    <p className="text-sm text-winbro-error">
                      {confirmForm.formState.errors.confirm_password.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-winbro-teal hover:bg-winbro-teal/90"
                  disabled={confirmForm.formState.isSubmitting}
                >
                  {confirmForm.formState.isSubmitting ? 'Updating password...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-winbro-gray to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-winbro-teal mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>

        <Card className="shadow-elevation-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-winbro-teal">Forgot your password?</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...requestForm.register('email')}
                  className={requestForm.formState.errors.email ? 'border-winbro-error' : ''}
                />
                {requestForm.formState.errors.email && (
                  <p className="text-sm text-winbro-error">
                    {requestForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-winbro-teal hover:bg-winbro-teal/90"
                disabled={requestForm.formState.isSubmitting}
              >
                {requestForm.formState.isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
