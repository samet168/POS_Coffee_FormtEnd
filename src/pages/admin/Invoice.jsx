/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import API_URL from "../../services/api";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    date_from: "",
    date_to: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchInvoices = useCallback(async (page = 1, searchParams) => {
    try {
      setLoading(true);
      const res = await API_URL.get("/invoices/list", {
        params: { page, ...searchParams },
      });
      const data = res.data.data;
      setInvoices(data?.data || []);
      setPagination({
        current_page: data?.current_page || 1,
        last_page: data?.last_page || 1,
      });
    } catch (error) {
      console.error(error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices(1, search);
  }, []); 

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchInvoices(1, search);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const handleChange = (e) => {
    setSearch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClearDate = () => {
    setSearch({ date_from: "", date_to: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete invoice?")) return;
    try {
      await API_URL.delete(`/invoices/${id}`);
      fetchInvoices(pagination.current_page, search);
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-[#f5ebe0] min-h-screen">

      <div className="bg-[#6f4e37] text-white p-4 rounded-xl mb-4">
        <h1 className="text-xl font-bold">☕ Invoices</h1>
      </div>

      {/* DATE FILTER */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
          <label className="text-sm text-gray-500">ពី:</label>
          <input
            type="date"
            name="date_from"
            value={search.date_from}
            onChange={handleChange}
            className="text-sm focus:outline-none"
          />
        </div>

        <span className="text-gray-400">—</span>

        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
          <label className="text-sm text-gray-500">ដល់:</label>
          <input
            type="date"
            name="date_to"
            value={search.date_to}
            min={search.date_from}
            onChange={handleChange}
            className="text-sm focus:outline-none"
          />
        </div>

        {(search.date_from || search.date_to) && (
          <button
            onClick={handleClearDate}
            className="text-sm text-red-400 hover:text-red-600 underline"
          >
            លុបកាលបរិច្ឆេទ
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#ede0d4] text-[#6f4e37]">
            <tr>
              <th className="p-3 text-left">Invoice No</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Type</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">Loading...</td>
              </tr>
            ) : invoices.length > 0 ? (
              invoices.map((inv) => (
                <tr key={inv.id} className="text-center border-b hover:bg-amber-50 transition-colors">
                  <td className="p-3 text-left font-medium">{inv.invoice_no}</td>
                  <td className="p-3">${parseFloat(inv.total_amount || 0).toFixed(2)}</td>
                  <td className="p-3">{inv.payment_status_id}</td>
                  <td className="p-3">{inv.payment_type_id}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(inv.created_at).toLocaleDateString('km-KH', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">No Invoices Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          disabled={pagination.current_page === 1 || loading}
          onClick={() => fetchInvoices(pagination.current_page - 1, search)}
          className="px-4 py-2 bg-white border rounded-lg text-sm disabled:opacity-40"
        >
          ← Prev
        </button>
        <span className="text-sm text-gray-600">
          {pagination.current_page} / {pagination.last_page}
        </span>
        <button
          disabled={pagination.current_page === pagination.last_page || loading}
          onClick={() => fetchInvoices(pagination.current_page + 1, search)}
          className="px-4 py-2 bg-white border rounded-lg text-sm disabled:opacity-40"
        >
          Next →
        </button>
      </div>

    </div>
  );
};

export default Invoice;