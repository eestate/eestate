import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';

const RoleRouter = () => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [lastValidPath, setLastValidPath] = useState(null);

  // Track valid paths whenever location changes
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if ((role === 'agent' && location.pathname.startsWith('/agent')) ||
          (role === 'admin' && location.pathname.startsWith('/admin'))) {
        setLastValidPath(location.pathname);
      }
    }
  }, [location, isAuthenticated, isLoading, role]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const currentPath = location.pathname;
      
      // Redirect home page access
      if (currentPath === '/') {
        const redirectPath = lastValidPath || 
                           (role === 'agent' ? '/agent/dashboard' : 
                            role === 'admin' ? '/admin/dashboard' : '/');
        navigate(redirectPath, { replace: true });
        return;
      }

      // Handle unauthorized role access
      if ((role === 'agent' && currentPath.startsWith('/admin')) ||
          (role === 'admin' && currentPath.startsWith('/agent'))) {
        const redirectPath = lastValidPath || 
                           (role === 'agent' ? '/agent/dashboard' : 
                            role === 'admin' ? '/admin/dashboard' : '/');
        
        if (redirectPath !== currentPath) {
          toast.warning("Redirected to your authorized page");
          navigate(redirectPath, { 
            replace: true,
            state: { unauthorizedAttempt: true }
          });
        }
      }
    }
  }, [isAuthenticated, isLoading, role, navigate, location, lastValidPath]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return null;
};

export default RoleRouter;