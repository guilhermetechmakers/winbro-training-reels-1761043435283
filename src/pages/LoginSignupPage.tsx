import { useState, useEffect, useRef } from 'react';
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
import { ArrowLeft, Sparkles, Shield, Users, Zap } from 'lucide-react';

// Skeleton component for loading states
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`animate-pulse rounded-md bg-muted ${className || ''}`}
    {...props}
  />
);

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useSignIn();
  const signUp = useSignUp();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div ref={containerRef} className="min-h-screen relative overflow-hidden group">
      {/* Custom cursor effect */}
      <div 
        className="fixed top-0 left-0 w-6 h-6 bg-winbro-teal/20 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 12}px, ${mousePosition.y - 12}px)`,
          opacity: mousePosition.x > 0 ? 1 : 0
        }}
      />
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-winbro-amber rounded-full pointer-events-none z-50 transition-all duration-200 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 4}px, ${mousePosition.y - 4}px)`,
          opacity: mousePosition.x > 0 ? 1 : 0
        }}
      />
      {/* Animated gradient background with parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-winbro-teal/5 via-winbro-amber/5 to-winbro-slate/5 animate-pulse"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
        }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-winbro-teal/10 to-transparent animate-pulse delay-1000"
        style={{
          transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`
        }}
      />
      
      {/* Floating geometric shapes with parallax */}
      <div 
        className="absolute top-20 left-10 w-20 h-20 bg-winbro-teal/10 rounded-full animate-bounce delay-300"
        style={{
          transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px)`
        }}
      />
      <div 
        className="absolute top-40 right-20 w-16 h-16 bg-winbro-amber/10 rounded-full animate-bounce delay-700"
        style={{
          transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      />
      <div 
        className="absolute bottom-32 left-1/4 w-12 h-12 bg-winbro-slate/10 rounded-full animate-bounce delay-1000"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px)`
        }}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Back to home link with animation */}
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-winbro-teal mb-8 transition-all duration-300 hover:translate-x-1 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to home
          </Link>

          <Card 
            className="shadow-elevation-300 border-0 bg-white/90 backdrop-blur-md animate-fade-in-up hover:shadow-elevation-300/50 transition-all duration-500 sm:rounded-2xl"
            role="main"
            aria-label="Authentication form"
          >
            <CardHeader className="text-center space-y-4 sm:space-y-6 px-6 sm:px-8 pt-8 sm:pt-10">
              {/* Animated icon */}
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-winbro-teal to-winbro-amber rounded-2xl flex items-center justify-center animate-bounce-in hover:scale-110 transition-transform duration-300">
                {activeTab === 'login' ? (
                  <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                ) : (
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                )}
              </div>
              
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-winbro-teal to-winbro-amber bg-clip-text text-transparent animate-fade-in-up delay-200">
                {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
              </CardTitle>
              <CardDescription className="text-base sm:text-lg animate-fade-in-up delay-300 leading-relaxed">
                {activeTab === 'login' 
                  ? 'Sign in to your Winbro account to continue your training journey'
                  : 'Join thousands of professionals transforming their training with Winbro'
                }
              </CardDescription>
              
              {/* Feature highlights */}
              <div className="flex justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-muted-foreground animate-fade-in-up delay-400">
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-winbro-amber" />
                  <span>Microlearning</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-winbro-teal" />
                  <span>Smart Search</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 px-6 sm:px-8 pb-8 sm:pb-10">
              <div className="w-full">
                {/* Enhanced tab switcher with slide indicator */}
                <div 
                  className="relative grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg border"
                  role="tablist"
                  aria-label="Authentication method selection"
                >
                  {/* Slide indicator */}
                  <div 
                    className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-md shadow-sm transition-transform duration-300 ease-out ${
                      activeTab === 'login' ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    aria-hidden="true"
                  />
                  
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      navigate('/login', { replace: true });
                    }}
                    className={`relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      activeTab === 'login' 
                        ? 'text-winbro-teal font-semibold' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    role="tab"
                    aria-selected={activeTab === 'login'}
                    aria-controls="login-panel"
                    id="login-tab"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('signup');
                      navigate('/signup', { replace: true });
                    }}
                    className={`relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      activeTab === 'signup' 
                        ? 'text-winbro-teal font-semibold' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    role="tab"
                    aria-selected={activeTab === 'signup'}
                    aria-controls="signup-panel"
                    id="signup-tab"
                  >
                    Sign Up
                  </button>
                </div>

                {activeTab === 'login' && (
                  <div 
                    className="space-y-6 mt-6 animate-fade-in-up delay-500"
                    role="tabpanel"
                    id="login-panel"
                    aria-labelledby="login-tab"
                  >
                    {loginForm.formState.isSubmitting ? (
                      <div className="space-y-6">
                        {/* Loading skeleton for form */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Skeleton className="h-4 w-4 rounded" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-12 w-full rounded-lg" />
                      </div>
                    ) : (
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                        <EmailPasswordForm 
                          register={loginForm.register}
                          errors={loginForm.formState.errors}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-winbro-teal to-winbro-teal/90 hover:from-winbro-teal/90 hover:to-winbro-teal text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loginForm.formState.isSubmitting}
                        >
                          {loginForm.formState.isSubmitting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Signing in...</span>
                            </div>
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </form>
                    )}

                    {/* Enhanced SSO Options */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase tracking-wider">
                        <span className="bg-white px-4 text-muted-foreground font-medium">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <SSOButtons 
                      onGoogleSignIn={() => handleSSOLogin('google')}
                      onSAMLSignIn={() => handleSSOLogin('saml')}
                      className="animate-fade-in-up delay-700"
                    />
                  </div>
                )}

                {activeTab === 'signup' && (
                  <div 
                    className="space-y-6 mt-6 animate-fade-in-up delay-500"
                    role="tabpanel"
                    id="signup-panel"
                    aria-labelledby="signup-tab"
                  >
                    {signupForm.formState.isSubmitting ? (
                      <div className="space-y-6">
                        {/* Loading skeleton for signup form */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-16 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="flex items-start space-x-2">
                            <Skeleton className="h-4 w-4 rounded mt-1" />
                            <Skeleton className="h-12 w-full" />
                          </div>
                        </div>
                        <Skeleton className="h-12 w-full rounded-lg" />
                      </div>
                    ) : (
                      <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="full_name" className="text-sm font-medium text-foreground">Full Name</Label>
                          <Input
                            id="full_name"
                            type="text"
                            placeholder="Enter your full name"
                            {...signupForm.register('full_name')}
                            className={`transition-all duration-300 focus:ring-2 focus:ring-winbro-teal/20 focus:border-winbro-teal ${
                              signupForm.formState.errors.full_name ? 'border-winbro-error focus:ring-winbro-error/20' : 'border-border'
                            }`}
                          />
                          {signupForm.formState.errors.full_name && (
                            <p className="text-sm text-winbro-error animate-fade-in-down">{signupForm.formState.errors.full_name.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...signupForm.register('email')}
                            className={`transition-all duration-300 focus:ring-2 focus:ring-winbro-teal/20 focus:border-winbro-teal ${
                              signupForm.formState.errors.email ? 'border-winbro-error focus:ring-winbro-error/20' : 'border-border'
                            }`}
                          />
                          {signupForm.formState.errors.email && (
                            <p className="text-sm text-winbro-error animate-fade-in-down">{signupForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="organization_name" className="text-sm font-medium text-foreground">Organization (Optional)</Label>
                          <Input
                            id="organization_name"
                            type="text"
                            placeholder="Enter your organization name"
                            {...signupForm.register('organization_name')}
                            className="transition-all duration-300 focus:ring-2 focus:ring-winbro-teal/20 focus:border-winbro-teal border-border"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            {...signupForm.register('password')}
                            className={`transition-all duration-300 focus:ring-2 focus:ring-winbro-teal/20 focus:border-winbro-teal ${
                              signupForm.formState.errors.password ? 'border-winbro-error focus:ring-winbro-error/20' : 'border-border'
                            }`}
                          />
                          
                          <PasswordStrengthMeter password={password} />
                          
                          {signupForm.formState.errors.password && (
                            <p className="text-sm text-winbro-error animate-fade-in-down">{signupForm.formState.errors.password.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm_password" className="text-sm font-medium text-foreground">Confirm Password</Label>
                          <Input
                            id="confirm_password"
                            type="password"
                            placeholder="Confirm your password"
                            {...signupForm.register('confirm_password')}
                            className={`transition-all duration-300 focus:ring-2 focus:ring-winbro-teal/20 focus:border-winbro-teal ${
                              signupForm.formState.errors.confirm_password ? 'border-winbro-error focus:ring-winbro-error/20' : 'border-border'
                            }`}
                          />
                          {signupForm.formState.errors.confirm_password && (
                            <p className="text-sm text-winbro-error animate-fade-in-down">{signupForm.formState.errors.confirm_password.message}</p>
                          )}
                        </div>

                        <TermsCheckbox 
                          checked={signupForm.watch('terms_accepted')}
                          onCheckedChange={(checked) => signupForm.setValue('terms_accepted', checked)}
                          error={signupForm.formState.errors.terms_accepted?.message}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-winbro-teal to-winbro-teal/90 hover:from-winbro-teal/90 hover:to-winbro-teal text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={signupForm.formState.isSubmitting}
                        >
                          {signupForm.formState.isSubmitting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Creating account...</span>
                            </div>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </form>
                    )}

                    <div className="text-center animate-fade-in-up delay-700">
                      <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <button 
                          onClick={() => setActiveTab('login')}
                          className="text-winbro-teal hover:underline font-medium transition-colors duration-300"
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

          {/* Enhanced Terms and Privacy */}
          <div className="text-center mt-8 animate-fade-in-up delay-800">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-winbro-teal hover:underline font-medium transition-colors duration-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-winbro-teal hover:underline font-medium transition-colors duration-300">
                Privacy Policy
              </Link>
            </p>
            
            {/* Trust indicators */}
            <div className="flex justify-center items-center space-x-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-winbro-success" />
                <span>Secure</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-winbro-info" />
                <span>Trusted by 10k+ users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}