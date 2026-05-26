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

  const fetchPrices = async (page = 1, searchText = search) => {
    try {
      setLoading(true);

      const res = await API_URL.get(
        `/item-size-prices/list?page=${page}&search=${searchText}`
      );

      const data = res.data;

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

  const handleDelete = async (id) => {
    const ok = window.confirm("☕ Delete this price?");
    if (!ok) return;

    try {
      await API_URL.delete(`/item-size-prices/${id}`);
      alert("Deleted successfully");
      fetchPrices(pagination.current_page, search);
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchPrices(1, search);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPrices(1, search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#f5ebe0] p-4 md:p-6">

      {/* MAIN CONTAINER */}
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

          <div>
            <h1 className="text-xl md:text-3xl font-bold">
              ☕ Product Prices
            </h1>
            <p className="text-xs md:text-sm text-[#e6ccb2]">
              Manage item size pricing system
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

            {/* SEARCH */}
            <div className="relative w-full md:w-64">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-3 pr-8 py-2 rounded-xl text-black outline-none border border-[#e8d8c8] focus:ring-2 focus:ring-[#ddb892]"
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
              to="/dashboard/product-Prices/add"
              className="bg-[#ddb892] text-[#4e342e] px-4 py-2 rounded-xl font-semibold text-center hover:bg-white transition border border-[#e8d8c8]/60"
            >
              + Add Price
            </Link>

          </div>
        </div>

        {/* TABLE DESKTOP */}
        <div className="hidden md:block overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-[#ede0d4] text-[#4e342e]">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {prices.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-[#f3e6d8]/50 hover:bg-[#faf7f2] transition"
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-semibold text-[#4e342e]">
                    {p.item?.name}
                  </td>
                  <td className="p-3">{p.size?.size_name}</td>
                  <td className="p-3">{p.size?.size_code}</td>
                  <td className="p-3 font-bold text-[#9c6644]">
                    ${p.price}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">

                      <Link
                        to={`/dashboard/product-Prices/edit/${p.id}`}
                        className="px-3 py-1 rounded-lg bg-[#b08968] text-white border border-[#e8d8c8]/40 hover:bg-[#9c6644]"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 border border-red-300"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

        {/* MOBILE CARD */}
        <div className="md:hidden p-3 space-y-3">

          {prices.map((p) => (
            <div
              key={p.id}
              className="bg-[#faf7f2] rounded-xl p-4 border border-[#e8d8c8]/60 shadow-sm"
            >

              <h2 className="font-bold text-[#4e342e]">
                {p.item?.name}
              </h2>

              <p className="text-sm text-gray-600">
                Size: {p.size?.size_name} ({p.size?.size_code})
              </p>

              <p className="font-bold text-[#9c6644] mt-1">
                ${p.price}
              </p>

              <div className="flex gap-2 mt-3">

                <Link
                  to={`/dashboard/product-Prices/edit/${p.id}`}
                  className="flex-1 text-center bg-[#b08968] text-white py-1 rounded-lg border border-[#e8d8c8]/40"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 bg-red-500 text-white py-1 rounded-lg border border-red-300"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4 bg-[#faf7f2] border-t border-[#e8d8c8]/60">

          <button
            disabled={pagination.current_page === 1}
            onClick={() =>
              fetchPrices(pagination.current_page - 1, search)
            }
            className="px-4 py-2 rounded-xl bg-[#6f4e37] text-white disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-[#6f4e37] font-bold">
            {pagination.current_page} / {pagination.last_page}
          </span>

          <button
            disabled={
              pagination.current_page === pagination.last_page
            }
            onClick={() =>
              fetchPrices(pagination.current_page + 1, search)
            }
            className="px-4 py-2 rounded-xl bg-[#6f4e37] text-white disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default Price;