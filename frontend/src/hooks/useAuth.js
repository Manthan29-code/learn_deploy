import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, fetchMe, loginUser, logout, registerUser } from "../store/slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = useCallback((payload) => dispatch(loginUser(payload)), [dispatch]);
  const register = useCallback((payload) => dispatch(registerUser(payload)), [dispatch]);
  const bootstrap = useCallback(() => dispatch(fetchMe()), [dispatch]);
  const logoutUser = useCallback(() => dispatch(logout()), [dispatch]);
  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);

  return {
    ...auth,
    login,
    register,
    bootstrap,
    logout: logoutUser,
    clearError,
  };
};

export default useAuth;
