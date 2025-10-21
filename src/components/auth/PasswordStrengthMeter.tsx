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
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Password strength:</span>
        <span className={`font-semibold transition-colors duration-300 ${
          passwordStrength < 40 ? 'text-winbro-error' :
          passwordStrength < 80 ? 'text-winbro-amber' :
          'text-winbro-success'
        }`}>
          {getPasswordStrengthText(passwordStrength)}
        </span>
      </div>
      
      {/* Enhanced progress bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${getPasswordStrengthColor(passwordStrength)}`}
            style={{ width: `${passwordStrength}%` }}
          />
        </div>
        {/* Glow effect */}
        <div 
          className={`absolute top-0 h-2 rounded-full opacity-30 blur-sm transition-all duration-500 ${getPasswordStrengthColor(passwordStrength)}`}
          style={{ width: `${passwordStrength}%` }}
        />
      </div>
      
      {/* Enhanced Password Requirements */}
      <div className="space-y-2">
        {passwordRequirements.map((req, index) => (
          <div 
            key={index} 
            className={`flex items-center text-sm transition-all duration-300 ${
              req.met ? 'animate-fade-in-up' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`p-0.5 rounded-full transition-all duration-300 ${
              req.met ? 'bg-winbro-success/10' : 'bg-winbro-error/10'
            }`}>
              {req.met ? (
                <Check className="h-3 w-3 text-winbro-success" />
              ) : (
                <X className="h-3 w-3 text-winbro-error" />
              )}
            </div>
            <span className={`ml-2 transition-colors duration-300 ${
              req.met ? 'text-winbro-success font-medium' : 'text-muted-foreground'
            }`}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}