/* eslint-disable react-hooks/set-state-in-effect */
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
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await API_URL.get(`/user/${id}`);

      const user = response.data.data || response.data;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        password: "",
        image: null,
      });

      setPreview(user.image || null);

    } catch (error) {
      console.log(error);
      alert("Cannot load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE IMAGE =================
  const handleFile = (e) => {
    const file = e.target.files[0];

    setFormData({
      ...formData,
      image: file,
    });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("role", formData.role);

      // optional password
      if (formData.password) {
        data.append("password", formData.password);
      }

      // image
      if (formData.image) {
        data.append("image", formData.image);
      }

      await API_URL.post(`/user/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("User Updated Successfully");

      navigate("/dashboard/users");

    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(
        error.response?.data?.message || "Update Failed"
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ebe0] p-6">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#6f4e37] text-white p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            ☕ Edit User
          </h1>

          <Link
            to="/dashboard/users"
            className="bg-white text-[#6f4e37] px-4 py-2 rounded-xl"
          >
            Back
          </Link>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          {/* IMAGE */}
          <div className="flex flex-col items-center">

            <img
              src={
                preview ||
                `https://ui-avatars.com/api/?name=${formData.name}`
              }
              alt="preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#b08968]"
            />

            <input
              type="file"
              onChange={handleFile}
              className="mt-4"
            />
          </div>

          {/* NAME */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Password (Optional)
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="block mb-2 font-semibold text-[#6f4e37]">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#6f4e37] text-white py-3 rounded-xl"
          >
            {saving ? "Updating..." : "☕ Update User"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Edit;
