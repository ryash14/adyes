import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/public/AuthLayout';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const GoogleIcon = () => (
 <svg viewBox="0 0 24 24" width="18" height="18" className="mr-3">
 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
 </svg>
);

const GithubIcon = () => (
 <svg viewBox="0 0 24 24" width="18" height="18" className="mr-3 fill-current">
 <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
 </svg>
);

export default function LoginPage() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const { signInWithEmail, signInWithGoogle, signInWithGithub } = useAuth();
 const navigate = useNavigate();

 const handleEmailSignIn = async (e) => {
 e.preventDefault();
 setError('');

 if (!email || !password) {
 setError('Please fill in all fields');
 return;
 }

 setLoading(true);
 const result = await signInWithEmail(email, password);
 if (result.error) {
 setError(result.error);
 } else {
 navigate('/dashboard');
 }
 setLoading(false);
 };

 const handleProviderSignIn = async (providerFn) => {
 setError('');
 const result = await providerFn();
 if (result.error) {
 setError(result.error);
 } else {
 navigate('/dashboard');
 }
 };

 return (
 <AuthLayout
 eyebrow="Welcome back"
 title="Sign In"
 lead="Access your workspace."
 footer={
 <span>
 New to CollabHub?{' '}
 <Link to="/register" className="text-accent hover:underline font-bold transition-all">
 Create an account
 </Link>
 </span>
 }
 >
 {error && (
 <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20">
 <AlertCircle size={16} />
 <span>{error}</span>
 </div>
 )}

 {/* OAuth Buttons Top */}
 <div className="grid grid-cols-2 gap-3 mb-6">
 <Button
 type="button"
 variant="outline"
 onClick={() => handleProviderSignIn(signInWithGoogle)}
 className="w-full flex items-center justify-center bg-card text-foreground hover:bg-muted border-border shadow-sm transition-all h-12 rounded-xl"
 >
 <GoogleIcon />
 <span className="font-semibold text-sm">Google</span>
 </Button>
 <Button
 type="button"
 variant="outline"
 onClick={() => handleProviderSignIn(signInWithGithub)}
 className="w-full flex items-center justify-center bg-card text-foreground hover:bg-muted border-border shadow-sm transition-all h-12 rounded-xl"
 >
 <GithubIcon />
 <span className="font-semibold text-sm">GitHub</span>
 </Button>
 </div>

 <div className="relative flex py-4 items-center justify-center mb-6">
 <div className="absolute inset-x-0 top-1/2 border-t border-border -z-10" />
 <span className="bg-card px-4 relative z-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground rounded-full shadow-sm border border-border">
 Or continue with email
 </span>
 </div>

 <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
 <label className="flex flex-col gap-1.5 relative">
 <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</span>
 <Input
 type="email"
 placeholder="name@example.com"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 className="h-11"
 />
 </label>

 <label className="flex flex-col gap-1.5 relative">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</span>
 <Link to="/forgot-password" className="text-accent text-[10px] tracking-wider uppercase font-bold hover:underline">
 Forgot?
 </Link>
 </div>
 <Input
 type="password"
 placeholder="••••••••"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 className="h-11"
 />
 </label>

 <Button
 type="submit"
 variant="primary"
 className="w-full mt-2 h-11"
 disabled={loading}
 >
 {loading ? 'Signing in...' : 'Sign in'}
 </Button>
 </form>
 </AuthLayout>
 );
}