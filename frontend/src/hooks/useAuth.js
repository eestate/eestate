
import { useCheckAuthQuery } from '@/redux/services/authApi';

export const useAuth = () => {
  const { data, isLoading, isError,refetch } = useCheckAuthQuery();
  
  const localUser = JSON.parse(localStorage.getItem('user'));
  
  return {
    user: data?.user || localUser,
    isAuthenticated: data?.isAuthenticated || !!localUser,
    isLoading,
    isError,
    refetchAuth: refetch
  };
};