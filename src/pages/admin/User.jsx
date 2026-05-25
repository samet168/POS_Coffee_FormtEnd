/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../services/api";

const User = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [typingTimeout, setTypingTimeout] = useState(null);

  // ================= FETCH USERS =================
  const fetchUsers = async (page = 1, searchQuery = "") => {
    try {
      setLoading(true);

      const response = await API_URL.get(
        `/user/list?page=${page}&search=${searchQuery}`
      );

      setUsers(response.data.data || []);
      setPagination(response.data || {});
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FIRST LOAD =================
  useEffect(() => {
    fetchUsers(currentPage, search);
  }, [currentPage]);

  // ================= SEARCH =================
  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      fetchUsers(1, search);
      setCurrentPage(1);
    }, 400);

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [search]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "☕ តើអ្នកប្រាកដជាចង់លុប User នេះមែនទេ?"
    );

    if (!confirmDelete) return;

    try {
      await API_URL.delete(`/user/${id}`);

      alert("☕ Delete Success");

      fetchUsers(currentPage, search);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Delete Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ebe0] p-6">

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#d6ccc2] relative">

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
              <div className="w-6 h-6 border-4 border-[#6f4e37] border-t-transparent rounded-full animate-spin"></div>

              <span className="text-[#6f4e37] font-semibold">
                Loading...
              </span>
            </div>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="bg-[#6f4e37] text-white px-6 py-5 flex justify-between items-center">

          <h1 className="text-3xl font-bold">
            ☕ User Management
          </h1>

          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="relative">

              <input
                type="text"
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-10 py-2 rounded-xl text-black outline-none focus:ring-2 focus:ring-[#ede0d4]"
              />

              <span className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </span>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2 text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
              )}

            </div>

            {/* ADD USER */}
            <Link
              to="/dashboard/users/add"
              className="bg-[#ede0d4] text-[#6f4e37] px-5 py-2 rounded-xl hover:bg-white transition font-semibold"
            >
              + Add User
            </Link>

          </div>

        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-[#ede0d4] text-[#6f4e37]">
              <tr>
                <th className="py-4 px-4 text-left">#</th>
                <th className="py-4 px-4 text-left">Image</th>
                <th className="py-4 px-4 text-left">Name</th>
                <th className="py-4 px-4 text-left">Email</th>
                <th className="py-4 px-4 text-left">Role</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {!loading && users.length > 0 ? (
                users.map((user, index) => (

                  <tr
                    key={user.id}
                    className="border-b border-[#f1e3d3] hover:bg-[#faf7f2] transition"
                  >

                    {/* NUMBER */}
                    <td className="py-4 px-4">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>

                    {/* IMAGE */}
                    <td className="py-4 px-4">

                      <img
                        src={
                          user.image
                            ? `${user.image}?t=${new Date().getTime()}`
                            : `https://ui-avatars.com/api/?name=${user.name}`
                        }
                        alt="profile"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#b08968] shadow"
                      />

                    </td>

                    {/* NAME */}
                    <td className="py-4 px-4 font-medium text-[#4e342e]">
                      {user.name}
                    </td>

                    {/* EMAIL */}
                    <td className="py-4 px-4 text-gray-700">
                      {user.email}
                    </td>

                    {/* ROLE */}
                    <td className="py-4 px-4">

                      <span className="bg-[#ddb892] text-[#4e342e] px-3 py-1 rounded-full text-sm font-semibold">
                        {user.role}
                      </span>

                    </td>

                    {/* ACTION */}
                    <td className="py-4 px-4 text-center">

                      <div className="flex justify-center gap-3">

                        <Link
                          to={`/dashboard/users/edit/${user.id}`}
                          className="bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#9c6644] transition"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500"
                  >
                    ☕ No Users Found
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-between items-center px-6 py-5 bg-[#faf7f2]">

          <button
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="bg-[#6f4e37] text-white px-5 py-2 rounded-xl disabled:opacity-40"
          >
            Previous
          </button>

          <span className="font-bold text-[#6f4e37] text-lg">
            Page {currentPage} of {pagination.last_page || 1}
          </span>

          <button
            disabled={
              currentPage === pagination.last_page || loading
            }
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="bg-[#6f4e37] text-white px-5 py-2 rounded-xl disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
};

export default User;