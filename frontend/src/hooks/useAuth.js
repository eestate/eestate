import { authApi, useCheckAuthQuery, useLogoutMutation } from "@/redux/services/authApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export const useAuth = () => {
  const { data, isLoading, refetch } = useCheckAuthQuery();
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();

  const logout = async () => {
    await logoutMutation();
    dispatch(authApi.util.resetApiState());
    await refetch();
  };

  useEffect(() => {
    refetch();
  }, []);

  return {
    user: data?.user,
    isAuthenticated: !!data?.isAuthenticated,
    isLoading,
    logout,
    refetch,
  };
};