import { NavLink } from "react-router-dom";

// នាំចូល Icon របស់អ្នក
import homeIcon from "../assets/icon/homepage.png";
import menuIcon from "../assets/icon/menu.png"; // ប្តូរទៅតាម path របស់អ្នក


const menuItems = [
  { name: "ទំព័រដើម", icon: homeIcon, path: "/" },
  { name: "ម៉ឺនុយ", icon: menuIcon, path: "/menu" },
  
];

export default function Sidebar({ open, setOpen }) {
  
  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-[#c98e5f] text-white shadow-md shadow-[#c98e5f]/20"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
    >
      {/* បង្ហាញ Icon ប្រសិនបើមាន */}
      {item.icon && (
        <img 
          src={item.icon} 
          alt={item.name} 
          className="w-5 h-5 object-contain" 
        />
      )}
      {item.name}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 p-4 flex-col h-screen">
        <h2 className="text-xs uppercase font-bold text-gray-400 px-3 mb-4 tracking-wider">
          ការគ្រប់គ្រង
        </h2>
        <nav className="space-y-1">
          {menuItems.map((item) => <NavItem key={item.path} item={item} />)}
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs uppercase font-bold text-gray-400 tracking-wider">ការគ្រប់គ្រង</h2>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800 text-xl">✕</button>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => <NavItem key={item.path} item={item} />)}
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}
    </>
  );
}