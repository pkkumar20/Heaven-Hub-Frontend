import { useAuth } from "./Auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import PrivateLoader from "./PrivateRouteLoader";
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation(); // Get the current route
if(loading===true){
  return <PrivateLoader/>
}
  if (!isAuthenticated) {
    // Store the attempted URL in sessionStorage
    sessionStorage.setItem("redirectUrl", location.pathname);
    toast.error("Please login to acess this page")
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
