import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleRouter = () => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const currentPath = location.pathname;
      
      // Skip if already on correct route
      if ((role === 'agent' && currentPath.startsWith('/agent')) ||
          (role === 'admin' && currentPath.startsWith('/admin'))) {
        return;
      }

      // Redirect to role-specific home
      if (role === 'agent') {
        navigate('/agent/dashboard', { replace: true });
      } else if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, role, navigate, location]);

  return null;
};

export default RoleRouter;