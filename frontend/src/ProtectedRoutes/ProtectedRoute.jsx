import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isCheckingAuth, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckingAuth) {
      // Check both auth state and localStorage for consistency
      const localUser = JSON.parse(localStorage.getItem('user'));
      const actuallyAuthenticated = isAuthenticated && localUser;

      if (!actuallyAuthenticated) {
        // Only redirect if trying to access protected route
        if (location.pathname.startsWith('/agent') || 
            location.pathname.startsWith('/admin')) {
          navigate('/', { 
            state: { from: location },
            replace: true  // This prevents back navigation
          });
        }
        return;
      }

      // Check role permissions
      if (allowedRoles && !allowedRoles.includes(role)) {
        const redirectPath = role === 'agent' ? '/agent/dashboard' : 
                         role === 'admin' ? '/admin/dashboard' : '/';
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, isCheckingAuth, role, allowedRoles, navigate, location]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  // Only render children if all checks pass
  if (isAuthenticated && (!allowedRoles || allowedRoles.includes(role))) {
    return children;
  }
console.log('auth:', {
  isAuthenticated,
  isCheckingAuth,
  role,
  localUser: localStorage.getItem('user'),
});

  return null;
};