import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppShell } from "../components/layout/AppShell";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ToastContainer } from "react-toastify";
import { defaultNotification } from "../utils/notify";

const Login = () => {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/home");
    }
  }, [user, loading, navigate]);

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

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white opacity-20"></div>
            <span className="px-4 font-pixel text-xs text-white opacity-60">
              or continue with
            </span>
            <div className="flex-1 border-t border-white opacity-20"></div>
          </div>

          <a
            href="http://localhost:8080/api/v1/auth/google"
            className="block w-full"
          >
            <Button
              type="button"
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </a>

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
