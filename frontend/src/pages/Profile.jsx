import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext); // assuming your AuthContext exposes logged-in user

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-gray-100 p-6">
      {/* Profile Card */}
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-700 p-6">
        {/* Avatar / Icon */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-600">
            {/* You can swap this placeholder with pixel-art avatar */}
            <span className="text-3xl">⚔️</span>
          </div>
          <h1 className="text-xl font-bold mt-4">
            {user?.firstName ?? "Adventurer"}
          </h1>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-600"></div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-700 rounded-lg p-3">
            <h2 className="text-sm text-gray-300">Level</h2>
            <p className="text-lg font-bold">5</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <h2 className="text-sm text-gray-300">XP</h2>
            <p className="text-lg font-bold">1,240</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <h2 className="text-sm text-gray-300">Strength</h2>
            <p className="text-lg font-bold">12</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <h2 className="text-sm text-gray-300">Wisdom</h2>
            <p className="text-lg font-bold">15</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-600"></div>

        {/* Achievements Preview */}
        <div>
          <h2 className="text-lg font-bold mb-2">Achievements</h2>
          <ul className="space-y-2">
            <li className="bg-gray-700 p-2 rounded-md flex items-center">
              <span className="mr-2">🏆</span> First Task Completed
            </li>
            <li className="bg-gray-700 p-2 rounded-md flex items-center">
              <span className="mr-2">📚</span> Learned 10 New Words
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
