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
  { label: "កម្មង់", icon: invoiceIcon, to: "/dashboard/invoices" },
];

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();

  const MenuItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // ពិនិត្យមើលថា តើទំព័រនេះស្ថិតក្នុង Dropdown ដែរឬទេ
    const isChildActive = item.children?.some(child => location.pathname.includes(child.to));

    if (!item.children) {
      return (
        <NavLink 
          to={item.to} 
          end={item.to === "/dashboard"} // ប្រើ end សម្រាប់ទំព័រដើម
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-[#7f5539] text-white shadow-md" : "text-[#4e342e] hover:bg-[#f5ebe0]"}`}
          onClick={() => setOpen(false)}
        >
          <img src={item.icon} className="w-5 h-5" alt={item.label} />
          {item.label}
        </NavLink>
      );
    }

    return (
      <div className="rounded-xl overflow-hidden border border-[#ede0d4]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex justify-between items-center px-4 py-3 text-sm font-medium transition-all ${isChildActive ? "bg-[#7f5539] text-white" : "text-[#4e342e] hover:bg-[#f5ebe0]"}`}
        >
          <span className="flex items-center gap-3">
            <img src={item.icon} className="w-5 h-5" alt={item.label} />
            {item.label}
          </span>
          <span className={`text-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60" : "max-h-0"}`}>
          <div className="px-2 pb-2 pt-1 space-y-1 bg-[#fffaf5]">
            {item.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) => `block px-8 py-2 rounded-lg text-sm transition-all ${isActive ? "bg-[#ddb892] text-[#4e342e] font-semibold" : "text-gray-500 hover:bg-[#f5ebe0]"}`}
                onClick={() => setOpen(false)}
              >
                · {child.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* SIDEBAR CONTAINER */}
      <aside className={`fixed md:relative z-50 w-64 h-screen bg-[#fffaf5] border-r border-[#e6ccb2] flex flex-col transition-transform ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-[#ede0d4] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7f5539] rounded-xl flex items-center justify-center text-white">☕</div>
          <div>
            <h1 className="text-base font-bold text-[#6f4e37]">Coffee POS</h1>
            <p className="text-xs text-gray-400">Admin System</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {MENU.map((item) => <MenuItem key={item.label} item={item} />)}
        </nav>

        <div className="p-4 border-t border-[#ede0d4]">
          <div className="bg-[#7f5539] text-white px-4 py-3 rounded-xl text-sm font-medium">Coffee Shop POS</div>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />}
    </>
  );
};

export default Sidebar;