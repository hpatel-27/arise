import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginService } from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      setUser(JSON.parse(saved).user);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password); // calls backend
      const decoded = jwtDecode(data.token);
      setUser(decoded.userId);
      localStorage.setItem("auth", JSON.stringify(data));
      return decoded.userId;
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error(error.message); // let component handle errors
    }
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};
