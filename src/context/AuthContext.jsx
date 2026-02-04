// src/context/AuthContext.jsx
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,               // ← Changed: full user object instead of just username
  username: "",             // ← Kept for backward compatibility
  setIsAuthenticated: () => {},
  setUser: () => {},        // ← New: to allow updating full user (e.g., from profile page)
  setUsername: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);  // Full user data: { id, username, first_name, ... }
  const [username, setUsername] = useState(""); // For compatibility with your NavBarLink

  // Sync auth state from token and localStorage
  const handleAuth = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setUsername("");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const expiryDate = decoded.exp;
      const currentTime = Date.now() / 1000;

      if (expiryDate >= currentTime) {
        setIsAuthenticated(true);

        // Try to get full user from localStorage first (faster, from profile page)
        const savedUser = localStorage.getItem("userProfileData");
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setUsername(parsedUser.username || parsedUser.first_name || decoded.username || decoded.sub || "User");
            return; // Success → no need to fetch
          } catch (parseErr) {
            console.error("Failed to parse userProfileData:", parseErr);
          }
        }

        // Fallback: use JWT data if no stored profile
        const jwtUsername = decoded.username || decoded.sub || "";
        setUsername(jwtUsername);
        setUser({ username: jwtUsername }); // Minimal user object from JWT
      } else {
        // Token expired → clear
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
        setUser(null);
        setUsername("");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setUser(null);
      setUsername("");
    }
  };

  // Fetch username (or full profile) if needed when authenticated
  const fetchUserData = async () => {
    if (!isAuthenticated) return;

    try {
      // Prefer fetching full profile if not already in storage
      const response = await api.get("user_info", { // ← Use your actual profile endpoint
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      const data = response.data;
      const processedUser = {
        id: data.id || 0,
        username: data.username || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
      };

      // Save to storage and state
      localStorage.setItem("userProfileData", JSON.stringify(processedUser));
      setUser(processedUser);
      setUsername(processedUser.username || processedUser.first_name || "User");
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      // Fallback to JWT if fetch fails
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUsername(decoded.username || decoded.sub || "User");
        } catch {}
      }
    }
  };

  // Run handleAuth on mount
  useEffect(() => {
    handleAuth();
  }, []);

  // When authenticated, fetch full user data if not already loaded
  useEffect(() => {
    if (isAuthenticated && !user?.username) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userProfileData"); // Clear profile data too
    setIsAuthenticated(false);
    setUser(null);
    setUsername("");
  };

  // Optional: expose a manual refresh
  const refreshUser = () => {
    handleAuth();
    if (isAuthenticated) fetchUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,                    // Full user for more flexibility
        username,                // For your current NavBarLink
        setIsAuthenticated,
        setUser,
        setUsername,
        logout,
        refreshUser,             // Call this from profile page if needed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}