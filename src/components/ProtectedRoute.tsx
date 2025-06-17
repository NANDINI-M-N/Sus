
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import PageLoader from '@/components/loading/PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'recruiter' | 'candidate';
}

const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { user, loading: authLoading, session } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Check role-based access control once profile is loaded
    if (!authLoading && !profileLoading && user && profile && requireRole) {
      if (profile.role !== requireRole) {
        // Redirect to appropriate dashboard based on user's role
        switch (profile.role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'recruiter':
            navigate('/recruiter-dashboard');
            break;
          case 'candidate':
            navigate('/candidate-dashboard');
            break;
          default:
            navigate('/');
        }
      }
    }
  }, [user, profile, authLoading, profileLoading, requireRole, navigate]);

  if (authLoading || (user && profileLoading)) {
    return <PageLoader text="Authenticating..." />;
  }

  if (!user || !session) {
    return <PageLoader text="Redirecting to login..." />;
  }

  // If role is required but user doesn't have the right role, show loading while redirecting
  if (requireRole && profile && profile.role !== requireRole) {
    return <PageLoader text="Redirecting..." />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
