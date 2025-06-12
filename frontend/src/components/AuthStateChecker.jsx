// components/RouteBlocker.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AuthStateChecker = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      // Block access to protected routes when logged out
      if (!isAuthenticated && 
          (location.pathname.startsWith('/agent') || 
           location.pathname.startsWith('/admin'))) {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  return null;
};