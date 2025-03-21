import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./Auth";
import Loader from "./PrivateRouteLoader";
import toast from "react-hot-toast";

const AuthRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation(); // ✅ Get current route path

  if (loading) return <Loader />;

  // ✅ Show toast only if user is visiting login/signup pages
  if (isAuthenticated && (location.pathname === "/login" || location.pathname === "/signup")) {
    toast.error("You are already logged in");
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AuthRedirect;
