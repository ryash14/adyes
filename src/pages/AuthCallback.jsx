import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';
import LoadingState from '../components/LoadingState';

export default function AuthCallback() {
 const navigate = useNavigate();

 useEffect(() => {
 const handleCallback = async () => {
 try {
 const { data: { session }, error } = await supabase.auth.getSession();
 if (error) throw error;

 if (session) {
 const { data: profile, error: profileError } = await supabase
 .from('users')
 .select('is_profile_complete')
 .eq('id', session.user.id)
 .single();

 if (profileError) {
 navigate('/setup');
 return;
 }

 navigate(profile?.is_profile_complete ? '/dashboard' : '/setup');
 } else {
 navigate('/login');
 }
 } catch (error) {
 console.error('Auth callback error:', error);
 toast.error('Authentication failed');
 navigate('/login');
 }
 };

 handleCallback();
 }, [navigate]);

 return (
 <div className="min-h-screen flex items-center justify-center bg-background">
 <div className="w-full max-w-md p-8 text-center space-y-6 animate-fade-in">
 <LoadingState text="Completing sign in..." />
 </div>
 </div>
 );
}
