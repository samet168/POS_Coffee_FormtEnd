/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchItems = () => {
    setLoading(true);

    const params = {};
    if (search) params.search = search;

    api
      .get("/items/list", { params })
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  const handleOrder = (id) => {
    navigate(`/orders/${id}`);
  };

  const allCategories = [
    { category_id: "all", category_name: "ទាំងអស់" },
    ...categories,
  ];

  const visible =
    activeCategory === "all"
      ? categories
      : categories.filter((c) => c.category_id === activeCategory);

  return (
    <div className="min-h-screen bg-[#f8f5f2]">

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ================= SEARCH ================= */}
        <div className="mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ស្វែងរកម្ហូប..."
            className="w-full md:w-80 px-4 py-3 rounded-2xl border border-[#e7dcd2] bg-white shadow-sm outline-none focus:ring-2 focus:ring-[#6f4e37]"
          />
        </div>

        {/* ================= CATEGORY ================= */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {allCategories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategory(cat.category_id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition
              ${
                activeCategory === cat.category_id
                  ? "bg-[#6f4e37] text-white border-[#6f4e37]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#6f4e37]"
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 animate-pulse"
              >
                <div className="h-40 bg-gray-100 rounded-t-2xl" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          visible.map((cat) => (
            <div key={cat.category_id} className="mb-10">

              {/* TITLE */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-[#3b1f0f]">
                  {cat.category_name}
                </h2>
                <div className="flex-1 h-px bg-[#e7dcd2]" />
              </div>

              {/* GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cat.items?.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onOrder={handleOrder}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ================= ITEM CARD ================= */
const ItemCard = ({ item, onOrder }) => {
  const firstPrice = item.prices?.[0];

  return (
    <div className="bg-white rounded-3xl border border-[#eee] shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col">

      {/* IMAGE */}
      <div className="h-36 bg-[#faf7f2] flex items-center justify-center">
        <img
          src={item.image}
          className="h-full w-full object-cover"
          alt={item.name}
        />
      </div>

      {/* BODY */}
      <div className="p-3 flex flex-col flex-1">

        <h3 className="font-semibold text-gray-800 text-sm">
          {item.name}
        </h3>

        {/* PRICE */}
        <div className="mt-2">
          {firstPrice ? (
            <div className="flex justify-between items-center bg-[#faf7f2] px-3 py-2 rounded-xl border border-[#eee]">
              <span className="text-xs text-gray-500">
                {firstPrice.size}
              </span>

              <span className="font-bold text-[#6f4e37]">
                ${firstPrice.price}
              </span>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No price</p>
          )}
        </div>

        {/* ALL PRICES */}
        {item.prices?.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.prices.map((p, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 border border-[#e7dcd2] rounded-full text-gray-600"
              >
                {p.size} ${p.price}
              </span>
            ))}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={() => onOrder(item.id)}
          className="mt-3 bg-[#6f4e37] hover:bg-[#4b2a1a] text-white py-2 rounded-2xl text-sm font-semibold transition active:scale-95"
        >
          កម្មង់
        </button>
      </div>
    </div>
  );
};