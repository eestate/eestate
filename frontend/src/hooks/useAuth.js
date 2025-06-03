import { useCheckAuthQuery } from "@/redux/services/authApi";

export const useAuth = () => {
  const { data, isLoading, isError, refetch } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: true,  
  });


  const user = data?.user || JSON.parse(localStorage.getItem('user')) || null;
  

  const isAuthenticated = Boolean(
    data?.isAuthenticated || 
    (user && document.cookie.includes('token'))
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    isError,
    refetchAuth: refetch
  };
};