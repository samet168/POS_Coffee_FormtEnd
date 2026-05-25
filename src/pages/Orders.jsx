import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export const Orders = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ice, setIce] = useState('medium');
  const [sugar, setSugar] = useState('100%');
  const [size, setSize] = useState('S');
  const [loading, setLoading] = useState(false);

  const sizeMap = {
    S: '6a04a84d6ffa4f7d2308baf6',
    M: '6a04a84d6ffa4f7d2308baf7',
    L: '6a04a84d6ffa4f7d2308baf8',
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      await api.post('/order_items', {
        order_id: '6a130ca2586b50a1600b1852',
        item_id: id,
        size_id: sizeMap[size],
        ice_level: ice,
        sugar_level: sugar,
        quantity: 1,
        unit_price: 2.50,
      });
      navigate('/my-orders');
    } catch (error) {
      console.error('Error:', error.response?.data || error);
      alert('បរាជ័យក្នុងការកម្មង់');
    } finally {
      setLoading(false);
    }
  };

  const Pill = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-sm leading-none transition-all duration-150
        ${active
          ? 'bg-amber-50 border-amber-400 text-amber-800 font-medium'
          : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50'
        }`}
    >
      {label}
    </button>
  );

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="max-w-sm mx-auto px-4 py-6">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-400 mb-4 hover:text-gray-600 transition-colors"
      >
        ← ត្រឡប់
      </button>

      {/* Hero */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-[68px] h-[68px] rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-3xl flex-shrink-0">
          ☕
        </div>
        <div>
          <h1 className="text-[17px] font-medium text-gray-800 mb-0.5">Iced Americano</h1>
          <p className="text-xs text-gray-400 mb-1.5">Bold espresso · Cold brew</p>
          <p className="text-sm font-medium text-amber-700">$2.50</p>
        </div>
      </div>

      {/* Form card with border */}
      <div className="border border-gray-200 rounded-[18px] overflow-hidden mb-4">

        {/* Ice row */}
        <div className="px-4 py-3.5 border-b border-gray-100">
          <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2.5">
            ទឹកកក · Ice
          </p>
          <div className="flex flex-wrap gap-2">
            {['low', 'medium', 'high'].map(v => (
              <Pill key={v} label={cap(v)} active={ice === v} onClick={() => setIce(v)} />
            ))}
          </div>
        </div>

        {/* Sugar row */}
        <div className="px-4 py-3.5 border-b border-gray-100">
          <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2.5">
            ស្ករ · Sugar
          </p>
          <div className="flex flex-wrap gap-2">
            {['0%', '25%', '50%', '75%', '100%'].map(v => (
              <Pill key={v} label={v} active={sugar === v} onClick={() => setSugar(v)} />
            ))}
          </div>
        </div>

        {/* Size row */}
        <div className="px-4 py-3.5">
          <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2.5">
            ទំហំ · Size
          </p>
          <div className="flex gap-2">
            {['S', 'M', 'L'].map(v => (
              <Pill key={v} label={v} active={size === v} onClick={() => setSize(v)} />
            ))}
          </div>
        </div>

      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 flex justify-between items-center mb-4">
        <span className="text-xs text-gray-400">ការជ្រើសរើស</span>
        <span className="text-sm font-medium text-gray-700">
          {cap(ice)} ice · {sugar} · Size {size}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={handleOrder}
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-amber-900 font-medium py-3.5 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        {loading ? 'កំពុងដំណើរការ...' : '🛍 កម្មង់ · Place Order'}
      </button>

    </div>
  );
};