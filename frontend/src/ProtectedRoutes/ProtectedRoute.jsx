"use client"

import { useAuth } from '../hooks/useAuth';
import AuthModal from '../pages/AuthModal';
import { useState } from 'react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};