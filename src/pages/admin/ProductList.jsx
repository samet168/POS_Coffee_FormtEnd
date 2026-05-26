/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../services/api";

const ProductList = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (text = search) => {
    try {
      setLoading(true);
      const res = await API_URL.get(`/items/list?search=${text}`);
      setCategories(res.data.data || []);
    } catch (err) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("លុប product នេះមែនទេ?")) return;
    await API_URL.delete(`/items/${id}`);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#f4ede6] p-3 md:p-6">

      {/* CONTAINER */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border overflow-hidden">

        {/* LOADING */}
        {loading && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-50">
            <div className="bg-white px-4 py-3 rounded-xl shadow flex items-center gap-2">
              <div className="w-5 h-5 border-4 border-[#6f4e37] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-[#6f4e37]">Loading...</span>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#6f4e37] to-[#8b5e3c] text-white px-4 md:px-6 py-4 md:py-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">

          <h1 className="text-lg md:text-2xl font-bold">
            ☕ Product Management
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

            {/* SEARCH */}
            <div className="relative w-full sm:w-64">

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product..."
                className="w-full px-3 py-2 rounded-xl text-sm text-black outline-none focus:ring-2 focus:ring-[#d6ccc2]"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2 text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>

            {/* ADD BUTTON */}
            <Link
              to="/dashboard/product-list/add"
              className="bg-[#ede0d4] text-[#6f4e37] px-4 py-2 rounded-xl text-sm font-semibold text-center hover:bg-white transition"
            >
              + Add Product
            </Link>

          </div>
        </div>

        {/* CONTENT */}
        <div className="p-3 md:p-6 space-y-6">

          {categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.category_id}
                className="bg-[#faf7f3] rounded-xl md:rounded-2xl p-4 md:p-5 border border-[#eee0d6]"
              >

                {/* CATEGORY HEADER */}
                <div className="mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-[#5a3d2b]">
                    ☕ {cat.category_name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {cat.items_count} items
                  </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition overflow-hidden"
                    >

                      {/* IMAGE */}
                      <div className="h-40 md:h-48 bg-[#f5ebe0]">
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* BODY */}
                      <div className="p-4 space-y-3">

                        {/* NAME */}
                        <h3 className="text-base md:text-lg font-bold text-[#3b2a20]">
                          {item.name}
                        </h3>

                        {/* STATUS */}
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          item.status === "In Stock"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {item.status}
                        </span>

                        {/* PRICES */}
                        <div className="space-y-2 pt-2">

                          {item.prices?.map((p, i) => (
                            <div
                              key={i}
                              className="flex justify-between bg-[#faf7f3] px-3 py-2 rounded-lg text-sm"
                            >
                              <span className="text-[#6f4e37] font-medium">
                                {p.size}
                              </span>
                              <span className="font-bold text-[#8b5e3c]">
                                ${p.price}
                              </span>
                            </div>
                          ))}

                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 pt-2">

                          <Link
                            to={`/dashboard/product-list/edit/${item.id}`}
                            className="flex-1 bg-[#b08968] hover:bg-[#9c6644] text-white py-2 rounded-lg text-sm text-center transition"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    </div>
                  ))}

                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              ☕ No products found
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductList;