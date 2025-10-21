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
import { Progress } from '@/components/ui/progress';
import { useSignUp } from '@/hooks/useAuth';
import { Eye, EyeOff, ArrowLeft, Check, X } from 'lucide-react';

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

type SignupForm = z.infer<typeof signupSchema>;

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const signUp = useSignUp();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');
  // const confirmPassword = watch('confirm_password', '');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 40) return 'bg-winbro-error';
    if (strength < 80) return 'bg-winbro-amber';
    return 'bg-winbro-success';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 40) return 'Weak';
    if (strength < 80) return 'Fair';
    return 'Strong';
  };

  const passwordStrength = getPasswordStrength(password);

  const passwordRequirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(password) },
    { text: 'One number', met: /[0-9]/.test(password) },
    { text: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: SignupForm) => {
    try {
      await signUp.mutateAsync(data);
      navigate('/email-verification');
    } catch (error) {
      // Error is handled by the mutation
    }
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
            <CardTitle className="text-2xl font-bold text-winbro-teal">Create your account</CardTitle>
            <CardDescription>
              Get started with Winbro and transform your training
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register('full_name')}
                  className={errors.full_name ? 'border-winbro-error' : ''}
                />
                {errors.full_name && (
                  <p className="text-sm text-winbro-error">{errors.full_name.message}</p>
                )}
              </div>

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
                <Label htmlFor="organization_name">Organization (Optional)</Label>
                <Input
                  id="organization_name"
                  type="text"
                  placeholder="Enter your organization name"
                  {...register('organization_name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Password strength:</span>
                      <span className={`font-medium ${
                        passwordStrength < 40 ? 'text-winbro-error' :
                        passwordStrength < 80 ? 'text-winbro-amber' :
                        'text-winbro-success'
                      }`}>
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <Progress 
                      value={passwordStrength} 
                      className="h-2"
                    />
                    <div className={`h-2 rounded-full ${getPasswordStrengthColor(passwordStrength)}`} 
                         style={{ width: `${passwordStrength}%` }} />
                  </div>
                )}

                {/* Password Requirements */}
                {password && (
                  <div className="space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center text-sm">
                        {req.met ? (
                          <Check className="h-4 w-4 text-winbro-success mr-2" />
                        ) : (
                          <X className="h-4 w-4 text-winbro-error mr-2" />
                        )}
                        <span className={req.met ? 'text-winbro-success' : 'text-muted-foreground'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-winbro-error">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...register('confirm_password')}
                    className={errors.confirm_password ? 'border-winbro-error pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-sm text-winbro-error">{errors.confirm_password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms_accepted" 
                    {...register('terms_accepted')}
                    className="mt-1"
                  />
                  <Label htmlFor="terms_accepted" className="text-sm leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-winbro-teal hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-winbro-teal hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.terms_accepted && (
                  <p className="text-sm text-winbro-error">{errors.terms_accepted.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-winbro-teal hover:bg-winbro-teal/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-winbro-teal hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
