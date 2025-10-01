const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;
const REGISTER_URL = import.meta.env.VITE_REGISTER_URL;

export const login = async (email, password) => {
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Login failed", response.statusText);
  }
};

export const register = async (email, password) => {
  const response = await fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Registration failed", response.statusText);
  }
};
