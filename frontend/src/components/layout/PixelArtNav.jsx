import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export function PixelArtNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { path: "/home", label: "Home" },
    { path: "/tasks", label: "Tasks" },
    { path: "/stats", label: "Stats" },
    { path: "/achievements", label: "Achievements" },
    { path: "/profile", label: "Profile" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav className=" bg-gradient-to-br from-gray-700/70 via-gray-800/70 to-gray-700/30 shadow-lg ">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-pixel text-lg text-primary">ARISE</span>
            <img
              src="/src/assets/sword-jin-woo.png"
              alt="Sword"
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="px-3 py-1 border-2 border-dark bg-background text-white font-pixel text-xs hover:bg-primary hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="primary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="accent">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
