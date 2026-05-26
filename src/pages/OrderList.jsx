/* eslint-disable react-hooks/set-state-in-effect */
import  { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showCash, setShowCash] = useState(false);
  const [cashInput, setCashInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [payingQR, setPayingQR] = useState(false);
  const [payingCash, setPayingCash] = useState(false);

  const navigate = useNavigate();

  // ================= FETCH =================
  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/order_items");

      setOrders(res.data.data.data || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ================= QTY =================
  const handleQtyChange = (item, change) => {
    const newQty = item.quantity + change;

    if (newQty < 1) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === item.id
          ? {
              ...o,
              quantity: newQty,
              sub_total: (
                newQty * parseFloat(o.unit_price)
              ).toFixed(2),
            }
          : o
      )
    );

    api
      .post(`/order_items/${item.id}`, {
        quantity: newQty,
      })
      .catch(() => fetchOrders());
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("លុបមុខម្ហូបនេះ?")) return;

    try {
      await api.delete(`/order_items/${id}`);

      setOrders((prev) =>
        prev.filter((o) => o.id !== id)
      );

    } catch (err) {
      console.error(err);
      fetchOrders();
    }
  };

  // ================= CLEAR ALL =================
  const handleClearAll = async () => {
    if (!window.confirm("លុបទាំងអស់មែនទេ?")) return;

    try {
      await Promise.all(
        orders.map((item) =>
          api.delete(`/order_items/${item.id}`)
        )
      );

      setOrders([]);

    } catch (err) {
      console.error(err);

      fetchOrders();
    }
  };

  // ================= CLOSE PAYMENT =================
  const closePayment = () => {
    setShowPayment(false);
    setShowCash(false);
    setCashInput("");
  };

  // ================= PAYMENT =================
  const handlePayment = async (paymentTypeId) => {
    if (paymentTypeId === 1) {
      setPayingQR(true);
    } else {
      setPayingCash(true);
    }

    try {
      const orderIds = orders.map((o) => o.id);

      const totalPaid =
        paymentTypeId === 2
          ? parseFloat(cashInput)
          : parseFloat(total);

      const res = await api.post("/invoices", {
        order_ids: orderIds,
        payment_type_id: paymentTypeId,
        total_paid: totalPaid,
      });

      setOrders([]);

      closePayment();

      navigate("/success", {
        state: {
          invoiceData: res.data.data,
        },
      });

    } catch (err) {
      console.error(err.response?.data || err);

      alert("ការទូទាត់បានបរាជ័យ");
    } finally {
      setPayingQR(false);
      setPayingCash(false);
    }
  };

  // ================= TOTAL =================
  const total = orders
    .reduce(
      (sum, item) =>
        sum + parseFloat(item.sub_total || 0),
      0
    )
    .toFixed(2);

  const cashNum = parseFloat(cashInput) || 0;

  const totalNum = parseFloat(total);

  const change = cashInput
    ? (cashNum - totalNum).toFixed(2)
    : null;

  const cashSufficient = cashNum >= totalNum;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5ebe0] to-[#ede0d4] pb-32">

      {/* ================= HEADER ================= */}
      <div className="bg-[#6f4e37] px-5 pt-14 pb-8 rounded-b-[40px] shadow-lg">

        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div>
            <p className="text-[#ede0d4] text-sm">
              Welcome
            </p>

            <h1 className="text-3xl font-bold text-white mt-1">
              My Orders
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* CLEAR ALL */}
            {orders.length > 0 && (
              <button
                onClick={handleClearAll}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl text-sm font-medium shadow-md transition"
              >
                🗑 Clear All
              </button>
            )}

            {/* ICON */}
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              ☕
            </div>

          </div>
        </div>

        <p className="text-[#ede0d4] text-sm mt-3">
          Manage your coffee orders easily
        </p>

      </div>

      {/* ================= BODY ================= */}
      <div className="max-w-md mx-auto px-4 -mt-6">

        {/* LOADING */}
        {loading && (
          <div className="bg-white rounded-3xl p-10 shadow-lg text-center">
            <p className="text-gray-400">
              កំពុងទាញទិន្នន័យ...
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-3xl p-10 shadow-lg text-center">

            <div className="text-6xl mb-4">
              🛒
            </div>

            <h2 className="text-xl font-bold text-gray-700 mb-2">
              មិនមានការកម្មង់
            </h2>

            <p className="text-gray-400 text-sm">
              សូមជ្រើសរើសភេសជ្ជៈដែលអ្នកចូលចិត្ត
            </p>

          </div>
        )}

        {/* ORDER LIST */}
        <div className="space-y-4">

          {orders.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-lg p-4 relative border border-[#ede0d4]"
            >

              {/* DELETE */}
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
              >
                ✕
              </button>

              <div className="flex gap-4">

                {/* IMAGE */}
                <img
                  src={item.item.image}
                  alt={item.item.name}
                  className="w-24 h-24 rounded-2xl object-cover border"
                />

                {/* CONTENT */}
                <div className="flex-1">

                  <h3 className="font-bold text-lg text-[#6f4e37]">
                    {item.item.name}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Premium Coffee Drink
                  </p>

                  {/* PRICE + QTY */}
                  <div className="mt-3 flex items-center justify-between">

                    <div>
                      <p className="text-sm text-gray-400">
                        Price
                      </p>

                      <p className="font-bold text-[#b08968] text-lg">
                        ${item.unit_price}
                      </p>
                    </div>

                    {/* QTY */}
                    <div className="flex items-center gap-2 bg-[#faf7f2] rounded-2xl px-2 py-1">

                      <button
                        onClick={() =>
                          handleQtyChange(item, -1)
                        }
                        className="w-8 h-8 rounded-xl bg-white shadow text-gray-700 font-bold"
                      >
                        −
                      </button>

                      <span className="font-bold w-6 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleQtyChange(item, 1)
                        }
                        className="w-8 h-8 rounded-xl bg-[#6f4e37] text-white font-bold"
                      >
                        +
                      </button>

                    </div>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="mt-3 flex justify-between items-center border-t pt-3">

                    <span className="text-sm text-gray-400">
                      Subtotal
                    </span>

                    <span className="font-bold text-green-600">
                      ${item.sub_total}
                    </span>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BOTTOM PAYMENT ================= */}
      {orders.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#ede0d4] shadow-2xl p-4">

          <div className="max-w-md mx-auto">

            <div className="flex justify-between items-center mb-4">

              <div>
                <p className="text-sm text-gray-400">
                  Total Payment
                </p>

                <h2 className="text-3xl font-bold text-[#6f4e37]">
                  ${total}
                </h2>
              </div>

              <div className="text-4xl">
                💳
              </div>

            </div>

            <button
              onClick={() => setShowPayment(true)}
              className="w-full bg-[#6f4e37] hover:bg-[#5c3d2e] text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition"
            >
              ☕ ទូទាត់ឥឡូវនេះ
            </button>

          </div>
        </div>
      )}

      {/* ================= PAYMENT MODAL ================= */}
      {showPayment && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) =>
            e.target === e.currentTarget && closePayment()
          }
        >

          <div className="bg-white rounded-[35px] w-full max-w-sm overflow-hidden shadow-2xl">

            {/* HEADER */}
            <div className="bg-[#6f4e37] text-white px-6 py-5">

              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm text-[#ede0d4]">
                    Payment
                  </p>

                  <h2 className="text-2xl font-bold">
                    ${total}
                  </h2>
                </div>

                <button
                  onClick={closePayment}
                  className="w-9 h-9 rounded-full bg-white/20"
                >
                  ✕
                </button>

              </div>
            </div>

            {/* BODY */}
            <div className="p-6">

              <div className="grid grid-cols-2 gap-4">

                {/* QR */}
                <button
                  onClick={() => handlePayment(1)}
                  disabled={payingQR}
                  className="bg-amber-50 border border-amber-200 rounded-3xl p-5 hover:scale-105 transition"
                >

                  <div className="text-4xl mb-3">
                    📷
                  </div>

                  <h3 className="font-bold text-amber-800">
                    QR Payment
                  </h3>

                  <p className="text-xs text-amber-600 mt-1">
                    ABA · KHQR
                  </p>

                </button>

                {/* CASH */}
                <button
                  onClick={() =>
                    setShowCash((prev) => !prev)
                  }
                  className={`rounded-3xl p-5 border transition
                  ${
                    showCash
                      ? "bg-green-100 border-green-400"
                      : "bg-green-50 border-green-200"
                  }`}
                >

                  <div className="text-4xl mb-3">
                    💵
                  </div>

                  <h3 className="font-bold text-green-800">
                    Cash
                  </h3>

                  <p className="text-xs text-green-600 mt-1">
                    Pay with Cash
                  </p>

                </button>
              </div>

              {/* CASH INPUT */}
              {showCash && (
                <div className="mt-5 bg-[#faf7f2] rounded-3xl p-4 border">

                  <input
                    type="number"
                    placeholder="បញ្ចូលចំនួនលុយ"
                    value={cashInput}
                    onChange={(e) =>
                      setCashInput(e.target.value)
                    }
                    className="w-full border rounded-2xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-[#b08968]"
                  />

                  {change !== null && cashSufficient && (
                    <div className="flex justify-between mb-4">

                      <span className="text-gray-400">
                        អាប់
                      </span>

                      <span className="font-bold text-green-600">
                        ${change}
                      </span>

                    </div>
                  )}

                  {change !== null && !cashSufficient && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                      លុយមិនគ្រប់
                    </p>
                  )}

                  <button
                    onClick={() => handlePayment(2)}
                    disabled={
                      !cashInput ||
                      !cashSufficient ||
                      payingCash
                    }
                    className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-3 rounded-2xl font-bold"
                  >
                    {payingCash
                      ? "កំពុងដំណើរការ..."
                      : "បញ្ជាក់ការទូទាត់"}
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};