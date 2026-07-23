import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingState from '../components/LoadingState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, profile, loading, verifyMagicLink } = useAuth();
  const [promptEmail, setPromptEmail] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEmailLink = async () => {
      // If we already have a user from a previous session, redirect them.
      if (!loading && user) {
        if (profile?.isProfileComplete) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/setup', { replace: true });
        }
        return;
      }

      // Check if we are here via a Magic Link
      const url = window.location.href;
      
      // Firebase checks if this URL is a sign-in link
      // We will assume it is if the 'apiKey' and 'oobCode' are present
      if (url.includes('apiKey=') && url.includes('oobCode=')) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // If the user clicked the link on a different device, we don't know their email.
          setPromptEmail(true);
          setVerifying(false);
          return;
        }

        // We have the email, proceed to verify
        const result = await verifyMagicLink(email, url);
        if (result.error) {
          setError(result.error);
          setVerifying(false);
        }
        // If successful, onAuthStateChanged in AuthContext will update user and redirect will happen
      } else {
        // Not a magic link, just redirect to login if no user
        if (!loading && !user) {
          navigate('/login', { replace: true });
        }
      }
    };

    handleEmailLink();
  }, [user, profile, loading, navigate, verifyMagicLink]);

  const handleManualEmailSubmit = async (e) => {
    e.preventDefault();
    setPromptEmail(false);
    setVerifying(true);
    setError('');

    const url = window.location.href;
    const result = await verifyMagicLink(emailInput, url);
    if (result.error) {
      setError(result.error);
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 text-center space-y-6 animate-fade-in">
        {verifying && <LoadingState text="Verifying secure link..." />}
        
        {promptEmail && (
          <form onSubmit={handleManualEmailSubmit} className="space-y-4">
            <h3 className="text-xl font-bold">Please confirm your email</h3>
            <p className="text-sm text-muted-foreground">
              You opened this link on a different device or browser. Please re-enter your email to confirm.
            </p>
            <Input 
              type="email" 
              placeholder="name@example.com" 
              value={emailInput} 
              onChange={(e) => setEmailInput(e.target.value)} 
              required 
            />
            <Button type="submit" variant="primary" className="w-full">
              Confirm & Sign In
            </Button>
          </form>
        )}

        {error && (
          <div className="space-y-4">
            <div className="text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-sm font-semibold">
              {error}
            </div>
            <Button variant="secondary" className="w-full" onClick={() => navigate('/login')}>
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
