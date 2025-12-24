import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await taskService.getAll(token);
        setTasks(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [getToken]);

  const createTask = async (taskData) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      const newTask = await taskService.create(taskData, token);
      setTasks([...tasks, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      const updatedTask = await taskService.update(id, taskData, token);
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      await taskService.delete(id, token);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask };
}

