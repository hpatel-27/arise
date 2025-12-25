import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { statsService } from "../services/statsService";

export function useStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await statsService.getMyStats(token);
        setStats(data.stats);
        setError(null);
      } catch (err) {
        // If stats don't exist, try to initialize
        if (err.message.includes("404") || err.message.includes("Failed")) {
          try {
            await statsService.initialize(token);
            const data = await statsService.getMyStats(token);
            setStats(data);
            setError(null);
          } catch (initErr) {
            setError(initErr.message);
          }
        } else {
          setError(err.message);
        }
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getToken]);

  const refresh = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await statsService.getMyStats(token);
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refresh };
}
