/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../services/api";

const User = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (page = 1, searchQuery = "") => {
    try {
      setLoading(true);

      const res = await API_URL.get(
        `/user/list?page=${page}&search=${searchQuery}`
      );

      setUsers(res.data.data || []);
      setPagination(res.data || {});
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search);
  }, [currentPage]);

  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, search);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await API_URL.delete(`/user/${id}`);
      fetchUsers(currentPage, search);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ebe0] p-4 md:p-6">

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#eadccf] overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#6f4e37] text-white p-4 md:p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">

          {/* TITLE */}
          <h1 className="text-xl md:text-2xl font-bold">
            ☕ User Management
          </h1>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

            {/* SEARCH */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="w-full sm:w-64 px-4 py-2 rounded-xl text-black outline-none border border-transparent focus:border-white/30"
            />

            {/* ADD BUTTON */}
            <Link
              to="/dashboard/users/add"
              className="
                w-full sm:w-auto
                flex items-center justify-center
                px-5 py-2 rounded-xl
                bg-[#ede0d4] text-[#6f4e37]
                font-semibold
                hover:bg-white transition
                whitespace-nowrap
              "
            >
              + Add User
            </Link>

          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="p-6 text-center text-[#6f4e37]">
            Loading...
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            {/* HEAD */}
            <thead>
              <tr className="bg-[#f6ede3] text-[#6f4e37] text-sm">

                <th className="p-3 text-left border-b border-[#eadccf]">#</th>
                <th className="p-3 text-left border-b border-[#eadccf]">Image</th>
                <th className="p-3 text-left border-b border-[#eadccf]">Name</th>
                <th className="p-3 text-left border-b border-[#eadccf]">Email</th>
                <th className="p-3 text-left border-b border-[#eadccf]">Role</th>
                <th className="p-3 text-center border-b border-[#eadccf]">Action</th>

              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {users.length > 0 ? (
                users.map((u, i) => (
                  <tr
                    key={u.id}
                    className="hover:bg-[#faf7f2] border-b border-[#f1e6dc]"
                  >

                    <td className="p-3 text-gray-600">
                      {i + 1}
                    </td>

                    <td className="p-3">
                      <img
                        src={
                          u.image ||
                          `https://ui-avatars.com/api/?name=${u.name}`
                        }
                        className="w-11 h-11 rounded-xl border border-[#e7d7c8]"
                      />
                    </td>

                    <td className="p-3 font-medium text-[#3b2a20]">
                      {u.name}
                    </td>

                    <td className="p-3 text-gray-600">
                      {u.email}
                    </td>

                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-[#e7d7c8] text-[#4e342e]">
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">

                        <Link
                          to={`/dashboard/users/edit/${u.id}`}
                          className="px-3 py-1 rounded-lg bg-[#b08968] text-white text-sm hover:bg-[#9c6644]"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(u.id)}
                          className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    No Users Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4 bg-[#faf7f2]">

          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#6f4e37] text-white rounded-xl disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-[#6f4e37] font-semibold">
            Page {currentPage}
          </span>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === pagination.last_page}
            className="px-4 py-2 bg-[#6f4e37] text-white rounded-xl disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default User;