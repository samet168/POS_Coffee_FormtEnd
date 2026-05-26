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

  // ================= FETCH =================
  const fetchInvoices = useCallback(async (page = 1, searchParams) => {

    try {

      setLoading(true);

      const res = await API_URL.get("/invoices/list", {
        params: {
          page,
          ...searchParams,
        },
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

  // ================= FIRST LOAD =================
  useEffect(() => {

    fetchInvoices(1, search);

  }, []);

  // ================= SEARCH =================
  useEffect(() => {

    const delay = setTimeout(() => {

      fetchInvoices(1, search);

    }, 500);

    return () => clearTimeout(delay);

  }, [search]);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {

    setSearch((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  // ================= CLEAR DATE =================
  const handleClearDate = () => {

    setSearch({
      date_from: "",
      date_to: "",
    });

  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    if (!window.confirm("Delete invoice?")) return;

    try {

      await API_URL.delete(`/invoices/${id}`);

      fetchInvoices(
        pagination.current_page,
        search
      );

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Delete failed"
      );

    }

  };

  return (

    <div className="p-3 sm:p-6 bg-[#f5ebe0] min-h-screen">

      {/* HEADER */}
      <div className="bg-[#6f4e37] text-white p-4 rounded-2xl mb-5 shadow">

        <h1 className="text-xl sm:text-2xl font-bold">
          ☕ Invoice Management
        </h1>

      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">

        <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 w-full sm:w-auto">

          <label className="text-sm text-gray-500 whitespace-nowrap">
            ពី:
          </label>

          <input
            type="date"
            name="date_from"
            value={search.date_from}
            onChange={handleChange}
            className="w-full text-sm focus:outline-none"
          />

        </div>

        <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 w-full sm:w-auto">

          <label className="text-sm text-gray-500 whitespace-nowrap">
            ដល់:
          </label>

          <input
            type="date"
            name="date_to"
            value={search.date_to}
            min={search.date_from}
            onChange={handleChange}
            className="w-full text-sm focus:outline-none"
          />

        </div>

        {(search.date_from || search.date_to) && (

          <button
            onClick={handleClearDate}
            className="text-red-500 hover:text-red-700 text-sm underline"
          >
            លុបកាលបរិច្ឆេទ
          </button>

        )}

      </div>

      {/* MOBILE VIEW */}
      <div className="block md:hidden space-y-4">

        {loading ? (

          <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-400">
            Loading...
          </div>

        ) : invoices.length > 0 ? (

          invoices.map((inv) => (

            <div
              key={inv.id}
              className="bg-white rounded-2xl shadow p-4 space-y-3"
            >

              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">
                  Invoice No
                </span>

                <span className="font-bold text-[#6f4e37]">
                  {inv.invoice_no}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">
                  Total
                </span>

                <span className="font-semibold">
                  $
                  {parseFloat(
                    inv.total_amount || 0
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">
                  Status
                </span>

                <span>
                  {inv.payment_status_id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">
                  Type
                </span>

                <span>
                  {inv.payment_type_id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">
                  Date
                </span>

                <span className="text-sm">
                  {new Date(
                    inv.created_at
                  ).toLocaleDateString("km-KH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <button
                onClick={() => handleDelete(inv.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm"
              >
                Delete
              </button>

            </div>

          ))

        ) : (

          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
            No Invoices Found
          </div>

        )}

      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead className="bg-[#ede0d4] text-[#6f4e37]">

            <tr>
              <th className="p-4 text-left">
                Invoice No
              </th>

              <th className="p-4">
                Total
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Type
              </th>

              <th className="p-4">
                Date
              </th>

              <th className="p-4">
                Action
              </th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-400"
                >
                  Loading...
                </td>

              </tr>

            ) : invoices.length > 0 ? (

              invoices.map((inv) => (

                <tr
                  key={inv.id}
                  className="border-b hover:bg-amber-50 transition-colors text-center"
                >

                  <td className="p-4 text-left font-medium">
                    {inv.invoice_no}
                  </td>

                  <td className="p-4">
                    $
                    {parseFloat(
                      inv.total_amount || 0
                    ).toFixed(2)}
                  </td>

                  <td className="p-4">
                    {inv.payment_status_id}
                  </td>

                  <td className="p-4">
                    {inv.payment_type_id}
                  </td>

                  <td className="p-4 text-sm text-gray-500">

                    {new Date(
                      inv.created_at
                    ).toLocaleDateString("km-KH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="p-8 text-center text-gray-400"
                >
                  No Invoices Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-5">

        <button
          disabled={
            pagination.current_page === 1 ||
            loading
          }
          onClick={() =>
            fetchInvoices(
              pagination.current_page - 1,
              search
            )
          }
          className="w-full sm:w-auto px-4 py-2 bg-white border rounded-xl text-sm disabled:opacity-40"
        >
          ← Prev
        </button>

        <span className="text-sm text-gray-600">
          {pagination.current_page} / {pagination.last_page}
        </span>

        <button
          disabled={
            pagination.current_page ===
              pagination.last_page ||
            loading
          }
          onClick={() =>
            fetchInvoices(
              pagination.current_page + 1,
              search
            )
          }
          className="w-full sm:w-auto px-4 py-2 bg-white border rounded-xl text-sm disabled:opacity-40"
        >
          Next →
        </button>

      </div>

    </div>

  );
};

export default Invoice;