/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../../../services/api";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [items, setItems] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [formData, setFormData] = useState({
    item_id: "",
    size_id: "",
    price: "",
  });

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const itemRes = await API_URL.get("/items");
      const sizeRes = await API_URL.get("/sizes");
      const priceRes = await API_URL.get(`/item-size-prices/${id}`);

      // 🔥 SAFE PARSE (fix map error)
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

      const price =
        priceRes.data?.data || priceRes.data || {};

      setFormData({
        item_id: price.item_id || "",
        size_id: price.size_id || "",
        price: price.price || "",
      });

    } catch (error) {
      console.error(error);
      setItems([]);
      setSizes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ================= CHANGE =================
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

      await API_URL.post(`/item-size-prices/${id}`, formData);

      alert("☕ Update Success");

      navigate("/dashboard/product-prices");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update Failed");
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h1 className="text-2xl font-bold text-[#6f4e37]">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ebe0] p-6">

      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-6">

        <h1 className="text-2xl font-bold text-[#6f4e37] mb-5">
          ☕ Edit Price
        </h1>

        {/* PRODUCT */}
        <select
          name="item_id"
          value={formData.item_id}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl mb-4"
        >
          <option value="">Select Product</option>

          {Array.isArray(items) &&
            items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>

        {/* SIZE */}
        <select
          name="size_id"
          value={formData.size_id}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl mb-4"
        >
          <option value="">Select Size</option>

          {Array.isArray(sizes) &&
            sizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.size_name}
              </option>
            ))}
        </select>

        {/* PRICE */}
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl mb-4"
          placeholder="Price"
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-[#6f4e37] text-white py-3 rounded-xl"
        >
          {saving ? "Updating..." : "☕ Update"}
        </button>

      </div>
    </div>
  );
};

export default Edit;