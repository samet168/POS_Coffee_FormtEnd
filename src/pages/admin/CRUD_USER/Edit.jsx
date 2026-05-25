/* eslint-disable react-hooks/exhaustive-deps */
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
    email: "",
    role: "",
  });

  // ================= Fetch User =================
  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await API_URL.get(`/user/${id}`);

      const user = response.data.data || response.data;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });

    } catch (error) {
      console.error(error);
      alert("Cannot load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, [id]);

  // ================= Handle Change =================
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

      await API_URL.post(`/user/${id}`, formData);

      alert("Update Success");

      navigate("/dashboard/users");

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
      <div className="flex justify-center items-center h-[60vh] bg-[#f5ebe0]">
        <h1 className="text-2xl font-bold text-[#6f4e37]">
          Loading...
        </h1>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#f5ebe0] p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#d6ccc2]">

        {/* Header */}
        <div className="bg-[#6f4e37] text-white px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-wide">
            ☕ Edit User
          </h1>

          <Link
            to="/dashboard/users"
            className="bg-[#ede0d4] text-[#6f4e37] px-4 py-2 rounded-xl hover:bg-white transition font-semibold"
          >
            Back
          </Link>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          {/* Name */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter Name"
              onChange={handleChange}
              className="w-full border border-[#d6ccc2] bg-[#faf7f2] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08968]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter Email"
              onChange={handleChange}
              className="w-full border border-[#d6ccc2] bg-[#faf7f2] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08968]"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-[#d6ccc2] bg-[#faf7f2] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08968]"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Button */}
          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition
              ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#6f4e37] hover:bg-[#5c3d2e]"
              }`}
            >
              {saving ? "Updating..." : "☕ Update User"}
            </button>

            <button
              type="reset"
              className="px-6 py-3 rounded-xl border border-[#b08968] text-[#6f4e37] hover:bg-[#ede0d4] transition"
            >
              Reset
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Edit;