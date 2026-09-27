import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import api from "../api/axios";
import { getSocket } from "../api/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Restore saved user from storage

  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("fbbd_user");
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Failed to restore user:", error);
      localStorage.removeItem("fbbd_user");
      return null;
    }
  });

  // Restore saved token 
  const [token, setToken] = useState(() =>
    localStorage.getItem("fbbd_token")
  );

  const [loading, setLoading] = useState(true);

  // Verify saved token on app load
  useEffect(() => {
    let mounted = true;

    const verifyAuth = async () => {
      if (!token) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const { data } = await api.get("/auth/me");

        if (!mounted) return;

        if (data?.user) {
          setUser(data.user);

          localStorage.setItem(
            "fbbd_user",
            JSON.stringify(data.user)
          );
        }
      } catch (error) {
        console.error(
          "Authentication verification failed:",
          error
        );

        // Only logout when token is actually invalid/expired
        if (error.response?.status === 401) {
          if (mounted) {
            setUser(null);
            setToken(null);
          }

          localStorage.removeItem("fbbd_token");
          localStorage.removeItem("fbbd_user");
        }

        // For server/network errors, don't destroy saved login
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    verifyAuth();

    return () => {
      mounted = false;
    };
  }, [token]);

  // Socket connection
 
  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    socket.connect();

    socket.emit("join", user._id);

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem("fbbd_token", newToken);
    localStorage.setItem(
      "fbbd_user",
      JSON.stringify(newUser)
    );

    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fbbd_token");
    localStorage.removeItem("fbbd_user");

    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      if (!prev) return prev;

      const nextUser = {
        ...prev,
        ...patch,
      };

      localStorage.setItem(
        "fbbd_user",
        JSON.stringify(nextUser)
      );

      return nextUser;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};