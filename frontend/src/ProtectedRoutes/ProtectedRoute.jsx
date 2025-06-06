// src/components/ProtectedRoute.jsx
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to role-specific home
    const redirectPath = role === 'agent' ? '/agent' : 
                       role === 'admin' ? '/admin' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};