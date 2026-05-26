/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ICONS
import profileIcon from "../assets/icon/user.png";
import editIcon from "../assets/icon/edit.png";
import logoutIcon from "../assets/icon/logout.png";
import logo from "../assets/icon/Logo.png";

const Navbar = ({ setOpen }) => {
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) setUser(JSON.parse(localUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white px-4 md:px-6 py-3 flex justify-between items-center shadow-sm border-b relative">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        <img src={logo} alt="logo" className="h-10 md:h-12" />
      </div>

      {/* RIGHT USER */}
      <div className="relative">

        {user ? (
          <div
            onClick={() => setDropdown(!dropdown)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-[10px] text-green-600">Online</p>
            </div>

            <img
              src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border object-cover"
            />
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}

        {/* DROPDOWN */}
        {dropdown && user && (
          <div className="absolute right-0 mt-3 w-56 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">

            <div className="p-3 border-b">
              <p className="font-bold">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <Link
              to="/profile"
              onClick={() => setDropdown(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm"
            >
              <img src={profileIcon} className="w-5 h-5" />
              Profile
            </Link>

            <Link
              to="/profile/edit"
              onClick={() => setDropdown(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm"
            >
              <img src={editIcon} className="w-5 h-5" />
              Edit Profile
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-sm border-t"
            >
              <img src={logoutIcon} className="w-5 h-5" />
              Logout
            </button>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;