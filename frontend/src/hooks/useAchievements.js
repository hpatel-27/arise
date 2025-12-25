import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { achievementService } from "../services/achievementService";

export function useAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await achievementService.getAll(token);
        setAchievements(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [getToken]);

  return { achievements, loading, error };
}
