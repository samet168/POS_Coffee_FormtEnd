/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../services/api";

const ProductList = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async (searchText = search) => {
    try {
      setLoading(true);

      const response = await API_URL.get(
        `/items/list?search=${searchText}`
      );

      setCategories(response.data.data || []);
    } catch (error) {
      console.error(error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "☕ តើអ្នកចង់លុប Product នេះមែនទេ?"
    );

    if (!confirmDelete) return;

    try {
      await API_URL.delete(`/items/${id}`);

      alert("☕ Delete Success");

      fetchProducts(search);
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // ================= FIRST LOAD =================
  useEffect(() => {
    fetchProducts(search);
  }, []);

  // ================= SEARCH (DEBOUNCE) =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(search);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

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

          <h1 className="text-3xl font-bold">
            ☕ Product Management
          </h1>

          <div className="flex items-center gap-3">

            {/* ================= SEARCH ================= */}
            <div className="relative">

              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-10 py-2 rounded-xl text-black outline-none focus:ring-2 focus:ring-[#ede0d4]"
              />

              <span className="absolute left-3 top-2.5 text-gray-400">
                
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

            {/* ================= ADD ================= */}
            <Link
              to="/dashboard/product-list/add"
              className="bg-[#ede0d4] text-[#6f4e37] px-5 py-2 rounded-xl hover:bg-white transition font-semibold"
            >
              + Add Product
            </Link>

          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-6 space-y-8">

          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.category_id}
                className="bg-[#faf7f2] rounded-3xl p-5 border border-[#ede0d4]"
              >

                {/* Category Header */}
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-[#6f4e37]">
                    ☕ {category.category_name}
                  </h2>

                  <p className="text-gray-500">
                    {category.items_count} Products
                  </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {category.items.length > 0 ? (
                    category.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#ede0d4] hover:scale-[1.02] transition"
                      >

                        {/* IMAGE */}
                        <div className="h-52 bg-[#f5ebe0]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* BODY */}
                        <div className="p-5">

                          <h3 className="text-xl font-bold text-[#4e342e] mb-2">
                            {item.name}
                          </h3>

                          {/* STATUS */}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.status === "In Stock"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>

                          {/* PRICES */}
                          <div className="space-y-2 my-4">

                            {item.prices?.map((price, index) => (
                              <div
                                key={index}
                                className="flex justify-between bg-[#faf7f2] px-3 py-2 rounded-lg"
                              >
                                <span className="font-medium text-[#6f4e37]">
                                  {price.size}
                                </span>

                                <span className="font-bold text-[#9c6644]">
                                  ${price.price}
                                </span>
                              </div>
                            ))}

                          </div>

                          {/* ACTIONS */}
                          <div className="flex gap-3">

                            <Link
                              to={`/dashboard/product-list/edit/${item.id}`}
                              className="flex-1 bg-[#b08968] text-white text-center py-2 rounded-xl hover:bg-[#9c6644]"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                            >
                              Delete
                            </button>

                          </div>

                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">
                      No products found
                    </div>
                  )}

                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500 text-xl">
              ☕ No Products Found
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductList;