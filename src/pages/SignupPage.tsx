import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginSignupPage } from './LoginSignupPage';

export function SignupPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the combined login/signup page
    navigate('/signup', { replace: true });
  }, [navigate]);

  return <LoginSignupPage />;
}
