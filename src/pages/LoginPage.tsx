import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginSignupPage } from './LoginSignupPage';

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the combined login/signup page
    navigate('/login', { replace: true });
  }, [navigate]);

  return <LoginSignupPage />;
}
