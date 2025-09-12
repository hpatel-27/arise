import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="flex justify-between p-4 bg-gray-700 mb-4">
      <div className="flex items-center space-x-2 pl-2">
        <p className="text-xl font-bold">Arise</p>
        <img
          src="/src/assets/sword-jin-woo.png"
          alt="Pixel art of Sung Jin-Woo's sword"
          className="w-10 h-10"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="bg-blue-400 text-white px-3 py-2 rounded-lg hover:bg-blue-500 transition cursor-pointer"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="bg-blue-400 text-white px-3 py-2 rounded-lg hover:bg-blue-500 transition cursor-pointer"
        >
          About
        </Link>
        <Link
          to="/users"
          className="bg-blue-400 text-white px-3 py-2 rounded-lg hover:bg-blue-500 transition cursor-pointer"
        >
          Users
        </Link>
        <Link
          to="/login"
          className="bg-blue-400 text-white px-3 py-2 rounded-lg hover:bg-blue-500 transition cursor-pointer"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-blue-400 text-white px-3 py-2 rounded-lg hover:bg-blue-500 transition cursor-pointer"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
