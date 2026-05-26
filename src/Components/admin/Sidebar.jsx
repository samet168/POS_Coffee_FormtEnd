import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// ================= ICON IMPORTS =================
import homeIcon from "../../assets/icon/homepage.png";
import userIcon from "../../assets/icon/user.png";
import productIcon from "../../assets/icon/product.png";
import invoiceIcon from "../../assets/icon/invoice.png";

const MENU = [
  { label: "ទំព័រដើម", icon: homeIcon, to: "/dashboard" },

  { label: "អ្នកប្រើប្រាស់", icon: userIcon, to: "/dashboard/users" },

  {
    label: "ផលិតផល",
    icon: productIcon,

    children: [
      { label: "ប្រភេទ", to: "/dashboard/category" },
      { label: "តម្លៃ", to: "/dashboard/product-prices" },
      { label: "បញ្ជីផលិតផល", to: "/dashboard/product-list" },
    ],
  },

  {
    label: "កម្មង់",
    icon: invoiceIcon,
    to: "/dashboard/invoices",
  },
];

const Sidebar = ({ open, setOpen }) => {

  const location = useLocation();

  const MenuItem = ({ item }) => {

    const [isOpen, setIsOpen] = useState(
      item.children?.some((child) =>
        location.pathname.includes(child.to)
      )
    );

    const isChildActive = item.children?.some((child) =>
      location.pathname.includes(child.to)
    );

    // ================= NORMAL MENU =================
    if (!item.children) {

      return (

        <NavLink
          to={item.to}
          end={item.to === "/dashboard"}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300
            ${
              isActive
                ? "bg-gradient-to-r from-[#7f5539] to-[#9c6644] text-white shadow-lg"
                : "text-[#4e342e] hover:bg-[#f5ebe0]"
            }`
          }
        >

          <img
            src={item.icon}
            className="w-5 h-5 object-contain"
            alt={item.label}
          />

          <span>
            {item.label}
          </span>

        </NavLink>

      );

    }

    // ================= DROPDOWN MENU =================
    return (

      <div className="rounded-2xl overflow-hidden border border-[#ede0d4] bg-white">

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex justify-between items-center px-4 py-3 text-sm font-medium transition-all duration-300
          ${
            isChildActive
              ? "bg-gradient-to-r from-[#7f5539] to-[#9c6644] text-white"
              : "text-[#4e342e] hover:bg-[#f5ebe0]"
          }`}
        >

          <span className="flex items-center gap-3">

            <img
              src={item.icon}
              className="w-5 h-5 object-contain"
              alt={item.label}
            />

            {item.label}

          </span>

          <span
            className={`transition-transform duration-300 text-xs ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>

        </button>

        {/* SUB MENU */}
        <div
          className={`overflow-hidden transition-all duration-300
          ${isOpen ? "max-h-60" : "max-h-0"}`}
        >

          <div className="px-2 py-2 bg-[#fffaf5] space-y-1">

            {item.children.map((child) => (

              <NavLink
                key={child.to}
                to={child.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-2 rounded-xl text-sm transition-all
                  ${
                    isActive
                      ? "bg-[#ddb892] text-[#4e342e] font-semibold"
                      : "text-gray-500 hover:bg-[#f5ebe0]"
                  }`
                }
              >

                • {child.label}

              </NavLink>

            ))}

          </div>

        </div>

      </div>

    );

  };

  return (

    <>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen md:h-screen
          w-[280px] sm:w-72
          bg-[#fffaf5]
          border-r border-[#e6ccb2]
          flex flex-col
          transition-transform duration-300
          shadow-2xl md:shadow-none
          overflow-hidden
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* ================= HEADER ================= */}
        <div className="p-5 border-b border-[#ede0d4] flex items-center gap-3 shrink-0">

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7f5539] to-[#b08968] flex items-center justify-center text-white text-xl shadow-md">
            ☕
          </div>

          <div>

            <h1 className="text-lg font-bold text-[#6f4e37]">
              Coffee POS
            </h1>

            <p className="text-xs text-gray-400">
              Admin System
            </p>

          </div>

        </div>

        {/* ================= MENU ================= */}
        <nav
          className="
            flex-1
            overflow-y-auto
            p-4
            space-y-3
            scrollbar-thin
          "
        >

          {MENU.map((item) => (

            <MenuItem
              key={item.label}
              item={item}
            />

          ))}

        </nav>

        {/* ================= FOOTER ================= */}
        <div className="p-4 border-t border-[#ede0d4] shrink-0">

          <div className="bg-gradient-to-r from-[#7f5539] to-[#9c6644] text-white rounded-2xl p-4 shadow-lg">

            <p className="text-sm opacity-80">
              Coffee Shop
            </p>

            <h2 className="font-bold text-lg">
              POS System ☕
            </h2>

          </div>

        </div>

      </aside>

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (

        <div
          onClick={() => setOpen(false)}
          className="
            fixed inset-0 z-40
            bg-black/40
            backdrop-blur-sm
            md:hidden
          "
        />

      )}

    </>

  );

};

export default Sidebar;