import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingState from '../components/LoadingState';

export default function AuthCallback() {
 const navigate = useNavigate();
 const { user, profile, loading } = useAuth();

 useEffect(() => {
 // With popup-based auth, this page is rarely hit.
 // But if the user lands here, redirect them appropriately.
 if (loading) return;

 if (user) {
 if (profile?.isProfileComplete) {
 navigate('/dashboard', { replace: true });
 } else {
 navigate('/setup', { replace: true });
 }
 } else {
 navigate('/login', { replace: true });
 }
 }, [user, profile, loading, navigate]);

 return (
 <div className="min-h-screen flex items-center justify-center bg-background">
 <div className="w-full max-w-md p-8 text-center space-y-6 animate-fade-in">
 <LoadingState text="Completing sign in..." />
 </div>
 </div>
 );
}
