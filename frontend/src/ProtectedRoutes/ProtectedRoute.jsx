import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams, useRoutes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [initialCheckDone, setInitialCheckDone] = useState(false);
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
    if (!isLoading) {
      const localUser = JSON.parse(localStorage.getItem('user'));
      const actuallyAuthenticated = isAuthenticated && localUser;

      if (!actuallyAuthenticated) {
        if (location.pathname.startsWith('/agent') || 
            location.pathname.startsWith('/admin')) {
          navigate('/', { 
            state: { 
              from: location,
              intendedPath: location.pathname
            },
            replace: true
          });
        }
      } else {
        if (allowedRoles && !allowedRoles.includes(role)) {
          // Determine where to redirect
          let redirectPath;
          
          if (lastValidPath && lastValidPath !== location.pathname) {
            redirectPath = lastValidPath; // Redirect to last valid path
          } else {
            // Fallback to dashboard if no valid path exists
            redirectPath = role === 'agent' ? '/agent/dashboard' : 
                        role === 'admin' ? '/admin/dashboard' : '/';
          }

          if (redirectPath !== location.pathname) {
            toast.warning("Redirected to your authorized page");
            navigate(redirectPath, { 
              replace: true,
              state: { unauthorizedAttempt: true }
            });
          }
        }
      }
      setInitialCheckDone(true);
    }
  }, [isAuthenticated, isLoading, role, allowedRoles, navigate, location, lastValidPath]);

  if (isLoading || !initialCheckDone) {
    return <LoadingSpinner fullScreen />;
  }

  if (isAuthenticated && (!allowedRoles || allowedRoles.includes(role))) {
    return children;
  }

  return null;
};