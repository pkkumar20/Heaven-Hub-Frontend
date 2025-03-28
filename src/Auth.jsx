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
      // Only call logout if we were previously authenticated
      if (isAuthenticated) {
        handleLogout();
      }
    }
  } catch (err) {
    console.error("Auth check failed:", err);
    // Only call logout for 401 Unauthorized errors
    if (err.response?.status === 401 && isAuthenticated) {
      handleLogout();
    }
  } finally {
    setLoading(false);
    authCheckRef.current = false;
  }
}, [connectSocket, isAuthenticated, handleLogout]);



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
        return { success: false,data: err.response };
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
        return { success: false, data: err.response };
      }
    },
    updateUser: async (credentials) => {
      try {
        const res = await axios.patch(`${ServerUrl}/user/update`, credentials, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUser(res.data.user);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        socket.emit("authUpdate");
        return { success: true, data:res };
      } catch (err) {
        return { success: false, data: err.response};
      }
    },
    logout: handleLogout,
    // Favorites
    addFavorite: async (hometelId) => {
      try {
        const res = await axios.post(
          `${ServerUrl}/user/favorite/add`,
          { hometelId},
          { withCredentials: true }
        );
        setFavoriteHometels(res.data.favorites);
        setUser(prev => ({ ...prev, favoriteHometels: res.data.favorites }));
        socket.emit("favoritesUpdated", { userId: user._id, favorites: res.data.favorites });
        return { success: true, data:res };
      } catch (err) {
        return { success: false, data: err.response };
      }
    },
    removeFavorite: async (hometelId) => {
      try {
        const res = await axios.post(
          `${ServerUrl}/user/favorites/remove`,
          { hometelId },
          { withCredentials: true }
        );
        setFavoriteHometels(res.data.favorites);
        setUser(prev => ({ ...prev, favoriteHometels: res.data.favorites }));
        socket.emit("favoritesUpdated", { userId: user._id, favorites: res.data.favorites });
        return { success: true, data:res };
      } catch (err) {
        return { success: false, data: err.response };
      }
    },
    // Reviews
    addReview: async (reviewData) => {
      try {
        const res = await axios.post(
          `${ServerUrl}/review/create`,
          reviewData,
          { withCredentials: true }
        );
        setReviews(res.data.reviews);
        setUser(prev => ({ ...prev, reviews: res.data.reviews }));
        socket.emit("reviewAdded", { userId: user._id, reviews: res.data.reviews });
        return { success: true, data:res };
      } catch (err) {
        return { success: false, data: err.response };
      }
    },
    removeReview: async (reviewId) => {
      try {
        const res = await axios.delete(
          `${ServerUrl}/review/${reviewId}`,
          { withCredentials: true }
        );

        setReviews(res.data.reviews);
        setUser(prev => ({ ...prev, reviews: res.data.reviews }));
        socket.emit("reviewAdded", { userId: user._id, reviews: res.data.reviews });
        return { success: true, data:res };
      } catch (err) {
        return { success: false, data: err.response };
      }
    },
    // Trips
    addTrip: async (tripData) => {
      try {
        const res = await axios.post(
          `${ServerUrl}/reserv/${tripData.reservFor}`,
          tripData,
          { withCredentials: true }
        );

        setTrips(res.data.trips);
        setUser(prev => ({ ...prev, reservations: res.data.trips }));
        socket.emit("tripUpdated", { userId: user._id, reservations: res.data.trips });
        return { success: true, data:res };
      } catch (err) {
        return { success: false, data: err.response };
      }
    },
    removeTrip: async (reservationId) => {
      try {
        const res = await axios.delete(
          `${ServerUrl}/reserv/${reservationId}`,
          { withCredentials: true }
        );
        setTrips(res.data.trips);
        setUser(prev => ({ ...prev, reservations: res.data.trips }));
        socket.emit("tripUpdated", { userId: user._id, reservations: res.data.trips });
        return { success: true, data:res };
      } catch (err) {
        return { success: false, edata: err.response };
      }
    },
    // Hometels
    addHometel: async (hometelData) => {
      try {
        const res = await axios.post(
          `${ServerUrl}/listing/new`,
          hometelData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setHometels(res.data.hometels);
        setUser(prev => ({ ...prev, hometels: res.data.hometels }));
        socket.emit("hometelUpdated", { userId: user._id, hometels: res.data.hometels });
        return { success: true, data:res };
      } catch (err) {
        return { success: false, data: err.response };
      }
    },
    updateHometel: async (hometelData, hometelId) => {
      try {
        const res = await axios.put(
          `${ServerUrl}/listing/update/${hometelId}`,
          hometelData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setHometels(res.data.hometels);
        setUser(prev => ({ ...prev, hometels: res.data.hometels }));
        socket.emit("hometelUpdated", { userId: user._id, hometels: res.data.hometels });
        return { success: true, data:res };
      } catch (err) {
        return { success: false, data: err.response };
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
        return { success: false, data: err.response };
      }
    },
    // Password reset
    resetPassword: async (credentials) => {
      try {
        const res = await axios.patch(
          `${ServerUrl}/user/reset-password`,
          credentials,
          { withCredentials: true }
        );
        return { success: true, data:res };
      } catch (err) {
        return { success: false, data: err.response };
      }
    },
    verifyResetPasswordOtp: async (credentials) => {
      try {
        const res = await axios.put(
          `${ServerUrl}/user/reset-password`,
          credentials,
          { withCredentials: true }
        );
        return { success: true, data:res };
      } catch (err) {
        return { success: false, data: err.response };
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);