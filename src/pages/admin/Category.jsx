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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await API_URL.delete(`/item-categories/${id}`);

      alert("Delete Success");

      fetchCategories(currentPage, search);
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ebe0] p-6">

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#d6ccc2] relative">

        {/* ================= LOADING OVERLAY ================= */}
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

          <h1 className="text-2xl font-bold">
            ☕ Category Management
          </h1>

          <div className="flex items-center gap-3">

            {/* ================= SEARCH ================= */}
            <div className="relative">

              <input
                type="text"
                placeholder="Search category..."
                value={search}
                onChange={handleSearch}
                className="w-64 pl-10 pr-10 py-2 rounded-xl text-black outline-none focus:ring-2 focus:ring-[#ede0d4]"
              />

              <span className="absolute left-3 top-2.5 text-gray-400">
                
              </span>

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

            {/* ================= ADD ================= */}
            <Link
              to="/dashboard/category/add"
              className="bg-[#ede0d4] text-[#6f4e37] px-5 py-2 rounded-xl hover:bg-white transition font-semibold text-sm"
            >
              + Add
            </Link>

          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-[#ede0d4] text-[#6f4e37]">
              <tr>
                <th className="py-4 px-4 text-left">#</th>
                <th className="py-4 px-4 text-left">Category Name</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {!loading && categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="border-b border-[#f1e3d3] hover:bg-[#faf7f2]"
                  >
                    <td className="py-4 px-4 text-gray-500">
                      {(currentPage - 1) * 20 + index + 1}
                    </td>

                    <td className="py-4 px-4 font-medium text-[#4e342e]">
                      {category.name}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-3">

                        <Link
                          to={`/dashboard/category/edit/${category.id}`}
                          className="bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#9c6644]"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(category.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#faf7f2]">

          <button
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="bg-[#6f4e37] text-white px-5 py-2 rounded-xl disabled:opacity-40"
          >
            ← Prev
          </button>

          <span className="text-sm font-medium text-[#6f4e37]">
            Page {currentPage} of {pagination.last_page || 1}
          </span>

          <button
            disabled={
              currentPage === pagination.last_page || loading
            }
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="bg-[#6f4e37] text-white px-5 py-2 rounded-xl disabled:opacity-40"
          >
            Next →
          </button>

        </div>

      </div>
    </div>
  );
};

export default Category;