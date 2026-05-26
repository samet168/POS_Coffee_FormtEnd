/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import API_URL from "../../services/api";

const Dashboard = () => {

  const [stats, setStats] = useState({
    total_users: 0,
    total_items: 0,
  });

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= FETCH DASHBOARD =================
  const fetchDashboard = async () => {

    try {

      setLoading(true);

      const [resStats, resUsers] = await Promise.all([
        API_URL.get("/dashboard/stats"),
        API_URL.get("/user/list?page=1"),
      ]);

      setStats(
        resStats.data.data || {
          total_users: 0,
          total_items: 0,
        }
      );

      setUsers(resUsers.data.data || []);

    } catch (error) {

      console.error(error);
      setUsers([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchDashboard();

  }, []);

  return (

    <div className="min-h-screen bg-[#f5ebe0] p-3 sm:p-6">

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e3d5ca] relative">

        {/* ================= LOADING ================= */}
        {loading && (

          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">

            <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">

              <div className="w-6 h-6 border-4 border-[#6f4e37] border-t-transparent rounded-full animate-spin"></div>

              <span className="text-[#6f4e37] font-semibold">
                Loading Dashboard...
              </span>

            </div>

          </div>

        )}

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-[#6f4e37] to-[#b08968] text-white p-5 sm:p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-2xl sm:text-4xl font-bold">
                ☕ Coffee Dashboard
              </h1>

              <p className="text-[#f5ebe0] mt-2 text-sm sm:text-base">
                Manage your coffee shop system easily
              </p>

            </div>

            <div className="bg-white/20 px-4 py-3 rounded-2xl backdrop-blur-md">

              <p className="text-sm">
                Welcome Back
              </p>

              <h2 className="font-bold text-lg">
                Admin Panel
              </h2>

            </div>

          </div>

        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 sm:p-6">

          {/* TOTAL USERS */}
          <div className="bg-gradient-to-br from-[#6f4e37] to-[#8d6e63] text-white rounded-3xl p-6 shadow-lg hover:scale-[1.02] transition-transform">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm opacity-80">
                  Total Users
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {stats.total_users}
                </h2>

              </div>

              <div className="text-5xl opacity-20">
                👤
              </div>

            </div>

          </div>

          {/* TOTAL ITEMS */}
          <div className="bg-gradient-to-br from-[#b08968] to-[#ddb892] text-white rounded-3xl p-6 shadow-lg hover:scale-[1.02] transition-transform">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm opacity-80">
                  Total Items
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {stats.total_items}
                </h2>

              </div>

              <div className="text-5xl opacity-20">
                ☕
              </div>

            </div>

          </div>

        </div>

        {/* ================= USERS SECTION ================= */}
        <div className="p-4 sm:p-6">

          <div className="bg-gradient-to-r from-[#6f4e37] to-[#8d6e63] text-white px-5 py-4 rounded-t-3xl flex items-center justify-between">

            <h2 className="font-bold text-lg sm:text-xl">
              👤 Latest Users
            </h2>

            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {users.length} Users
            </span>

          </div>

          {/* ================= MOBILE CARD ================= */}
          <div className="block md:hidden bg-white rounded-b-3xl shadow">

            {!loading && users.length > 0 ? (

              users.map((user) => (

                <div
                  key={user.id}
                  className="border-b p-4 space-y-3 hover:bg-[#faf7f2]"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-bold text-[#4e342e]">
                        {user.name}
                      </h3>

                      <p className="text-sm text-gray-500 break-all">
                        {user.email}
                      </p>

                    </div>

                    <span className="bg-[#ddb892] text-[#4e342e] px-3 py-1 rounded-full text-xs font-semibold">
                      {user.role}
                    </span>

                  </div>

                </div>

              ))

            ) : (

              !loading && (

                <div className="p-6 text-center text-gray-500">
                  No Users Found
                </div>

              )

            )}

          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-b-3xl shadow">

            <table className="w-full">

              <thead className="bg-[#ede0d4] text-[#6f4e37]">

                <tr>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Email
                  </th>

                  <th className="p-4 text-left">
                    Role
                  </th>

                </tr>

              </thead>

              <tbody>

                {!loading && users.length > 0 ? (

                  users.map((user) => (

                    <tr
                      key={user.id}
                      className="border-b hover:bg-[#faf7f2] transition-colors"
                    >

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-[#ddb892] flex items-center justify-center text-[#4e342e] font-bold">
                            {user.name?.charAt(0)}
                          </div>

                          <span className="font-medium text-[#4e342e]">
                            {user.name}
                          </span>

                        </div>

                      </td>

                      <td className="p-4 text-gray-700">
                        {user.email}
                      </td>

                      <td className="p-4">

                        <span className="bg-[#ddb892] text-[#4e342e] px-4 py-1 rounded-full text-sm font-semibold">
                          {user.role}
                        </span>

                      </td>

                    </tr>

                  ))

                ) : (

                  !loading && (

                    <tr>

                      <td
                        colSpan="3"
                        className="text-center p-8 text-gray-500"
                      >
                        No Users Found
                      </td>

                    </tr>

                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;