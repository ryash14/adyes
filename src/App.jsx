import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Toast from './components/Toast';
import CustomCursor from './components/ui/CustomCursor';
import { lazy, Suspense, useEffect } from 'react';
import './index.css';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Discover = lazy(() => import('./pages/Discover'));
const Network = lazy(() => import('./pages/Network'));
const Messages = lazy(() => import('./pages/Messages'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Settings = lazy(() => import('./pages/Settings'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner spinner-lg" />
  </div>
);

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [hash, pathname]);

  return null;
};

const ProtectedRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!profile?.isProfileComplete) return <Navigate to="/setup" replace />;
  return children;
};

const SetupRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.isProfileComplete) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user && profile?.isProfileComplete) return <Navigate to="/dashboard" replace />;
  if (user && !profile?.isProfileComplete) return <Navigate to="/setup" replace />;
  return children;
};

const HomeRoute = () => {
  const { user, profile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user && profile?.isProfileComplete) return <Navigate to="/dashboard" replace />;
  if (user) return <Navigate to="/setup" replace />;
  return <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <CustomCursor />
      <BrowserRouter>
        <ScrollToHash />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/setup" element={<SetupRoute><ProfileSetup /></SetupRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
            <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/" element={<HomeRoute />} />
          </Routes>
        </Suspense>
        <Toast />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
