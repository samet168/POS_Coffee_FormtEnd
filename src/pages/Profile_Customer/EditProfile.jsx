import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../services/api";

 const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    API_URL.get("/profile").then((res) => {
      const user = res.data.data;

      setForm({
        name: user.name,
        email: user.email,
        password: "",
        image: null,
      });

      setPreview(user.image);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];

    setForm({ ...form, image: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);

    if (form.password) {
      data.append("password", form.password);
    }

    if (form.image) {
      data.append("image", form.image);
    }

    try {
      const res = await API_URL.post("/profile/update", data);

      alert(res.data.message);

      // ✅ update localStorage
      localStorage.setItem("user", JSON.stringify(res.data.data));

      // 🔥 trigger navbar update
      window.dispatchEvent(new Event("userUpdated"));

      // redirect
      navigate("/profile");

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d39352] to-[#3b1f0f] p-6">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-[#3b1f0f] p-5 text-white text-center font-bold">
          ✏️ EDIT PROFILE
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          <div className="flex flex-col items-center">
            <img
              src={preview || `https://ui-avatars.com/api/?name=${form.name}`}
              className="w-28 h-28 rounded-full border-4"
            />

            <input type="file" onChange={handleFile} className="mt-3" />
          </div>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            placeholder="Name"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            placeholder="Email"
          />

          <button
            type="submit"
            className="w-full bg-[#3b1f0f] text-white py-3 rounded-xl"
          >
            💾 Save Changes
          </button>

        </form>
      </div>
    </div>
  );
};
export default EditProfile