import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmailPasswordForm } from '@/components/auth/EmailPasswordForm';
import { SSOButtons } from '@/components/auth/SSOButtons';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { TermsCheckbox } from '@/components/auth/TermsCheckbox';
import { useSignIn, useSignUp } from '@/hooks/useAuth';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

// Login form schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember_me: z.boolean().optional(),
});

// Signup form schema
const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirm_password: z.string(),
  organization_name: z.string().optional(),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export function LoginSignupPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useSignIn();
  const signUp = useSignUp();
  const { user } = useAuth();

  // Set active tab based on route
  useEffect(() => {
    if (location.pathname === '/signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Signup form
  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const password = signupForm.watch('password', '');

  const onLoginSubmit = async (data: LoginForm) => {
    try {
      await signIn.mutateAsync(data);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const onSignupSubmit = async (data: SignupForm) => {
    try {
      await signUp.mutateAsync(data);
      navigate('/email-verification');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleSSOLogin = (provider: string) => {
    // TODO: Implement SSO login
    console.log(`SSO login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-winbro-gray to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-winbro-teal mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <Card className="shadow-elevation-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-winbro-teal">
              {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'login' 
                ? 'Sign in to your Winbro account to continue'
                : 'Get started with Winbro and transform your training'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <div className="grid w-full grid-cols-2 bg-muted p-1 rounded-md">
                <button
                  onClick={() => {
                    setActiveTab('login');
                    navigate('/login', { replace: true });
                  }}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === 'login' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab('signup');
                    navigate('/signup', { replace: true });
                  }}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    activeTab === 'signup' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {activeTab === 'login' && (
                <div className="space-y-4 mt-4">
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <EmailPasswordForm 
                      register={loginForm.register}
                      errors={loginForm.formState.errors}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-winbro-teal hover:bg-winbro-teal/90"
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>

                  {/* SSO Options */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <SSOButtons 
                    onGoogleSignIn={() => handleSSOLogin('google')}
                    onSAMLSignIn={() => handleSSOLogin('saml')}
                  />
                </div>
              )}

              {activeTab === 'signup' && (
                <div className="space-y-4 mt-4">
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="Enter your full name"
                        {...signupForm.register('full_name')}
                        className={signupForm.formState.errors.full_name ? 'border-winbro-error' : ''}
                      />
                      {signupForm.formState.errors.full_name && (
                        <p className="text-sm text-winbro-error">{signupForm.formState.errors.full_name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...signupForm.register('email')}
                        className={signupForm.formState.errors.email ? 'border-winbro-error' : ''}
                      />
                      {signupForm.formState.errors.email && (
                        <p className="text-sm text-winbro-error">{signupForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization_name">Organization (Optional)</Label>
                      <Input
                        id="organization_name"
                        type="text"
                        placeholder="Enter your organization name"
                        {...signupForm.register('organization_name')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        {...signupForm.register('password')}
                        className={signupForm.formState.errors.password ? 'border-winbro-error' : ''}
                      />
                      
                      <PasswordStrengthMeter password={password} />
                      
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-winbro-error">{signupForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm Password</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        placeholder="Confirm your password"
                        {...signupForm.register('confirm_password')}
                        className={signupForm.formState.errors.confirm_password ? 'border-winbro-error' : ''}
                      />
                      {signupForm.formState.errors.confirm_password && (
                        <p className="text-sm text-winbro-error">{signupForm.formState.errors.confirm_password.message}</p>
                      )}
                    </div>

                    <TermsCheckbox 
                      checked={signupForm.watch('terms_accepted')}
                      onCheckedChange={(checked) => signupForm.setValue('terms_accepted', checked)}
                      error={signupForm.formState.errors.terms_accepted?.message}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-winbro-teal hover:bg-winbro-teal/90"
                      disabled={signupForm.formState.isSubmitting}
                    >
                      {signupForm.formState.isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <button 
                        onClick={() => setActiveTab('login')}
                        className="text-winbro-teal hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Terms and Privacy */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-winbro-teal hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-winbro-teal hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}