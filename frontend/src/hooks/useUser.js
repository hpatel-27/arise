import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { userService } from "../services/userService";

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await userService.getUserInfo(token);
        setUserInfo(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [getToken]);

  return { userInfo, loading, error };
}
