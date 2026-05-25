import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showCash, setShowCash] = useState(false);
  const [cashInput, setCashInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [payingQR, setPayingQR] = useState(false);
  const [payingCash, setPayingCash] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get('/order_items');
      setOrders(res.data.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleQtyChange = (item, change) => {
    const newQty = item.quantity + change;
    if (newQty < 1) return;
    setOrders(prev =>
      prev.map(o =>
        o.id === item.id
          ? { ...o, quantity: newQty, sub_total: (newQty * parseFloat(o.unit_price)).toFixed(2) }
          : o
      )
    );
    api.put(`/order_items/${item.id}`, { quantity: newQty }).catch(() => fetchOrders());
  };

  const handleDelete = (id) => {
    if (!window.confirm('លុបមុខម្ហូបនេះ?')) return;
    setOrders(prev => prev.filter(o => o.id !== id));
    api.delete(`/order_items/${id}`).catch(() => fetchOrders());
  };

  const closePayment = () => {
    setShowPayment(false);
    setShowCash(false);
    setCashInput('');
  };

  const handlePayment = async (paymentTypeId) => {
    if (paymentTypeId === 1) setPayingQR(true);
    else setPayingCash(true);
    try {
      const orderIds = orders.map(o => o.id);
      const totalPaid = paymentTypeId === 2 ? parseFloat(cashInput) : parseFloat(total);
      const res = await api.post('/invoices', {
        order_ids: orderIds,
        payment_type_id: paymentTypeId,
        total_paid: totalPaid,
      });
      setOrders([]);
      setCashInput('');
      setShowPayment(false);
      setShowCash(false);
      navigate('/success', { state: { invoiceData: res.data.data } });
    } catch (err) {
      console.error(err.response?.data || err);
      alert('ការទូទាត់បានបរាជ័យ');
    } finally {
      setPayingQR(false);
      setPayingCash(false);
    }
  };

  const total = orders.reduce((sum, item) => sum + parseFloat(item.sub_total || 0), 0).toFixed(2);
  const cashNum = parseFloat(cashInput) || 0;
  const totalNum = parseFloat(total);
  const change = cashInput ? (cashNum - totalNum).toFixed(2) : null;
  const cashSufficient = cashNum >= totalNum;

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-bold text-center mb-6">បញ្ជីកម្មង់</h2>

      {loading && (
        <p className="text-center text-gray-400 py-10 text-sm">កំពុងទាញទិន្នន័យ...</p>
      )}
      {!loading && orders.length === 0 && (
        <p className="text-center text-gray-400 py-10 text-sm">មិនមានការកម្មង់</p>
      )}

      {orders.map((item) => (
        <div key={item.id} className="flex items-center bg-white p-3 rounded-2xl border mb-3 relative">
          <button
            onClick={() => handleDelete(item.id)}
            className="absolute top-2 right-3 text-red-400 text-lg leading-none"
            aria-label="លុបទំនិញ"
          >✕</button>
          <img src={item.item.image} alt={item.item.name} className="w-16 h-16 rounded-xl mr-4 object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-semibold text-gray-800 truncate">{item.item.name}</h3>
            <p className="text-sm text-amber-500 font-semibold">${item.unit_price}</p>
            <p className="text-xs text-gray-400">សរុប: ${item.sub_total}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => handleQtyChange(item, -1)} className="bg-gray-100 w-8 h-8 rounded-full text-gray-600 font-bold flex items-center justify-center">−</button>
            <span className="font-bold w-6 text-center">{item.quantity}</span>
            <button onClick={() => handleQtyChange(item, 1)} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold flex items-center justify-center">+</button>
          </div>
        </div>
      ))}

      {orders.length > 0 && (
        <>
          <div className="flex justify-between items-center px-1 mt-4 mb-2">
            <span className="text-gray-500 text-sm">សរុប</span>
            <span className="font-bold text-lg text-gray-800">${total}</span>
          </div>
          <button
            onClick={() => setShowPayment(true)}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold transition-colors"
          >
            ទូទាត់
          </button>
        </>
      )}

      {/* ── Payment Modal — centered ───────────────────────────────────────── */}
      {showPayment && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50"
          onClick={(e) => e.target === e.currentTarget && closePayment()}
        >
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-xl">

            {/* Header */}
            <div className="flex justify-between items-center px-6 pt-6 pb-2">
              <span className="font-medium text-gray-800 text-base">ការទូទាត់</span>
              <button
                onClick={closePayment}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm"
                aria-label="បិទ"
              >✕</button>
            </div>

            {/* Total display */}
            <div className="text-center py-6">
              <p className="text-xs text-gray-400 mb-1">ចំនួនសរុប</p>
              <p className="text-4xl font-medium text-gray-800 tracking-tight">
                <span className="text-xl text-gray-400 font-normal align-super mr-0.5">$</span>
                {total}
              </p>
            </div>

            {/* Payment options */}
            <div className="grid grid-cols-2 gap-3 px-6 mb-4">
              {/* QR */}
              <button
                onClick={() => handlePayment(1)}
                disabled={payingQR}
                className="flex flex-col items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl py-5 hover:bg-amber-100 transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">📷</div>
                <span className="text-sm font-medium text-amber-800">{payingQR ? '...' : 'QR Code'}</span>
                <span className="text-[11px] text-amber-600">ABA · KHQR</span>
              </button>

              {/* Cash */}
              <button
                onClick={() => setShowCash(prev => !prev)}
                className={`flex flex-col items-center gap-2 border rounded-2xl py-5 transition-colors ${
                  showCash
                    ? 'bg-green-100 border-green-400'
                    : 'bg-green-50 border-green-200 hover:bg-green-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${showCash ? 'bg-green-200' : 'bg-green-100'}`}>💵</div>
                <span className="text-sm font-medium text-green-800">លុយសុទ្ធ</span>
                <span className="text-[11px] text-green-600">Cash</span>
              </button>
            </div>

            {/* Cash input section */}
            {showCash && (
              <div className="mx-6 mb-4 bg-gray-50 rounded-2xl p-4">
                <input
                  type="number"
                  placeholder="លុយដែលបានទទួល ($)"
                  value={cashInput}
                  onChange={e => setCashInput(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-amber-400"
                  autoFocus
                />
                {change !== null && cashSufficient && (
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400">អាប់</span>
                    <span className="font-medium text-green-600">${change}</span>
                  </div>
                )}
                {change !== null && !cashSufficient && (
                  <p className="text-xs text-red-500 mb-3 text-center">
                    លុយមិនគ្រប់ — ត្រូវការ ${(totalNum - cashNum).toFixed(2)} បន្ថែម
                  </p>
                )}
                <button
                  onClick={() => handlePayment(2)}
                  disabled={!cashInput || !cashSufficient || payingCash}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-40 text-white py-3 rounded-xl font-medium text-sm transition-colors"
                >
                  {payingCash ? 'កំពុងដំណើរការ...' : 'បញ្ជាក់ការទូទាត់'}
                </button>
              </div>
            )}

            {/* Bottom padding */}
            <div className="pb-2" />
          </div>
        </div>
      )}
    </div>
  );
};