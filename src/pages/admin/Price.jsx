/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../services/api";

const Price = () => {
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const [loading, setLoading] = useState(true);

  // ================= FETCH PRICES =================
  const fetchPrices = async (page = 1, searchText = search) => {
    try {
      setLoading(true);

      const response = await API_URL.get(
        `/item-size-prices/list?page=${page}&search=${searchText}`
      );

      const data = response.data;

      setPrices(data.data || []);

      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
      });
    } catch (error) {
      console.error(error);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("☕ Delete this price?");
    if (!confirmDelete) return;

    try {
      await API_URL.delete(`/item-size-prices/${id}`);

      alert("☕ Delete Success");

      fetchPrices(pagination.current_page, search);
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  // ================= FIRST LOAD =================
  useEffect(() => {
    fetchPrices(1, search);
  }, []);

  // ================= SEARCH (DEBOUNCE) =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPrices(1, search);
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

          <div>
            <h1 className="text-3xl font-bold">☕ Product Prices</h1>
            <p className="text-[#ede0d4] text-sm mt-1">
              Manage coffee prices and sizes
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* ================= SEARCH ================= */}
            <div className="relative">

              <input
                type="text"
                placeholder="Search product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-10 py-2 rounded-xl text-black outline-none shadow-sm focus:ring-2 focus:ring-[#ede0d4]"
              />

              {/* icon */}
              <span className="absolute left-3 top-2.5 text-gray-400">
                
              </span>

              {/* clear */}
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2 text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
              )}

            </div>

            {/* ================= ADD BUTTON ================= */}
            <Link
              to="/dashboard/product-Prices/add"
              className="bg-[#ede0d4] text-[#6f4e37] px-5 py-2 rounded-xl hover:bg-white transition font-semibold shadow"
            >
              + Add Price
            </Link>

          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto relative">

          <table className="min-w-full">

            <thead className="bg-[#ede0d4] text-[#6f4e37]">
              <tr>
                <th className="py-4 px-4 text-left">#</th>
                <th className="py-4 px-4 text-left">Product</th>
                <th className="py-4 px-4 text-left">Size</th>
                <th className="py-4 px-4 text-left">Code</th>
                <th className="py-4 px-4 text-left">Price</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {prices.length > 0 ? (
                prices.map((price, index) => (
                  <tr
                    key={price.id}
                    className="border-b border-[#f1e3d3] hover:bg-[#faf7f2]"
                  >
                    <td className="py-4 px-4">{index + 1}</td>

                    <td className="py-4 px-4 font-semibold text-[#4e342e]">
                      {price.item?.name}
                    </td>

                    <td className="py-4 px-4">
                      {price.size?.size_name}
                    </td>

                    <td className="py-4 px-4">
                      {price.size?.size_code}
                    </td>

                    <td className="py-4 px-4 font-bold text-[#9c6644]">
                      ${price.price}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-3">

                        <Link
                          to={`/dashboard/product-Prices/edit/${price.id}`}
                          className="bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#9c6644]"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(price.id)}
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
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    ☕ No Prices Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-between items-center px-6 py-5 bg-[#faf7f2]">

          <button
            disabled={pagination.current_page === 1}
            onClick={() =>
              fetchPrices(pagination.current_page - 1, search)
            }
            className="bg-[#6f4e37] text-white px-5 py-2 rounded-xl disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-bold text-[#6f4e37]">
            Page {pagination.current_page} of {pagination.last_page}
          </span>

          <button
            disabled={
              pagination.current_page === pagination.last_page
            }
            onClick={() =>
              fetchPrices(pagination.current_page + 1, search)
            }
            className="bg-[#6f4e37] text-white px-5 py-2 rounded-xl disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default Price;