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
    // Error with the request
    if (response.status === 409) {
      throw new Error("This email is already registered. Please log in.");
    } else if (response.status === 400) {
      throw new Error("Invalid registration details. Please try again.");
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  }
};
