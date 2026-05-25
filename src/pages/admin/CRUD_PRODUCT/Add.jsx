/* eslint-disable react-hooks/set-state-in-effect */
// ================= Add.jsx =================

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../../services/api";

const Add = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    item_category_id: "",
    name: "",
    image: null,
    status: "In Stock",
  });

  // ================= Fetch Categories =================
  const fetchCategories = async () => {
    try {
      const response = await API_URL.get("/item-categories");

      setCategories(response.data.data || []);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= Change =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // ================= Submit =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      data.append("item_category_id", formData.item_category_id);
      data.append("name", formData.name);
      data.append("status", formData.status);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await API_URL.post("/items", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("☕ Product Added");

      navigate("/dashboard/product-list");

    } catch (error) {
      console.error(error);
      alert("Add Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ebe0] p-6">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#6f4e37] text-white px-6 py-5 flex justify-between items-center">

          <h1 className="text-3xl font-bold">
            ☕ Add Product
          </h1>

          <Link
            to="/dashboard/product-list"
            className="bg-[#ede0d4] text-[#6f4e37] px-4 py-2 rounded-xl"
          >
            Back
          </Link>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          {/* Category */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Category
            </label>

            <select
              name="item_category_id"
              value={formData.item_category_id}
              onChange={handleChange}
              className="w-full border border-[#d6ccc2] rounded-xl px-4 py-3"
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}

            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Product Name"
              className="w-full border border-[#d6ccc2] rounded-xl px-4 py-3"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Product Image
            </label>

            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full border border-[#d6ccc2] rounded-xl px-4 py-3"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-[#d6ccc2] rounded-xl px-4 py-3"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-3 rounded-xl text-white font-semibold
            ${
              saving
                ? "bg-gray-400"
                : "bg-[#6f4e37] hover:bg-[#5c3d2e]"
            }`}
          >
            {saving ? "Saving..." : "☕ Save Product"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Add;