import { useState } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  remember_me?: boolean;
}

interface EmailPasswordFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  className?: string;
}

export function EmailPasswordForm({ 
  register, 
  errors, 
  showRememberMe = true,
  showForgotPassword = true,
  className 
}: EmailPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className={`transition-all duration-300 focus:ring-2 focus:ring-winbro-teal/20 focus:border-winbro-teal ${
            errors.email ? 'border-winbro-error focus:ring-winbro-error/20' : 'border-border'
          }`}
        />
        {errors.email && (
          <p className="text-sm text-winbro-error animate-fade-in-down">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...register('password')}
            className={`transition-all duration-300 focus:ring-2 focus:ring-winbro-teal/20 focus:border-winbro-teal pr-10 ${
              errors.password ? 'border-winbro-error focus:ring-winbro-error/20' : 'border-border'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 hover:scale-110"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-winbro-error animate-fade-in-down">{errors.password.message}</p>
        )}
      </div>

      {showRememberMe && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="remember_me" 
              {...register('remember_me')}
              className="transition-all duration-300 hover:scale-110"
            />
            <Label htmlFor="remember_me" className="text-sm font-medium cursor-pointer">
              Remember me
            </Label>
          </div>
          {showForgotPassword && (
            <a 
              href="/password-reset" 
              className="text-sm text-winbro-teal hover:underline font-medium transition-colors duration-300 hover:text-winbro-teal/80"
            >
              Forgot password?
            </a>
          )}
        </div>
      )}
    </div>
  );
}