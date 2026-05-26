import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* ================= PRODUCT CARD ================= */
const ProductCard = ({ item, navigate }) => {
  const firstPrice = item.prices?.[0];

  return (
    <div className="bg-white rounded-3xl border border-[#eee] shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">

      {/* IMAGE */}
      <div className="h-36 bg-[#faf7f2]">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* BODY */}
      <div className="p-3 flex flex-col flex-1">

        <h3 className="text-sm font-semibold text-gray-800">
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

        {/* MULTI PRICES */}
        {item.prices?.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.prices.map((p, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full border border-[#e7dcd2] text-gray-600"
              >
                {p.size} ${p.price}
              </span>
            ))}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={() => navigate(`/orders/${item.id}`)}
          className="mt-3 bg-[#6f4e37] hover:bg-[#4b2a1a] text-white py-2 rounded-2xl text-sm font-semibold transition active:scale-95"
        >
          កម្មង់
        </button>
      </div>
    </div>
  );
};

/* ================= HOME PAGE ================= */
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* FETCH DATA */
  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = () => {
    setLoading(true);

    api
      .get("/items/list", {
        params: search ? { search } : {},
      })
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2]">

      {/* ================= HEADER ================= */}
      <div className="bg-[#3b1f0f] text-white text-center py-8 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">404' CAFE</h1>
        <p className="text-sm text-amber-200 mt-1">
          សូមជ្រើសរើសមុខម្ហូប
        </p>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* SEARCH */}
        <div className="mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ស្វែងរក..."
            className="w-full md:w-80 px-4 py-3 rounded-2xl border border-[#e7dcd2] bg-white shadow-sm outline-none focus:ring-2 focus:ring-[#6f4e37]"
          />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-gray-100 animate-pulse"
              >
                <div className="h-36 bg-gray-100 rounded-t-3xl" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">

            {categories.map((cat) => (
              <div key={cat.category_id}>

                {/* CATEGORY TITLE */}
                <h2 className="text-lg font-bold text-[#3b1f0f] mb-4">
                  {cat.category_name}
                </h2>

                {/* GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {cat.items?.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      navigate={navigate}
                    />
                  ))}
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Home;