// src/ProtectedRoutes/RoleRouter.jsx
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
      

      if (currentPath.includes('login')) return;
      
      switch(role) {
        case 'agent':
          if (!currentPath.startsWith('/agent')) {
            navigate('/agent/dashboard');
          }
          break;
        case 'admin':
          if (!currentPath.startsWith('/admin')) {
            navigate('/admin/dashboard');
          }
          break;
        default:
          if (currentPath.startsWith('/agent') || 
              currentPath.startsWith('/admin')) {
            navigate('/');
          }
      }
    }
  }, [isAuthenticated, isLoading, role, navigate, location]);

  return null;
};

export default RoleRouter;