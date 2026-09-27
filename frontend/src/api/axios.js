import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fbbd_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle API responses

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status = error.response?.status;

    // Only logout when backend confirms
    // that the JWT is invalid/expired.
    if (status === 401) {
      localStorage.removeItem("fbbd_token");
      localStorage.removeItem("fbbd_user");

      const currentPath = window.location.pathname;

      const publicPages = [
        "/login",
        "/register",
      ];

      if (!publicPages.includes(currentPath)) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;