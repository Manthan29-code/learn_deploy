import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAiConfigError,
  clearAuthError,
  clearProfileUpdateError,
  fetchMe,
  loginUser,
  logout,
  registerUser,
  updateAiConfig,
  updateBio,
} from "../store/slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = useCallback((payload) => dispatch(loginUser(payload)), [dispatch]);
  const register = useCallback((payload) => dispatch(registerUser(payload)), [dispatch]);
  const bootstrap = useCallback(() => dispatch(fetchMe()), [dispatch]);
  const updateUserBio = useCallback((bio) => dispatch(updateBio(bio)), [dispatch]);
  const updateUserAiConfig = useCallback((payload) => dispatch(updateAiConfig(payload)), [dispatch]);
  const logoutUser = useCallback(() => dispatch(logout()), [dispatch]);
  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);
  const clearBioError = useCallback(() => dispatch(clearProfileUpdateError()), [dispatch]);
  const clearConfigError = useCallback(() => dispatch(clearAiConfigError()), [dispatch]);

  return {
    ...auth,
    login,
    register,
    bootstrap,
    updateBio: updateUserBio,
    updateAiConfig: updateUserAiConfig,
    logout: logoutUser,
    clearError,
    clearBioError,
    clearConfigError,
  };
};

export default useAuth;
