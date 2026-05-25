import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// 1. PRODUCT CARD COMPONENT (Design ស្អាត)
const ProductCard = ({ item, navigate }) => (
  <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
    <div className="aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
    <p className="text-gray-500 mb-4 text-sm">
      តម្លៃ: <span className="font-bold text-gray-900">{item.price}$</span>
      <span className="text-gray-400 ml-1">({item.size || 'Small'})</span>
    </p>
    <button 
      onClick={() => navigate(`/orders/${item.id}`)}
      className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-2xl transition-all active:scale-95"
    >
      កម្មង់
    </button>
  </div>
);

// 2. CUSTOM SLIDER
const CustomSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    { title: "ប្រូម៉ូសិនពិសេស", desc: "បញ្ចុះតម្លៃ ២០%", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80" },
    { title: "មុខម្ហូបថ្មី", desc: "សាកល្បងរសជាតិថ្មី", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80" },
  ];

  return (
    <div className="relative w-full h-52 rounded-3xl overflow-hidden shadow-xl mb-6">
      {slides.map((slide, index) => (
        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
          <img src={slide.image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8 text-white">
            <h2 className="text-2xl font-bold">{slide.title}</h2>
            <p className="text-sm opacity-90">{slide.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. MAIN HOME PAGE
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/items/list', { params: search ? { search } : {} })
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]));
  }, [search]);

  return (
    <div className="min-h-screen bg-[#fcfaf5] pb-10">
      {/* Header */}
      <div className="bg-[#3b1f0f] px-6 py-8 text-white rounded-b-[2rem] text-center mb-6">
        <h1 className="text-2xl font-bold">404' CAFE</h1>
        <p className="text-amber-200 text-sm mt-1">សូមជ្រើសរើសមុខម្ហូបដែលអ្នកពេញចិត្ត</p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <CustomSlider />

        {/* Search */}
        <input
          type="text"
          placeholder="ស្វែងរកម្ហូប..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-6 py-4 rounded-2xl border-none shadow-sm mb-6 outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {[{ category_id: 'all', category_name: 'ទាំងអស់' }, ...categories].map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategory(cat.category_id)}
              className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all ${activeCategory === cat.category_id ? 'bg-orange-400 text-white' : 'bg-white border border-gray-200'}`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {categories.filter(c => activeCategory === 'all' || c.category_id === activeCategory).map((cat) => (
          <div key={cat.category_id} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{cat.category_name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cat.items?.map((item) => (
                <ProductCard key={item.id} item={item} navigate={navigate} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;