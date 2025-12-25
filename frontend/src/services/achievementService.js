const API_URL = import.meta.env.VITE_API_URL || "http://localhost";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1";

export const achievementService = {
  async getAll(token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/achievements`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch achievements");
    return res.json();
  },

  async getById(id, token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/achievements/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch achievement");
    return res.json();
  },
};
