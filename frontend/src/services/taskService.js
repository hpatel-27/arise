const API_URL = import.meta.env.VITE_API_URL || "http://localhost";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1";

export const taskService = {
  async getAll(token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  },

  async getById(id, token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch task");
    return res.json();
  },

  async create(taskData, token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
  },

  async update(id, taskData, token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/tasks/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
  },

  async delete(id, token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to delete task");
    return res.ok;
  },
};
