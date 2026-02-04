import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      // Get token from URL query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        try {
          // Decode token to get user ID
          const decoded = jwtDecode(token);
          const authData = {
            token: token,
            user: decoded.userId,
          };

          // Save to localStorage
          localStorage.setItem("auth", JSON.stringify(authData));

          // Redirect to home page
          navigate("/home");
        } catch (error) {
          console.error("Error processing OAuth callback:", error);
          navigate("/login");
        }
      } else {
        // No token found, redirect to login
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <AppShell>
      <div className="max-w-md mx-auto py-12">
        <Card>
          <div className="text-center">
            <h2 className="font-pixel text-lg text-primary mb-4">
              Signing you in...
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export default AuthCallback;
