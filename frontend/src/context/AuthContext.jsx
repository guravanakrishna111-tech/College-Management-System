import { createContext, useEffect, useState } from "react";
import { getCurrentUserRequest, loginRequest, registerRequest } from "../services/auth.service";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      const token = localStorage.getItem("cms_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUserRequest();
        setUser(response.user);
      } catch (error) {
        localStorage.removeItem("cms_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, []);

  const login = async (payload) => {
    const response = await loginRequest(payload);
    localStorage.setItem("cms_token", response.token);
    setUser(response.user);
    return response;
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    localStorage.setItem("cms_token", response.token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("cms_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
