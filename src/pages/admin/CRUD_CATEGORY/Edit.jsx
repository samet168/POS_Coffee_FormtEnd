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

  const [formData, setFormData] = useState({
    name: "",
  });

  // ================= Fetch =================
  const fetchCategory = async () => {
    try {
      setLoading(true);

      const response = await API_URL.get(`/item-categories/${id}`);

      const category = response.data.data || response.data;

      setFormData({
        name: category.name || "",
      });

    } catch (error) {
      console.error(error);
      alert("Cannot load category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategory();
  }, [id]);

  // ================= Change =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= Submit =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API_URL.post(`/item-categories/${id}`, formData);

      alert("☕ Update Success");

      navigate("/dashboard/category");

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
      <div className="flex justify-center items-center h-[60vh]">
        <h1 className="text-2xl font-bold text-[#6f4e37]">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ebe0] p-6">

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#d6ccc2]">

        {/* Header */}
        <div className="bg-[#6f4e37] text-white px-6 py-5 flex justify-between items-center">

          <h1 className="text-3xl font-bold">
            ☕ Edit Category
          </h1>

          <Link
            to="/dashboard/category"
            className="bg-[#ede0d4] text-[#6f4e37] px-4 py-2 rounded-xl hover:bg-white"
          >
            Back
          </Link>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter Category Name"
              onChange={handleChange}
              className="w-full border border-[#d6ccc2] bg-[#faf7f2] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08968]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-3 rounded-xl text-white font-semibold shadow-lg
            ${
              saving
                ? "bg-gray-400"
                : "bg-[#6f4e37] hover:bg-[#5c3d2e]"
            }`}
          >
            {saving ? "Updating..." : "☕ Update Category"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Edit;