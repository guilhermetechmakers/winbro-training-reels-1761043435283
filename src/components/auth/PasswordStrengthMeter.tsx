import { Progress } from '@/components/ui/progress';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
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

  if (!password) return null;

  return (
    <div className={`space-y-2 ${className}`}>
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
      
      {/* Password Requirements */}
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
    </div>
  );
}