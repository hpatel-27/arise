import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Default notification util
export const defaultNotification = (message, type = "default") => {
  toast(message, {
    theme: "dark",
    position: "bottom-right",
    autoClose: 3000,
    // hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      borderRadius: "12px",
      background: "#1e1e1e", // deep dark gray
      color: "#f5f5f5", // light text
      fontSize: "0.95rem",
      fontWeight: 500,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    },
    progressStyle: {
      background: "#4ade80",
    },
    type, // "success", "error", "info", "warning", or "default"
  });
};
