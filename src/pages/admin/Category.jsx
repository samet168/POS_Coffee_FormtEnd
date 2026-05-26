/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../services/api";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const debounceRef = useRef(null);

  // ================= FETCH =================
  const fetchCategories = useCallback(async (page = 1, searchQuery = "") => {
    try {
      setLoading(true);

      const res = await API_URL.get(`/item-categories/list`, {
        params: { page, name: searchQuery },
      });

      setCategories(res.data.data.data || []);
      setPagination(res.data.data || {});
    } catch (error) {
      console.error(error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= FIRST LOAD =================
  useEffect(() => {
    fetchCategories(currentPage, search);
  }, [currentPage]);

  // ================= SEARCH (DEBOUNCE) =================
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchCategories(1, value);
    }, 400);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure?");
    if (!ok) return;

    try {
      await API_URL.delete(`/item-categories/${id}`);
      alert("Deleted");
      fetchCategories(currentPage, search);
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ebe0] p-4 md:p-6">

      {/* CONTAINER */}
      <div className="bg-white/95 rounded-2xl shadow-md border border-[#e8d8c8]/60 overflow-hidden relative">

        {/* LOADING */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white px-5 py-3 rounded-xl shadow flex items-center gap-3 border border-[#e8d8c8]/60">
              <div className="w-5 h-5 border-4 border-[#6f4e37] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[#6f4e37] font-semibold">
                Loading...
              </span>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="bg-[#6f4e37] text-white p-4 md:p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">

          <h1 className="text-xl md:text-2xl font-bold">
            ☕ Category Management
          </h1>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

            {/* SEARCH */}
            <div className="relative w-full md:w-64">

              <input
                type="text"
                placeholder="Search category..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-3 pr-8 py-2 rounded-xl text-black outline-none border border-[#e8d8c8] focus:ring-2 focus:ring-[#ddb892]"
              />

              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    fetchCategories(1, "");
                  }}
                  className="absolute right-3 top-2 text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
              )}

            </div>

            {/* ADD BUTTON */}
            <Link
              to="/dashboard/category/add"
              className="bg-[#ddb892] text-[#4e342e] px-4 py-2 rounded-xl font-semibold text-center hover:bg-white transition border border-[#e8d8c8]/60"
            >
              + Add Category
            </Link>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-[#ede0d4] text-[#4e342e]">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Category Name</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {!loading && categories.length > 0 ? (
                categories.map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#f3e6d8]/50 hover:bg-[#faf7f2] transition"
                  >
                    <td className="p-3 text-gray-500">
                      {(currentPage - 1) * 20 + i + 1}
                    </td>

                    <td className="p-3 font-medium text-[#4e342e]">
                      {c.name}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">

                        <Link
                          to={`/dashboard/category/edit/${c.id}`}
                          className="px-3 py-1 rounded-lg bg-[#b08968] text-white border border-[#e8d8c8]/40"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-3 py-1 rounded-lg bg-red-500 text-white border border-red-300"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4 bg-[#faf7f2] border-t border-[#e8d8c8]/60">

          <button
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-[#6f4e37] text-white rounded-xl disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-[#6f4e37] font-bold text-sm">
            Page {currentPage} / {pagination.last_page || 1}
          </span>

          <button
            disabled={currentPage === pagination.last_page || loading}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-[#6f4e37] text-white rounded-xl disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default Category;