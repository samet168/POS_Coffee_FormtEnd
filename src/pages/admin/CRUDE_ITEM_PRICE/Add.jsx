/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../services/api";

const Add = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [items, setItems] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [formData, setFormData] = useState({
    item_id: "",
    size_id: "",
    price: "",
  });

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const itemRes = await API_URL.get("/items");
      const sizeRes = await API_URL.get("/sizes");

      console.log("ITEM RESPONSE:", itemRes.data);

      // ✅ SAFE PARSE (fix all API formats)
      const itemsData =
        itemRes.data?.data?.data ||
        itemRes.data?.data ||
        itemRes.data ||
        [];

      const sizesData =
        sizeRes.data?.data?.data ||
        sizeRes.data?.data ||
        sizeRes.data ||
        [];

      setItems(Array.isArray(itemsData) ? itemsData : []);
      setSizes(Array.isArray(sizesData) ? sizesData : []);

    } catch (error) {
      console.error("FETCH ERROR:", error);
      setItems([]);
      setSizes([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API_URL.post("/item-size-prices", formData);

      alert("☕ Saved Successfully");

      navigate("/dashboard/product-Prices");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Save Failed"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ebe0] flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#6f4e37] text-white px-6 py-5">
          <h1 className="text-2xl font-bold">
            ☕ Add Price
          </h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* PRODUCT */}
          <div>
            <label className="font-semibold text-[#6f4e37]">
              Product
            </label>

            <select
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mt-2"
            >
              <option value="">Select Product</option>

              {items.length > 0 ? (
                items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              ) : (
                <option disabled>No Products</option>
              )}
            </select>
          </div>

          {/* SIZE */}
          <div>
            <label className="font-semibold text-[#6f4e37]">
              Size
            </label>

            <select
              name="size_id"
              value={formData.size_id}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mt-2"
            >
              <option value="">Select Size</option>

              {sizes.length > 0 ? (
                sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.size_name} ({size.size_code})
                  </option>
                ))
              ) : (
                <option disabled>No Sizes</option>
              )}
            </select>
          </div>

          {/* PRICE */}
          <div>
            <label className="font-semibold text-[#6f4e37]">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mt-2"
              placeholder="Enter price"
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={saving}
            className="w-full bg-[#6f4e37] text-white py-3 rounded-xl font-bold hover:bg-[#5c3d2e]"
          >
            {saving ? "Saving..." : "☕ Save Price"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Add;