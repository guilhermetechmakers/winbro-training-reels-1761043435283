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
    <div className={`space-y-4 ${className}`}>
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

      {showRememberMe && (
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
          {showForgotPassword && (
            <a 
              href="/password-reset" 
              className="text-sm text-winbro-teal hover:underline"
            >
              Forgot password?
            </a>
          )}
        </div>
      )}
    </div>
  );
}