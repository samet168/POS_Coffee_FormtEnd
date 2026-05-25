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

      setStats(resStats.data.data || {
        total_users: 0,
        total_items: 0,
      });

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
    <div className="min-h-screen bg-[#f5ebe0] p-6">

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#d6ccc2] relative">

        {/* ================= LOADING OVERLAY ================= */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
              <div className="w-6 h-6 border-4 border-[#6f4e37] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[#6f4e37] font-semibold">
                Loading Dashboard...
              </span>
            </div>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="bg-[#6f4e37] text-white p-6">
          <h1 className="text-2xl font-bold">
            ☕ Coffee Admin Dashboard
          </h1>
          <p className="text-[#ede0d4] text-sm mt-1">
            Overview of your coffee system
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

          <div className="bg-white p-5 rounded-2xl shadow border-l-8 border-[#6f4e37]">
            <h2 className="text-gray-500">Total Users</h2>
            <p className="text-3xl font-bold text-[#6f4e37]">
              {stats.total_users}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border-l-8 border-[#b08968]">
            <h2 className="text-gray-500">Total Items</h2>
            <p className="text-3xl font-bold text-[#6f4e37]">
              {stats.total_items}
            </p>
          </div>

        </div>

        {/* ================= USERS TABLE ================= */}
        <div className="p-6">

          <div className="bg-[#6f4e37] text-white p-4 rounded-t-2xl font-bold">
            👤 Latest Users
          </div>

          <div className="overflow-x-auto bg-white rounded-b-2xl shadow">

            <table className="w-full">

              <thead className="bg-[#ede0d4] text-[#6f4e37]">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                </tr>
              </thead>

              <tbody>

                {!loading && users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-[#faf7f2]"
                    >
                      <td className="p-3 font-medium text-[#4e342e]">
                        {user.name}
                      </td>

                      <td className="p-3 text-gray-700">
                        {user.email}
                      </td>

                      <td className="p-3">
                        <span className="bg-[#ddb892] text-[#4e342e] px-3 py-1 rounded-full text-sm font-semibold">
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center p-6 text-gray-500">
                      No Users Found
                    </td>
                  </tr>
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