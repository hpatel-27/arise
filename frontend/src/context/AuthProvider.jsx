import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginService } from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const authData = JSON.parse(saved);
      setUser(authData.user);
      setToken(authData.token);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password); // calls backend
      const decoded = jwtDecode(data.token);
      setUser(decoded.userId);
      setToken(data.token);
      localStorage.setItem("auth", JSON.stringify(data));
      return decoded.userId;
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error(error.message); // let component handle errors
    }
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
    <AuthContext.Provider value={{ user, token, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
