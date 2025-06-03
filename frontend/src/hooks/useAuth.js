import { useCheckAuthQuery, useLogoutMutation } from "@/redux/services/authApi";

export const useAuth = () => {
  const { data, isLoading, isError, refetch } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [logoutMutation] = useLogoutMutation();

  const user = data?.user || JSON.parse(localStorage.getItem('user') || 'null');
  
  const isAuthenticated = Boolean(
    data?.isAuthenticated || 
    (user && document.cookie.includes('token'))
  );

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
      localStorage.removeItem('user');
      // Clear any other auth-related state if needed
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isError,
    refetchAuth: refetch,
    logout // Make sure to expose the logout function
  };
};