import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppShell } from "../components/layout/AppShell";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ToastContainer } from "react-toastify";
import { defaultNotification } from "../utils/notify";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (error) {
      defaultNotification(`Login failed: ${error.message}`, "error");
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
            <h2 className="font-pixel text-lg text-primary">Sign In</h2>
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
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center font-pixel text-xs text-white opacity-80">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:text-accent">
              Register here
            </Link>
          </p>
        </Card>
      </div>
      <ToastContainer />
    </AppShell>
  );
};

export default Login;
