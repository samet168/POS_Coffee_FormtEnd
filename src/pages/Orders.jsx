import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export const Orders = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ice, setIce] = useState("medium");
  const [sugar, setSugar] = useState("100%");
  const [size, setSize] = useState("M");
  const [loading, setLoading] = useState(false);

  const sizeMap = {
    S: "6a04a84d6ffa4f7d2308baf6",
    M: "6a04a84d6ffa4f7d2308baf7",
    L: "6a04a84d6ffa4f7d2308baf8",
  };

  const handleOrder = async () => {
    setLoading(true);

    try {
      await api.post("/order_items", {
        order_id: "6a130ca2586b50a1600b1852",
        item_id: id,
        size_id: sizeMap[size],
        ice_level: ice,
        sugar_level: sugar,
        quantity: 1,
        unit_price: 2.5,
      });

      navigate("/my-orders");

    } catch (error) {
      console.error(error.response?.data || error);

      alert("បរាជ័យក្នុងការកម្មង់");
    } finally {
      setLoading(false);
    }
  };

  const OptionButton = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 border
      ${
        active
          ? "bg-[#6f4e37] text-white border-[#6f4e37] shadow-md scale-105"
          : "bg-white text-gray-500 border-gray-200 hover:border-[#b08968] hover:text-[#6f4e37]"
      }`}
    >
      {label}
    </button>
  );

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5ebe0] to-[#ede0d4] px-4 py-6">

      {/* Container */}
      <div className="max-w-md mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 text-sm text-[#6f4e37] hover:underline"
        >
          ← ត្រឡប់ក្រោយ
        </button>

        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Top */}
          <div className="bg-[#6f4e37] p-6 text-white">

            <div className="flex items-center gap-4">

              <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center text-4xl backdrop-blur-sm">
                ☕
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Iced Americano
                </h1>

                <p className="text-sm text-[#ede0d4] mt-1">
                  Bold espresso · Cold brew
                </p>

                <p className="mt-3 text-xl font-semibold">
                  $2.50
                </p>
              </div>

            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">

            {/* Ice */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#6f4e37]">
                  🧊 Ice Level
                </h3>

                <span className="text-xs text-gray-400">
                  ជ្រើសរើសទឹកកក
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {["low", "medium", "high"].map((v) => (
                  <OptionButton
                    key={v}
                    label={cap(v)}
                    active={ice === v}
                    onClick={() => setIce(v)}
                  />
                ))}
              </div>
            </div>

            {/* Sugar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#6f4e37]">
                  🍬 Sugar Level
                </h3>

                <span className="text-xs text-gray-400">
                  កម្រិតស្ករ
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
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
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#6f4e37]">
                  📏 Size
                </h3>

                <span className="text-xs text-gray-400">
                  ទំហំភេសជ្ជៈ
                </span>
              </div>

              <div className="flex gap-3">
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

            {/* Summary */}
            <div className="bg-[#faf7f2] border border-[#e6d5c3] rounded-2xl p-4">

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Ice
                </span>

                <span className="font-medium text-[#6f4e37]">
                  {cap(ice)}
                </span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Sugar
                </span>

                <span className="font-medium text-[#6f4e37]">
                  {sugar}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Size
                </span>

                <span className="font-medium text-[#6f4e37]">
                  {size}
                </span>
              </div>

            </div>

            {/* Button */}
            <button
              onClick={handleOrder}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#6f4e37] hover:bg-[#5c3d2e] text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {loading
                ? "កំពុងដំណើរការ..."
                : "☕ កម្មង់ឥឡូវនេះ"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};