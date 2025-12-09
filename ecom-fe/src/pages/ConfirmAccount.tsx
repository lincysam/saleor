import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { confirmAccountRequest } from '@/redux/auth/auth.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ConfirmAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [confirmed, setConfirmed] = useState(false);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (email && token && !attempted) {
      setAttempted(true);
      dispatch(confirmAccountRequest({ email, token }));
    }
  }, [searchParams, dispatch, attempted]);

  useEffect(() => {
    if (attempted && !loading && !error) {
      setConfirmed(true);
      // Auto-redirect after 3 seconds
      const timer = setTimeout(() => {
        navigate('/auth');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [attempted, loading, error, navigate]);

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl">Invalid Confirmation Link</CardTitle>
            <CardDescription>
              The confirmation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please request a new confirmation email or contact support if the problem persists.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/auth">Go to Login</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {loading && <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />}
          {!loading && error && <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />}
          {!loading && !error && confirmed && <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />}
          
          <CardTitle className="text-2xl">
            {loading && 'Confirming Your Account'}
            {!loading && error && 'Confirmation Failed'}
            {!loading && !error && confirmed && 'Account Confirmed!'}
          </CardTitle>
          
          <CardDescription>
            {loading && 'Please wait while we confirm your account...'}
            {!loading && error && 'We encountered an issue confirming your account.'}
            {!loading && !error && confirmed && 'Your account has been successfully confirmed!'}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && error && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Please try clicking the link again or request a new confirmation email.
              </p>
              <Button asChild className="w-full">
                <Link to="/auth">Go to Login</Link>
              </Button>
            </div>
          )}

          {!loading && !error && confirmed && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                You will be redirected to the login page shortly...
              </p>
              <Button asChild className="w-full">
                <Link to="/auth">Go to Login Now</Link>
              </Button>
            </div>
          )}

          {loading && (
            <p className="text-muted-foreground text-sm">
              This should only take a moment...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmAccount;