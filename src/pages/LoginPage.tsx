import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSignIn } from '@/hooks/useAuth';
import { Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember_me: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const signIn = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn.mutateAsync(data);
      navigate('/dashboard');
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
            <CardTitle className="text-2xl font-bold text-winbro-teal">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your Winbro account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register('email')}
                      className={errors.email ? 'border-winbro-error' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-winbro-error">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        {...register('password')}
                        className={errors.password ? 'border-winbro-error pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-winbro-error">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember_me" 
                        {...register('remember_me')}
                      />
                      <Label htmlFor="remember_me" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Link 
                      to="/password-reset" 
                      className="text-sm text-winbro-teal hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-winbro-teal hover:bg-winbro-teal/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
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

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSSOLogin('google')}
                    className="w-full"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSSOLogin('saml')}
                    className="w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    SSO
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Don't have an account yet?
                  </p>
                  <Link to="/signup">
                    <Button className="w-full bg-winbro-teal hover:bg-winbro-teal/90">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
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
