const API_URL = import.meta.env.VITE_API_URL || "http://localhost";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1";

export const userService = {
  async getUserInfo(token) {
    const res = await fetch(`${API_URL}${API_PREFIX}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch user info.");
    return res.json();
  },
};
