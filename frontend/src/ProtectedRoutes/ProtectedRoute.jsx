// components/ProtectedRoute.js
"use client"

import { useAuth } from '../hooks/useAuth';
import AuthModal from '../pages/AuthModal';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthModal isOpen={true} onClose={() => {}} />
        {children}
      </>
    );
  }

  return children;
};