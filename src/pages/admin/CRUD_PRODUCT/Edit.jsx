/* eslint-disable react-hooks/exhaustive-deps */
// ================= Edit.jsx =================

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API_URL from "../../../services/api";

const Edit = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);

  const [previewImage, setPreviewImage] = useState("");

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

  // ================= Fetch Product =================
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await API_URL.get(`/items/${id}`);

      const product = response.data.data || response.data;

      console.log(product);

      setFormData({
        item_category_id: product.item_category_id || "",
        name: product.name || "",
        image: null,
        status: product.status || "In Stock",
      });

      setPreviewImage(product.image || "");

    } catch (error) {
      console.error(error);
      alert("Cannot load product");
    } finally {
      setLoading(false);
    }
  };

  // ================= UseEffect =================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
    fetchProduct();
  }, [id]);

  // ================= Handle Change =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {

      setFormData({
        ...formData,
        image: files[0],
      });

      if (files[0]) {
        setPreviewImage(URL.createObjectURL(files[0]));
      }

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

      await API_URL.post(`/items/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("☕ Update Product Success");

      navigate("/dashboard/product-list");

    } catch (error) {
      console.error(error);
      alert("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  // ================= Loading =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h1 className="text-3xl font-bold text-[#6f4e37]">
          Loading Product...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ebe0] p-6">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#d6ccc2]">

        {/* Header */}
        <div className="bg-[#6f4e37] text-white px-6 py-5 flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              ☕ Edit Product
            </h1>

            <p className="text-sm text-[#ede0d4] mt-1">
              Update your coffee product information
            </p>
          </div>

          <Link
            to="/dashboard/product-list"
            className="bg-[#ede0d4] text-[#6f4e37] px-5 py-2 rounded-xl hover:bg-white transition font-semibold"
          >
            ← Back
          </Link>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        >

          {/* Left */}
          <div className="space-y-6">

            {/* Category */}
            <div>
              <label className="block mb-2 font-semibold text-[#6f4e37]">
                Category
              </label>

              <select
                name="item_category_id"
                value={formData.item_category_id}
                onChange={handleChange}
                className="w-full border border-[#d6ccc2] bg-[#faf7f2] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08968]"
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

            {/* Product Name */}
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
                className="w-full border border-[#d6ccc2] bg-[#faf7f2] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08968]"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block mb-2 font-semibold text-[#6f4e37]">
                Product Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-[#d6ccc2] bg-[#faf7f2] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08968]"
              >
                <option value="In Stock">
                  In Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>
              </select>
            </div>

          </div>

          {/* Right */}
          <div className="space-y-6">

            {/* Image Upload */}
            <div>

              <label className="block mb-2 font-semibold text-[#6f4e37]">
                Product Image
              </label>

              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full border border-[#d6ccc2] bg-[#faf7f2] rounded-2xl px-4 py-3"
              />

            </div>

            {/* Preview */}
            <div className="bg-[#faf7f2] rounded-3xl p-4 border border-[#ede0d4]">

              <p className="font-semibold text-[#6f4e37] mb-3">
                Image Preview
              </p>

              <div className="h-72 rounded-2xl overflow-hidden bg-[#f5ebe0] flex items-center justify-center">

                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-400">
                    No Image
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* Button */}
          <div className="md:col-span-2 flex justify-end">

            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-3 rounded-2xl text-white font-bold shadow-xl transition
              ${
                saving
                  ? "bg-gray-400"
                  : "bg-[#6f4e37] hover:bg-[#5c3d2e]"
              }`}
            >
              {saving ? "Updating..." : "☕ Update Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default Edit;