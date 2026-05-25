import { Outlet } from "react-router-dom";
import Navbar from "../Components/admin/Navbar";
import Sidebar from "../Components/admin/Sidebar";
import { useState } from "react";

export default function RootLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5f2]">

    
      <Navbar setOpen={setOpen} />

      <div className="flex flex-1">

        
        <Sidebar open={open} setOpen={setOpen} />

        <main className="flex-1 p-4 md:p-6 bg-[#fcfaf7] overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}