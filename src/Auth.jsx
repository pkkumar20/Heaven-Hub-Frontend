import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();
const ServerUrl = import.meta.env.VITE_Server_Url;

const socket = io(ServerUrl, { autoConnect: false, withCredentials: true });
const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route path
  const [user, setUser] = useState(null);
  const [favoriteHometels, setFavoriteHometels] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Function to handle logout (including server disconnection)
  const handleLogout = () => {
    setUser(null);
    setFavoriteHometels([]);
    setIsAuthenticated(false);
    sessionStorage.removeItem("user");
    socket.emit("authUpdate");
    socket.disconnect();
   if (isProtectedRoute(location.pathname)) {
    navigate("/");
  }
  };

  // ✅ Function to check authentication status
const checkAuth = async () => {
  setLoading(true);

  try {
    const res = await axios.get(`${ServerUrl}/user/check`, { withCredentials: true });

    if (res.data.authenticated) {
      setUser(res.data.user);
      setFavoriteHometels(res.data.user.favoriteHometels);
      setIsAuthenticated(true);
      connectSocket();
      socket.emit("userLoggedIn", res.data.user._id);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
    } else {
      console.warn("Session expired. Logging out...");
      handleLogout();

      // ✅ Redirect ONLY if user is on a PROTECTED page, not a public route
      if (isProtectedRoute(location.pathname)) {
        navigate("/");
      }
    }
  } catch (err) {
    console.error("Auth check failed:", err.response?.data?.message || err.message);
    handleLogout();

    // ✅ Redirect ONLY if user is on a PROTECTED page
    if (isProtectedRoute(location.pathname)) {
      navigate("/login");
    }
  } finally {
    setLoading(false);
  }
};

// ✅ Helper function to check if the route is PROTECTED
const isProtectedRoute = (path) => {
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
    "/reserv"
  ];
  return protectedRoutes.includes(path);
};



  // ✅ Check authentication on mount & reconnect socket
useEffect(() => {
  checkAuth();

  socket.on("disconnect", () => {
    console.warn("Server disconnected. Logging out...");
    handleLogout();
  });

  return () => {
    socket.off("disconnect");
    socket.disconnect();
  };
}, []);

// ✅ Prevent immediate redirection when entering a URL manually
useEffect(() => {
  if (!loading && !isAuthenticated && isProtectedRoute(location.pathname)) {
    navigate("/login");
  }
}, [loading, isAuthenticated, location.pathname]);


  // ✅ Sync login/logout across tabs
  useEffect(() => {
    socket.on("authUpdate", checkAuth);
    return () => socket.off("authUpdate");
  }, []);
  // ✅ Only check auth when visibility changes **if NOT on login/signup**
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        location.pathname !== "/login" &&
        location.pathname !== "/forget-password" &&
        location.pathname !== "/signup"
      ) {
        checkAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        favoriteHometels,
        isAuthenticated,
        loading,
        login: async (credentials) => {
          try {
            const res = await axios.post(
              `${ServerUrl}/user/login`,
              credentials,
              {
                withCredentials: true,
              }
            );
            setUser(res.data.user);
            setFavoriteHometels(res.data.user.favoriteHometels);
            setIsAuthenticated(true);
            connectSocket();
            socket.emit("userLoggedIn", res.data.user._id);
            socket.emit("authUpdate");
            sessionStorage.setItem("user", JSON.stringify(res.data.user));
            return { success: true, data: res.data };
          } catch (err) {
            return { success: false, data: err.response };
          }
        },
        signup: async (credentials) => {
          try {
            const res = await axios.post(
              `${ServerUrl}/user/signup/verify`,
              credentials,
              {
                withCredentials: true,
                headers: {
                  "content-type": "application/x-www-form-urlencoded",
                },
              }
            );
            setUser(res.data.user);
            setFavoriteHometels(res.data.user.favoriteHometels);
            setIsAuthenticated(true);
            connectSocket();
            socket.emit("userLoggedIn", res.data.user._id);
            socket.emit("authUpdate");
            sessionStorage.setItem("user", JSON.stringify(res.data.user));
            return { success: true, data: res.data };
          } catch (err) {
            return { success: false, data: err.response };
          }
        },
          updateUser: async (credentials) => {
          try {
             const res = await axios.patch(
        `${ServerUrl}/user/update`,
        credentials,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }, // Fixed header
        }
            );
            setUser(res.data.user);
            setFavoriteHometels(res.data.user.favoriteHometels);
            socket.emit("authUpdate");
            sessionStorage.setItem("user", JSON.stringify(res.data.user));
            return { success: true, data: res.data };
          } catch (err) {
            return { success: false, data: err.response };
          }
        },
        logout: async () => {
          try {
            await axios.post(
              `${ServerUrl}/user/logout`,
              {},
              { withCredentials: true }
            );
            setFavoriteHometels([]);
            handleLogout();
          } catch (err) {
            console.error(
              "Logout Error:",
              err.response?.data?.message || err.message
            );
          }
        },
        addFavorite: async (hometelId) => {
          try {
            const res = await axios.post(
              `${ServerUrl}/user/favorite/add`,
              { userId: user._id, hometelId },
              { withCredentials: true }
            );
            setUser((prev) => ({
              ...prev,
              favoriteHometels: res.data.favorites,
            }));
            setFavoriteHometels(res.data.favorites);
            socket.emit("favoritesUpdated", {
              userId: user._id,
              favorites: res.data.favorites,
            });
            return { success: true, data: res };
          } catch (err) {
            return { success: false, message: err.response?.data?.message };
          }
        },
        removeFavorite: async (hometelId) => {
          try {
            const res = await axios.post(
              `${ServerUrl}/user/favorites/remove`,
              { userId: user._id, hometelId },
              { withCredentials: true }
            );
            setUser((prev) => ({
              ...prev,
              favoriteHometels: res.data.favorites,
            }));
            setFavoriteHometels(res.data.favorites);
            socket.emit("favoritesUpdated", {
              userId: user._id,
              favorites: res.data.favorites,
            });
            return { success: true, data: res };
          } catch (err) {
            return { success: false, message: err.response?.data?.message };
          }
        },
        varifyresetPasswordOtp: async (credentials) => {
          try {
            const res = await axios.put(
              `${ServerUrl}/user/reset-password`,
              credentials,
              {
                withCredentials: true,
                headers: {
                  "content-type": "application/x-www-form-urlencoded",
                },
              }
            );
            return { success: true, data: res };
          } catch (err) {
            return { success: false, data: err.response };
          }
        },
        resetPassword : async (credentials) => {
          try{
          const res = await axios.patch(
          `${ServerUrl}/user/reset-password`,
          credentials,
          {
            withCredentials: true,
            headers: { "content-type": "application/x-www-form-urlencoded" },
        }
          );
          return { success: true, data: res };
          }catch(err){
          return { success: false, data: err.response };
          }
        },
        addreview: async (credentials) => {
          try {
        const res = await axios.post(`${ServerUrl}/review/create`, credentials, {
          withCredentials: true,
          headers: { "content-type": "application/x-www-form-urlencoded" },
        });
            setUser((prev) => ({
              ...prev,
              reviews: res.data.reviews,
            }));
              socket.emit("reviewAdded", {
              userId: user._id,
              reviews: res.data.reviews,
            });
            return { success: true, data: res };
          } catch (err) {
             return { success: false, data: err.response };
          }
        },
        removereview: async (reviewId) => {
          try {
        const res = await axios.delete(`${ServerUrl}/review/${reviewId}`, {
        withCredentials: true,
      });
            setUser((prev) => ({
              ...prev,
              reviews: res.data.reviews,
            }));
              socket.emit("reviewAdded", {
              userId: user._id,
              reviews: res.data.reviews,
            });
            return { success: true, data: res };
          } catch (err) {
             return { success: false, data: err.response };
          }
        },
        addTrip: async (credentials) => {
          try {
        const res = await axios.post(
        `${ServerUrl}/reserv/${credentials.reservFor}`,
        credentials,
        {
          withCredentials: true,
          headers: { "content-type": "application/x-www-form-urlencoded" },
        }
            );
            setUser((prev) => ({
              ...prev,
              reservations: res.data.trips,
            }));
               socket.emit("tripUpdated", {
              userId: user._id,
              reservations: res.data.trips,
            });
            return { success: true, data: res };
          } catch (err) {
            console.log(err);
             return { success: false, data: err.response };
          }
        },
        removeTrip: async (credentials) => {
          try {
        const res = await axios.delete(`${ServerUrl}/reserv/${credentials}`, {
                        withCredentials: true,
                      });
            setUser((prev) => ({
              ...prev,
              reservations: res.data.trips,
            }));
               socket.emit("tripUpdated", {
              userId: user._id,
              reservations: res.data.trips,
            });
            return { success: true, data: res };
          } catch (err) {
            console.log(err);
             return { success: false, data: err.response };
          }
        },
        addHometel: async (credentials) => {
          try {
            const res = await axios.post(`${ServerUrl}/listing/new`, credentials, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Required header for file uploads
          },
            });
              setUser((prev) => ({
              ...prev,
              hometels: res.data.hometels,
            }));
            socket.emit("hometelUpdated", {
              userId: user._id,
              hometels: res.data.hometels,
            });
              return { success: true, data: res };
          } catch (err) {
            console.log(err);
            return { success: false, data: err.response };
          }
        },
       updateHometel: async (credentials,id) => {
          try {
            const res = await axios.put(
        `${ServerUrl}/listing/update/${id}`,
        credentials,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
              setUser((prev) => ({
              ...prev,
              hometels: res.data.hometels,
            }));
            socket.emit("hometelUpdated", {
              userId: user._id,
              hometels: res.data.hometels,
            });
              return { success: true, data: res };
          } catch (err) {
            console.log(err);
            return { success: false, data: err.response };
          }
        },
        removeHometel: async (credentials) => {
          try {
            const res = await  axios
   .delete(`${ServerUrl}/listing/${credentials}`, {
     withCredentials: true,
   })
              setUser((prev) => ({
              ...prev,
              hometels: res.data.hometels,
            }));
            socket.emit("hometelUpdated", {
              userId: user._id,
              hometels: res.data.hometels,
            });
              return { success: true, data: res };
          } catch (err) {
            console.log(err);
            return { success: false, data: err.response };
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
