import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginService } from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const authData = JSON.parse(saved);
      setUser(authData.user);
      setToken(authData.token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password); // calls backend
      const decoded = jwtDecode(data.token);
      const authData = {
        token: data.token,
        user: decoded.userId,
      };
      setUser(decoded.userId);
      setToken(data.token);
      localStorage.setItem("auth", JSON.stringify(authData));
      return decoded.userId;
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error(error.message); // let component handle errors
    }
  };

  const setAuthFromToken = (tokenValue) => {
    const decoded = jwtDecode(tokenValue);
    const authData = {
      token: tokenValue,
      user: decoded.userId,
    };
    setUser(decoded.userId);
    setToken(tokenValue);
    localStorage.setItem("auth", JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  const getToken = () => {
    if (token) return token;
    const saved = localStorage.getItem("auth");
    if (saved) {
      const authData = JSON.parse(saved);
      return authData.token;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, getToken, setAuthFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};
