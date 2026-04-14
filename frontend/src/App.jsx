import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import useAuth from "./hooks/useAuth";
import FeedPage from "./pages/FeedPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import UsersPage from "./pages/UsersPage";
import socketService from "./services/socketService";
import registerSocketHandlers from "./socket/registerSocketHandlers";

function App() {
  const dispatch = useDispatch();
  const { token, bootstrap, logout } = useAuth();

  useEffect(() => {
    if (token) {
      bootstrap();
    }
  }, [bootstrap, token]);

  useEffect(() => {
    const socket = socketService.connect(token);
    const cleanupHandlers = registerSocketHandlers({ socket, dispatch });

    return () => {
      cleanupHandlers();
      socketService.disconnect();
    };
  }, [dispatch, token]);

  return (
    <Layout onLogout={logout}>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
