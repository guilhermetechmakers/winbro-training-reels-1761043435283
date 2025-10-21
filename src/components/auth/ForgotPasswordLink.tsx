import { Link } from 'react-router-dom';

interface ForgotPasswordLinkProps {
  className?: string;
}

export function ForgotPasswordLink({ className }: ForgotPasswordLinkProps) {
  return (
    <Link 
      to="/password-reset" 
      className={`text-sm text-winbro-teal hover:underline ${className}`}
    >
      Forgot password?
    </Link>
  );
}