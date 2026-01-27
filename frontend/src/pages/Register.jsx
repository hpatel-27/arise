import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { AppShell } from "../components/layout/AppShell";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ToastContainer } from "react-toastify";
import { defaultNotification } from "../utils/notify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/home");
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    const errors = [];
    if (password !== confirmPassword) errors.push("Passwords do not match!");
    if (password.length < 8)
      errors.push("Password must be at least 8 characters long!");
    if (!email.includes("@")) errors.push("Invalid email format!");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((err) => console.error(err));
      setIsSubmitting(false);
      defaultNotification(errors.join(" "), "error");
      return;
    }

    try {
      // Register this user with their user
      await register(email, password);
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      defaultNotification(`Registration failed: ${error.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto py-12">
        <Card>
          <div className="text-center mb-6">
            <img
              alt="Pixel art of Sung Jin-Woo's sword"
              src="/src/assets/sword-jin-woo.png"
              className="mx-auto h-12 w-auto mb-4"
            />
            <h2 className="font-pixel text-lg text-primary">Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-pixel text-xs text-white mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-pixel text-xs text-white mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password (min 8 characters)"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="block font-pixel text-xs text-white mb-2"
              >
                Confirm Password
              </label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center font-pixel text-xs text-white opacity-80">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-accent">
              Sign in here
            </Link>
          </p>
        </Card>
      </div>
      <ToastContainer />
    </AppShell>
  );
};

export default Register;
