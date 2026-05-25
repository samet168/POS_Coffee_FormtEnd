import { useEffect, useState } from "react";
import API_URL from "../../services/api";
import { Link } from "react-router-dom";

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API_URL.get("/profile");
        setUser(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("Password មិនត្រូវគ្នា!");
      return;
    }
    try {
      const res = await API_URL.post("/change-password", passwordData);
      alert(res.data.message);
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
      setOpenModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Change password failed");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#d39352] text-white font-bold animate-pulse">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d39352] p-6">
      <div className="w-full max-w-3xl bg-[#f6ede3] rounded-3xl shadow-2xl overflow-hidden border">
        {/* HEADER */}
        <div className="bg-[#40220f] p-5 flex justify-between items-center">
          <h1 className="text-[#f6ede3] font-bold tracking-widest flex items-center gap-2">👤 PROFILE</h1>
          <div className="flex gap-3">
            <Link to="/dashboard/profile/edit" className="bg-[#d39352] text-[#2b160f] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#c2854a]">Edit</Link>
            <button onClick={() => setOpenModal(true)} className="bg-white text-[#40220f] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100">Change Password</button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
          {/* USER AVATAR */}
          <div className="flex flex-col items-center">
            <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}`} className="w-32 h-32 rounded-full border-4 border-[#40220f] object-cover" />
            <h2 className="mt-4 text-xl font-black text-[#40220f]">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="mt-2 bg-[#d39352] text-white text-[10px] px-3 py-1 rounded-full font-bold">ID: {user.id}</div>
          </div>

          {/* INFO SECTION */}
          <div className="flex-1 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500">Name</p>
              <p className="font-bold text-gray-800">{user.name}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-bold text-gray-800">{user.email}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-green-600 font-bold uppercase">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-[#40220f]">🔒 Change Password</h2>
              <button onClick={() => setOpenModal(false)} className="text-red-500 font-bold">✖</button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input type="password" name="current_password" placeholder="Current Password" value={passwordData.current_password} onChange={handleChange} className="w-full border p-2 rounded-lg text-sm" />
              <input type="password" name="new_password" placeholder="New Password" value={passwordData.new_password} onChange={handleChange} className="w-full border p-2 rounded-lg text-sm" />
              <input type="password" name="confirm_password" placeholder="Confirm Password" value={passwordData.confirm_password} onChange={handleChange} className="w-full border p-2 rounded-lg text-sm" />
              <button type="submit" className="w-full bg-[#40220f] text-white py-2 rounded-lg font-bold">Update Password</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};