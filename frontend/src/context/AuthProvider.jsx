import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginService } from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Achievement notification queue
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [achievementVisible, setAchievementVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const authData = JSON.parse(saved);
      setUser(authData.user);
      setToken(authData.token);
    }
    setLoading(false);
  }, []);

  // Dequeue and show the next achievement when the current one is dismissed
  useEffect(() => {
    if (!achievementVisible && achievementQueue.length > 0) {
      const [next, ...rest] = achievementQueue;
      setCurrentAchievement(next);
      setAchievementQueue(rest);
      setAchievementVisible(true);

      const timer = setTimeout(() => setAchievementVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [achievementQueue, achievementVisible]);

  const queueAchievements = useCallback((achievements) => {
    if (!achievements || achievements.length === 0) return;
    setAchievementQueue((prev) => [...prev, ...achievements]);
  }, []);

  const dismissAchievement = useCallback(() => {
    setAchievementVisible(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password);
      const decoded = jwtDecode(data.token);
      const authData = { token: data.token, user: decoded.userId };
      setUser(decoded.userId);
      setToken(data.token);
      localStorage.setItem("auth", JSON.stringify(authData));
      queueAchievements(data.unlockedAchievements);
      return decoded.userId;
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error(error.message);
    }
  };

  const setAuthFromToken = (tokenValue) => {
    const decoded = jwtDecode(tokenValue);
    const authData = { token: tokenValue, user: decoded.userId };
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
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        getToken,
        setAuthFromToken,
        queueAchievements,
        currentAchievement,
        achievementVisible,
        dismissAchievement,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
