import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { getSocket } from "../api/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("fbbd_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("fbbd_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("fbbd_user", JSON.stringify(data.user));
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem("fbbd_token");
        localStorage.removeItem("fbbd_user");
      } finally {
        setLoading(false);
      }
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?._id) {
      const socket = getSocket();
      socket.connect();
      socket.emit("join", user._id);
      return () => socket.disconnect();
    }
  }, [user?._id]);

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem("fbbd_token", newToken);
    localStorage.setItem("fbbd_user", JSON.stringify(newUser));
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
      const next = { ...prev, ...patch };
      localStorage.setItem("fbbd_user", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
