/* eslint-disable react-hooks/exhaustive-deps */

import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchItems();
  }, [search]);

  const fetchItems = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;

    api.get('/items/list', { params })
      .then((response) => {
        console.log('API response:', response.data);
        const data = response.data.data;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('API error:', err.response?.data || err.message);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  };

  const handleOrder = (id) => {
    navigate(`/orders/${id}`);
  };

  const allCategories = [
    { category_id: 'all', category_name: 'ទាំងអស់' },
    ...categories,
  ];

  const visibleCategories =
    activeCategory === 'all'
      ? categories
      : categories.filter((cat) => cat.category_id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Search */}
        <div className="mb-5">
          <div className="relative max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="ស្វែងរកម្ហូប..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {allCategories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategory(cat.category_id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer
                ${activeCategory === cat.category_id
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400 hover:text-amber-600'
                }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>

        ) : visibleCategories.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-sm">
            រកមិនឃើញម្ហូប
          </div>

        ) : (
          visibleCategories.map((cat) => (
            cat.items?.length > 0 && (
              <div key={cat.category_id} className="mb-10">
                {activeCategory === 'all' && (
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-base font-semibold text-gray-700">
                      {cat.category_name}
                    </h2>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                      {cat.items_count}
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {cat.items.map((item) => (
                    <ItemCard key={item.id} item={item} onOrder={handleOrder} />
                  ))}
                </div>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
};

const ItemCard = ({ item, onOrder }) => {
  const defaultPrice = item.prices?.[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="bg-gray-50 flex items-center justify-center p-3 h-40">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-snug">
          {item.name}
        </h3>

        {defaultPrice ? (
          <p className="text-sm text-gray-500 mb-3">
            តម្លៃ៖{' '}
            <span className="text-gray-800 font-medium">{defaultPrice.price}$</span>
            {defaultPrice.size && (
              <span className="text-xs text-gray-400 ml-1">({defaultPrice.size})</span>
            )}
          </p>
        ) : (
          <p className="text-sm text-gray-400 mb-3">មិនមានតម្លៃ</p>
        )}

        {item.prices?.length > 1 && (
          <div className="flex gap-1 flex-wrap mb-3">
            {item.prices.map((p) => (
              <span
                key={p.code}
                className="text-[10px] border border-amber-300 text-amber-700 rounded-full px-2 py-0.5"
              >
                {p.size} — {p.price}$
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => onOrder(item.id)}
          className="mt-auto w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-medium py-2 rounded-xl transition-all duration-150 cursor-pointer"
        >
          កម្មង់
        </button>
      </div>
    </div>
  );
};