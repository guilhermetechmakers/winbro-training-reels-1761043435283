import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmailVerification } from '@/hooks/useAuth';
import { ArrowLeft, Mail, CheckCircle, XCircle } from 'lucide-react';

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [countdown, setCountdown] = useState(60);
  
  const verifyEmail = useEmailVerification();

  useEffect(() => {
    if (token) {
      handleVerification();
    }
  }, [token]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerification = async () => {
    try {
      await verifyEmail.mutateAsync({ token: token! });
      setVerificationStatus('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setVerificationStatus('error');
    }
  };

  const handleResend = async () => {
    // TODO: Implement resend verification
    setCountdown(60);
  };

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-winbro-gray to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-elevation-300 text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-winbro-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-winbro-success" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Email Verified!</CardTitle>
              <CardDescription>
                Your email has been successfully verified. Redirecting to dashboard...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-winbro-teal mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-winbro-gray to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-elevation-300 text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-winbro-error/10 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-winbro-error" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Verification Failed</CardTitle>
              <CardDescription>
                The verification link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleResend}
                className="w-full bg-winbro-teal hover:bg-winbro-teal/90"
              >
                Resend Verification Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-winbro-gray to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-winbro-teal mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>

        <Card className="shadow-elevation-300 text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-winbro-teal/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-winbro-teal" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Verify your email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Please check your email and click the verification link to activate your account.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={handleResend}
                disabled={countdown > 0}
                variant="outline"
                className="w-full"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Didn't receive the email? Check your spam folder or contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
