/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import API_URL from "../../services/api";

const OrderItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState({
    order_id: "",
    item_name: "",
    item_id: "",
    size_id: "",
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  // ================= FETCH =================
  const fetchData = async (page = 1) => {
    try {
      setLoading(true);

      const response = await API_URL.get("/order_items/list", {
        params: {
          page,
          order_id: search.order_id,
          item_name: search.item_name,
          item_id: search.item_id,
          size_id: search.size_id,
        },
      });

      const res = response.data;

      setItems(res.data?.data || []);

      setPagination({
        current_page: res.data?.current_page || 1,
        last_page: res.data?.last_page || 1,
      });

    } catch (error) {
      console.error("Fetch Error:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await API_URL.delete(`/order_items/${id}`);
      fetchData(pagination.current_page);
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Delete Failed");
    }
  };

  // ================= SEARCH =================
  const handleSearch = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  // ================= USE EFFECT =================
  useEffect(() => {
    fetchData(1);
  }, [search]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <h1 className="text-xl font-bold text-[#6f4e37]">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f5ebe0] min-h-screen">

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#6f4e37] text-white p-4">
          <h1 className="text-xl font-bold">Order Items</h1>
        </div>

        {/* SEARCH */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">

          <input
            name="order_id"
            placeholder="Order ID"
            onChange={handleSearch}
            className="border p-2 rounded"
          />

          <input
            name="item_name"
            placeholder="Item Name"
            onChange={handleSearch}
            className="border p-2 rounded"
          />

          <input
            name="item_id"
            placeholder="Item ID"
            onChange={handleSearch}
            className="border p-2 rounded"
          />

          <input
            name="size_id"
            placeholder="Size ID"
            onChange={handleSearch}
            className="border p-2 rounded"
          />

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-[#ede0d4]">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Item</th>
                <th className="p-3">Size</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Price</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>

              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="text-center border-b">

                    <td className="p-2">{item.order?.id}</td>
                    <td className="p-2">{item.item?.name}</td>
                    <td className="p-2">{item.size?.size_name}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">${item.price}</td>

                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No Data Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 p-4">

          <button
            disabled={pagination.current_page === 1}
            onClick={() => fetchData(pagination.current_page - 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Prev
          </button>

          <span>
            {pagination.current_page} / {pagination.last_page}
          </span>

          <button
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => fetchData(pagination.current_page + 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default OrderItem;