import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { setAuthFromToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAuthFromToken(token);
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [searchParams, setAuthFromToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="font-pixel text-white">Signing in...</p>
    </div>
  );
};

export default AuthCallback;
