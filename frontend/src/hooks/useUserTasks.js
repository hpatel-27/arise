import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { userTaskService } from "../services/userTaskService";


export function useUserTasks() {
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken, queueAchievements } = useAuth();

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await userTaskService.getAllActive(token);
        setUserTasks(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [getToken]);

  const assignTask = async (taskId) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      const assignedTask = await userTaskService.assign(taskId, token);
      setUserTasks([...userTasks, assignedTask]);
      return assignedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeTask = async (taskId) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      const result = await userTaskService.complete(taskId, token);
      setUserTasks(userTasks.filter((ut) => ut.taskId !== taskId));
      queueAchievements(result.unlockedAchievements);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const refresh = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await userTaskService.getAllActive(token);
      setUserTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { userTasks, loading, error, assignTask, completeTask, refresh };
}
