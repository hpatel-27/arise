import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginService } from "../services/authService";

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
      console.log("Login successful:", data);
      setUser(data.userId);
      localStorage.setItem("auth", JSON.stringify(data));
      return data.userId;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid email or password"); // let component handle errors
    }
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};
