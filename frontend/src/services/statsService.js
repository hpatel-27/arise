const API_URL = import.meta.env.VITE_API_URL || "http://localhost";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1";

export const statsService = {
  async initialize(token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/stats/init`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to initialize stats");
    return res.json();
  },

  async getMyStats(token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/stats/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  },

  async getStatByCategory(categoryId, token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/stats/me/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch stat");
    return res.json();
  },
};
