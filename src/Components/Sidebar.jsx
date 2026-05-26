import { NavLink } from "react-router-dom";

// Icons
import homeIcon from "../assets/icon/homepage.png";
import menuIcon from "../assets/icon/menu.png";

const menuItems = [
  {
    name: "ទំព័រដើម",
    icon: homeIcon,
    path: "/",
  },
  {
    name: "ម៉ឺនុយ",
    icon: menuIcon,
    path: "/menu",
  },
];

export default function Sidebar({ open, setOpen }) {

  // ================= NAV ITEM =================
  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-[#c98e5f] text-white shadow-lg shadow-[#c98e5f]/20"
            : "text-gray-600 hover:bg-[#f5ebe0] hover:text-[#6f4e37]"
        }`
      }
    >

      {/* Icon */}
      {item.icon && (
        <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">

          <img
            src={item.icon}
            alt={item.name}
            className="w-5 h-5 object-contain"
          />

        </div>
      )}

      {/* Text */}
      <span>
        {item.name}
      </span>

    </NavLink>
  );

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#ede0d4] p-5 flex-col h-dvh sticky top-0 shadow-sm">

        {/* Logo */}
        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-14 h-14 rounded-2xl bg-[#6f4e37] text-white flex items-center justify-center text-2xl shadow-lg">
              ☕
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#6f4e37]">
                Coffee POS
              </h1>

              <p className="text-xs text-gray-400">
                Management System
              </p>
            </div>

          </div>
        </div>

        {/* Menu Title */}
        <h2 className="text-xs uppercase font-bold text-gray-400 px-3 mb-4 tracking-widest">
          ការគ្រប់គ្រង
        </h2>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">

          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
            />
          ))}

        </nav>

        {/* Bottom Card */}
        <div className="mt-auto bg-gradient-to-br from-[#f5ebe0] to-[#ede0d4] rounded-3xl p-4 border border-[#e6d5c3]">

          <div className="text-3xl mb-2">
            ☕
          </div>

          <h3 className="font-bold text-[#6f4e37] mb-1">
            Coffee Time
          </h3>

          <p className="text-xs text-gray-500 leading-relaxed">
            Manage your coffee shop quickly and easily.
          </p>

        </div>

      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 h-dvh w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden overflow-y-auto
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="p-5">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-[#6f4e37] text-white flex items-center justify-center text-xl">
                ☕
              </div>

              <div>
                <h1 className="font-bold text-[#6f4e37] text-lg">
                  Coffee POS
                </h1>

                <p className="text-xs text-gray-400">
                  Mobile Menu
                </p>
              </div>

            </div>

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-xl bg-[#f5ebe0] text-[#6f4e37] hover:bg-[#ede0d4] transition"
            >
              ✕
            </button>

          </div>

          {/* Menu Title */}
          <h2 className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-4 px-2">
            ការគ្រប់គ្រង
          </h2>

          {/* Navigation */}
          <nav className="space-y-2">

            {menuItems.map((item) => (
              <NavItem
                key={item.path}
                item={item}
              />
            ))}

          </nav>

          {/* Bottom */}
          <div className="mt-10 bg-gradient-to-br from-[#f5ebe0] to-[#ede0d4] rounded-3xl p-5 border border-[#e6d5c3]">

            <div className="text-4xl mb-3">
              ☕
            </div>

            <h3 className="font-bold text-[#6f4e37] text-lg mb-2">
              Coffee Shop
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed">
              Easy and modern POS system for your coffee business.
            </p>

          </div>

        </div>
      </aside>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}
    </>
  );
}