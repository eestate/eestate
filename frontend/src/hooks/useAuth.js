import { authApi, useCheckAuthQuery, useLogoutMutation } from "@/redux/services/authApi";
import { useDispatch } from "react-redux";


// hooks/useAuth.js
export const useAuth = () => {
  const { data, isLoading, refetch } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      // Clear client-side data immediately
      localStorage.removeItem('user');
      
      // Make logout request
      await logoutMutation().unwrap();
      
      // Reset API state and force refetch
      dispatch(api.util.resetApiState());
      
      return true; // Indicate success
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  return {
    user: data?.user,
    role: data?.user?.role,
    isAuthenticated: !!data?.isAuthenticated,
    isLoading,
    logout,
    refetch,
  };
};