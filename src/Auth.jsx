import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();
const ServerUrl = import.meta.env.VITE_Server_Url;

// Socket.io connection with proper CORS settings
const socket = io(ServerUrl, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  autoConnect: false, // We'll manually connect after auth
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [favoriteHometels, setFavoriteHometels] = useState([]);
  const [trips, setTrips] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [hometels, setHometels] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const authCheckRef = useRef(false);

  // Connect socket when authenticated
  const connectSocket = useCallback(() => {
    if (!socket.connected && isAuthenticated) {
      socket.connect();
      socket.emit("userLoggedIn", user?._id);
    }
  }, [isAuthenticated, user?._id]);

  // Disconnect socket when not authenticated
  const disconnectSocket = useCallback(() => {
    if (socket.connected) {
      socket.emit("userLoggedOut", user?._id);
      socket.disconnect();
    }
  }, [user?._id]);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    if (authCheckRef.current) return;
    authCheckRef.current = true;

    try {
      const { data } = await axios.get(`${ServerUrl}/user/check`, {
        withCredentials: true,
      });

      if (data.authenticated) {
        setUser(data.user);
        setFavoriteHometels(data.user.favoriteHometels || []);
        setTrips(data.user.reservations || []);
        setReviews(data.user.reviews || []);
        setHometels(data.user.hometels || []);
        setIsAuthenticated(true);
        connectSocket();
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      handleLogout();
    } finally {
      setLoading(false);
      authCheckRef.current = false;
    }
  }, [connectSocket]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await axios.post(`${ServerUrl}/user/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setFavoriteHometels([]);
      setTrips([]);
      setReviews([]);
      setHometels([]);
      setIsAuthenticated(false);
      disconnectSocket();
      sessionStorage.removeItem("user");
      
      // Redirect if on protected route
      const protectedRoutes = [
        "/dashboard",
        "/dashboard/personal-info",
        "/dashboard/profile",
        "/dashboard/Login&security",
        "/dashboard/User-data",
        "/dashboard/user-hometel",
        "/dashboard/user-favriote",
        "/dashboard/user-reviews",
        "/dashboard/user-trips",
        "/new",
        "/change-password",
        "/update",
        "/reserv",
      ];
      
      if (protectedRoutes.includes(location.pathname)) {
        navigate("/");
      }
    }
  }, [disconnectSocket, location.pathname, navigate]);

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle socket events
  useEffect(() => {
    const handleAuthUpdate = () => checkAuth();
    socket.on("authUpdate", handleAuthUpdate);

    return () => {
      socket.off("authUpdate", handleAuthUpdate);
    };
  }, [checkAuth]);

  // Auth context value
  const value = {
    user,
    favoriteHometels,
    trips,
    reviews,
    hometels,
    isAuthenticated,
    loading,
    login: async (credentials) => {
      try {
        const { data } = await axios.post(`${ServerUrl}/user/login`, credentials, {
          withCredentials: true,
        });

        setUser(data.user);
        setFavoriteHometels(data.user.favoriteHometels || []);
        setTrips(data.user.reservations || []);
        setReviews(data.user.reviews || []);
        setHometels(data.user.hometels || []);
        setIsAuthenticated(true);
        connectSocket();
        sessionStorage.setItem("user", JSON.stringify(data.user));
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Login failed" };
      }
    },
    signup: async (credentials) => {
      try {
        const { data } = await axios.post(`${ServerUrl}/user/signup/verify`, credentials, {
          withCredentials: true,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        });

        setUser(data.user);
        setFavoriteHometels(data.user.favoriteHometels || []);
        setTrips(data.user.reservations || []);
        setReviews(data.user.reviews || []);
        setHometels(data.user.hometels || []);
        setIsAuthenticated(true);
        connectSocket();
        sessionStorage.setItem("user", JSON.stringify(data.user));
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Signup failed" };
      }
    },
    updateUser: async (credentials) => {
      try {
        const { data } = await axios.patch(`${ServerUrl}/user/update`, credentials, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        setUser(data.user);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        socket.emit("authUpdate");
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Update failed" };
      }
    },
    logout: handleLogout,
    // Favorites
    addFavorite: async (hometelId) => {
      try {
        const { data } = await axios.post(
          `${ServerUrl}/user/favorite/add`,
          { hometelId },
          { withCredentials: true }
        );

        setFavoriteHometels(data.favorites);
        setUser(prev => ({ ...prev, favoriteHometels: data.favorites }));
        socket.emit("favoritesUpdated", { userId: user._id, favorites: data.favorites });
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Failed to add favorite" };
      }
    },
    removeFavorite: async (hometelId) => {
      try {
        const { data } = await axios.post(
          `${ServerUrl}/user/favorites/remove`,
          { hometelId },
          { withCredentials: true }
        );

        setFavoriteHometels(data.favorites);
        setUser(prev => ({ ...prev, favoriteHometels: data.favorites }));
        socket.emit("favoritesUpdated", { userId: user._id, favorites: data.favorites });
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Failed to remove favorite" };
      }
    },
    // Reviews
    addReview: async (reviewData) => {
      try {
        const { data } = await axios.post(
          `${ServerUrl}/review/create`,
          reviewData,
          { withCredentials: true }
        );

        setReviews(data.reviews);
        setUser(prev => ({ ...prev, reviews: data.reviews }));
        socket.emit("reviewAdded", { userId: user._id, reviews: data.reviews });
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Failed to add review" };
      }
    },
    removeReview: async (reviewId) => {
      try {
        const { data } = await axios.delete(
          `${ServerUrl}/review/${reviewId}`,
          { withCredentials: true }
        );

        setReviews(data.reviews);
        setUser(prev => ({ ...prev, reviews: data.reviews }));
        socket.emit("reviewAdded", { userId: user._id, reviews: data.reviews });
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Failed to remove review" };
      }
    },
    // Trips
    addTrip: async (tripData) => {
      try {
        const { data } = await axios.post(
          `${ServerUrl}/reserv/${tripData.reservFor}`,
          tripData,
          { withCredentials: true }
        );

        setTrips(data.trips);
        setUser(prev => ({ ...prev, reservations: data.trips }));
        socket.emit("tripUpdated", { userId: user._id, reservations: data.trips });
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Failed to add trip" };
      }
    },
    removeTrip: async (reservationId) => {
      try {
        const { data } = await axios.delete(
          `${ServerUrl}/reserv/${reservationId}`,
          { withCredentials: true }
        );

        setTrips(data.trips);
        setUser(prev => ({ ...prev, reservations: data.trips }));
        socket.emit("tripUpdated", { userId: user._id, reservations: data.trips });
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Failed to remove trip" };
      }
    },
    // Hometels
    addHometel: async (hometelData) => {
      try {
        const { data } = await axios.post(
          `${ServerUrl}/listing/new`,
          hometelData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setHometels(data.hometels);
        setUser(prev => ({ ...prev, hometels: data.hometels }));
        socket.emit("hometelUpdated", { userId: user._id, hometels: data.hometels });
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Failed to add hometel" };
      }
    },
    updateHometel: async (hometelData, hometelId) => {
      try {
        const { data } = await axios.put(
          `${ServerUrl}/listing/update/${hometelId}`,
          hometelData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setHometels(data.hometels);
        setUser(prev => ({ ...prev, hometels: data.hometels }));
        socket.emit("hometelUpdated", { userId: user._id, hometels: data.hometels });
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Failed to update hometel" };
      }
    },
    removeHometel: async (hometelId) => {
      try {
        const { data } = await axios.delete(
          `${ServerUrl}/listing/${hometelId}`,
          { withCredentials: true }
        );

        setHometels(data.hometels);
        setUser(prev => ({ ...prev, hometels: data.hometels }));
        socket.emit("hometelUpdated", { userId: user._id, hometels: data.hometels });
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Failed to remove hometel" };
      }
    },
    // Password reset
    resetPassword: async (credentials) => {
      try {
        const { data } = await axios.patch(
          `${ServerUrl}/user/reset-password`,
          credentials,
          { withCredentials: true }
        );
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "Password reset failed" };
      }
    },
    verifyResetPasswordOtp: async (credentials) => {
      try {
        const { data } = await axios.put(
          `${ServerUrl}/user/reset-password`,
          credentials,
          { withCredentials: true }
        );
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.response?.data?.message || "OTP verification failed" };
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);