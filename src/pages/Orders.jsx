import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export const Orders = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ice, setIce] = useState("medium");
  const [sugar, setSugar] = useState("100%");
  const [size, setSize] = useState("M");
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  const sizeMap = {
    S: "6a04a84d6ffa4f7d2308baf6",
    M: "6a04a84d6ffa4f7d2308baf7",
    L: "6a04a84d6ffa4f7d2308baf8",
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        setError("មិនអាចទាញទិន្នន័យបាន");
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    try {
      await api.post("/order_items", {
        order_id: "6a130ca2586b50a1600b1852",
        item_id: id,
        size_id: sizeMap[size],
        ice_level: ice,
        sugar_level: sugar,
        quantity: 1,
        unit_price: product.price,
      });

      navigate("/my-orders");
    } catch (error) {
      alert(error.response?.data?.message || "បរាជ័យក្នុងការកម្មង់");
    } finally {
      setLoading(false);
    }
  };

  const OptionButton = ({ label, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95
        ${active 
          ? "bg-[#f4a261] text-white shadow" 
          : "bg-white border border-gray-200 text-gray-700 hover:border-[#f4a261]"
        }`}
    >
      {label}
    </button>
  );

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black/60 flex items-center justify-center p-4 fixed inset-0 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header with Close Button */}
        <div className="flex justify-end p-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-600 hover:bg-gray-200 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-8">

          {/* Product Image & Info */}
          <div className="flex gap-5 mb-8">
            <div className="w-28 h-28 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
              {product?.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">☕</div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                {product?.name || "Iced Americano"}
              </h1>
              <p className="text-xl font-semibold text-gray-700 mt-2">
                {product?.price }
              </p>
            </div>
          </div>

          {/* Ice Level */}
          <div className="mb-7">
            <label className="block text-sm text-gray-500 mb-3">កម្រិតទឹកកក</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "low", label: "តិច" },
                { value: "medium", label: "មធ្យម" },
                { value: "high", label: "ច្រើន" },
              ].map((item) => (
                <OptionButton
                  key={item.value}
                  label={item.label}
                  active={ice === item.value}
                  onClick={() => setIce(item.value)}
                />
              ))}
            </div>
          </div>

          {/* Sugar Level */}
          <div className="mb-7">
            <label className="block text-sm text-gray-500 mb-3">កម្រិតស្ករ</label>
            <div className="flex gap-2 flex-wrap">
              {["0%", "25%", "50%", "75%", "100%"].map((v) => (
                <OptionButton
                  key={v}
                  label={v}
                  active={sugar === v}
                  onClick={() => setSugar(v)}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <label className="block text-sm text-gray-500 mb-3">ទំហំ</label>
            <div className="flex gap-2">
              {["S", "M", "L"].map((v) => (
                <OptionButton
                  key={v}
                  label={v}
                  active={size === v}
                  onClick={() => setSize(v)}
                />
              ))}
            </div>
          </div>

          {/* Order Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f4a261] hover:bg-[#e38f4e] text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 disabled:opacity-70 shadow-md"
          >
            {loading ? "កំពុងដំណើរការ..." : "កម្មង់"}
          </button>
        </form>
      </div>
    </div>
  );
};