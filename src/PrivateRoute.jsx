import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useAuth } from "./Auth";
import toast from "react-hot-toast";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); // Get values from AuthContext
  const location = useLocation();

  // Wait until the authentication check is complete
  if (loading) {
    // Render a loading spinner or placeholder while checking auth
    return (
      <>
        <div className="p-4 mx-auto max-w-4xl space-y-4">
          {/* Title Input Skeleton */}
          <Skeleton height={48} borderRadius={8} />

          {/* Description Input Skeleton */}
          <Skeleton height={112} borderRadius={8} />

          {/* Location Input Skeleton */}
          <Skeleton height={48} borderRadius={8} />

          {/* Price & Country Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <Skeleton height={48} borderRadius={8} />
            <Skeleton height={48} borderRadius={8} />
          </div>

          {/* Select Category Skeleton */}
          <Skeleton height={48} borderRadius={8} />

          {/* File Upload Box Skeleton */}
          <Skeleton height={256} borderRadius={8} />
        </div>
      </>
    );
  }

  // If user is not authenticated, redirect to /login
  if (!isAuthenticated) {
    toast.error("Please Log In to create Hometel");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
}

export default PrivateRoute;
