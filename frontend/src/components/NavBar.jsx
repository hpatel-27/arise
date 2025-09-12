import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="flex justify-between p-4 mb-4 bg-gray-800/40 backdrop-blur-lg border border-gray-700/40 shadow-lg">
      <div className="flex items-center space-x-2 pl-2">
        <p className="text-xl font-bold text-gray-100">Arise</p>
        <img
          src="/src/assets/sword-jin-woo.png"
          alt="Pixel art of Sung Jin-Woo's sword"
          className="w-10 h-10"
        />
      </div>
      <div className="flex items-center space-x-4">
        {["Home", "About", "Users", "Login", "Register"].map((label) => (
          <Link
            key={label}
            to={`/${label.toLowerCase() === "home" ? "" : label.toLowerCase()}`}
            className="px-3 py-2 rounded-lg bg-gray-600/50 text-gray-100 hover:bg-gray-700/70 transition-colors"
          >
            {" "}
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
