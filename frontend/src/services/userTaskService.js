const API_URL = import.meta.env.VITE_API_URL || "http://localhost";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1";

export const userTaskService = {
  async getAllActive(token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/userTasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch user tasks");
    return res.json();
  },

  async getById(taskId, token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/userTasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch user task");
    return res.json();
  },

  async assign(taskId, token) {
    const res = await fetch(
      `${API_URL}${API_PREFIX}/userTasks/${taskId}/assign`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) throw new Error("Failed to assign task");
    return res.json();
  },

  async complete(taskId, token) {
    const res = await fetch(
      `${API_URL}${API_PREFIX}/userTasks/${taskId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) throw new Error("Failed to complete task");
    return res.json();
  },
};
