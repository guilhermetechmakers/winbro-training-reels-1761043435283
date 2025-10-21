import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

interface TermsCheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  error?: string;
  className?: string;
}

export function TermsCheckbox({ 
  id = 'terms_accepted', 
  checked, 
  onCheckedChange, 
  error,
  className 
}: TermsCheckboxProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-start space-x-3">
        <Checkbox 
          id={id} 
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="mt-1 transition-all duration-300 hover:scale-110"
        />
        <Label htmlFor={id} className="text-sm leading-relaxed cursor-pointer">
          I agree to the{' '}
          <Link to="/terms" className="text-winbro-teal hover:underline font-medium transition-colors duration-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-winbro-teal hover:underline font-medium transition-colors duration-300">
            Privacy Policy
          </Link>
        </Label>
      </div>
      {error && (
        <p className="text-sm text-winbro-error animate-fade-in-down">{error}</p>
      )}
    </div>
  );
}