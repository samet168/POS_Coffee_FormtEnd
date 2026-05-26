import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API_URL.post("/login", {
        email,
        password,
      });

      const token = res.data.token || res.data.data?.token;
      const userData = res.data.user || res.data.data?.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        alert("ចូលប្រើប្រាស់ប្រព័ន្ធជោគជ័យ!");
        navigate("/");
      } else {
        alert("មិនអាចទាញយកសញ្ញាសម្គាល់ (Token) បានទេ!");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវឡើយ!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#d39352] font-sans antialiased p-4 select-none">
      {/* ប្រអប់កាតធំរួមបញ្ចូលគ្នា (Card Wrapper) */}
      <div className="flex items-center max-w-[900px] w-full justify-center md:space-x-12">
        
        {/* ផ្នែកខាងឆ្វេង៖ ផ្ទាំង Form បំពេញព័ត៌មាន */}
        <form 
          onSubmit={handleLogin} 
          className="p-10 bg-[#ecdcc9] rounded-[36px] border border-[#dfcbb5] w-full max-w-[420px] shadow-2xl relative"
        >
          {/* Logo និងឈ្មោះហាង */}
          <div className="flex items-center space-x-1 mb-2">
            <span className="text-sm">☕</span>
            <h2 className="text-[11px] font-black text-[#56331a] tracking-wider uppercase font-mono">404' CAFE.</h2>
          </div>

          {/* ចំណងជើងធំ */}
          <h1 className="text-4xl font-black text-[#40220f] mb-8 mt-1 tracking-wide">
            ចូលប្រើប្រាស់
          </h1>

          <div className="space-y-6">
            {/* Input អ៊ីមែល */}
            <div className="relative">
              <label className="text-[11px] font-bold text-[#83634e] block mb-1 px-1">
                ឈ្មោះអ្នកប្រើប្រាស់ ឬ អ៊ីមែល
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-2.5 bg-[#f6ede3] border border-[#c5ae96] rounded-full text-xs text-[#40220f] placeholder-[#b8a088] focus:outline-none focus:border-[#734325] focus:bg-white transition-all shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Input លេខសម្ងាត់ */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1 px-1">
                <label className="text-[11px] font-bold text-[#83634e]">លេខសម្ងាត់</label>
                {/* តំណភ្ជាប់ភ្លេចលេខសម្ងាត់ */}
                <button 
                  type="button" 
                  className="text-[10px] font-bold text-[#b07844] hover:underline bg-none border-none cursor-pointer"
                >
                  ភ្លេចលេខសម្ងាត់?
                </button>
              </div>
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-2.5 bg-[#f6ede3] border border-[#c5ae96] rounded-full text-xs text-[#40220f] placeholder-[#b8a088] focus:outline-none focus:border-[#734325] focus:bg-white transition-all shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* ប៊ូតុងចូលប្រើប្រាស់ពណ៌ក្រម៉ៅ */}
          <button 
            type="submit" 
            className="mt-8 bg-[#40220f] hover:bg-[#2b1609] active:scale-[0.98] text-[#ecdcc9] text-xs font-bold px-8 py-2.5 rounded-xl transition-all shadow-md tracking-wider"
          >
            ចូលប្រើ
          </button>
        </form>

        {/* ផ្នែកខាងស្តាំ៖ រូបភាពកែវកាហ្វេ 3D (លាក់នៅលើ Screen តូច) */}
        <div className="hidden md:block max-w-[360px] animate-pulse-slow">
          <img 
            src="https://pub-c5e31b5cdafb419a91624d1024ee8591.r2.dev/mock-coffee-3d.png" // អាចជំនួសដោយ Path រូបភាពមូលដ្ឋានរបស់អ្នក (e.g., /assets/coffee3d.png)
            alt="Coffee Cup 3D" 
            className="w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] object-contain"
            onError={(e) => {
              // បើគ្មានរូបភាពនៅលើ Server ទេ វានឹងលាក់ផ្ទាំងនេះមិនឱ្យបែករូបឡើយ
              e.target.style.display = 'none';
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default Login;