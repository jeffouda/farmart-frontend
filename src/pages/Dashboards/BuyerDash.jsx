import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { Search, MapPin, Star, Heart, Sliders, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../services/api";

const BuyerDash = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [healthOnly, setHealthOnly] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await api.get("/wishlist");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];
        setWishlist(data);
        setFilteredItems(data);
      } catch (err) {
        // Fallback Mock Data matching your marketplace image
        const mockData = [
          {
            id: 1,
            breed: "Boran Bull - Premium",
            sub: "Boran Bull",
            type: "Cow",
            price: 185000,
            age: "3 yrs",
            weight: "450 kg",
            seller: "James Kimani",
            location: "Nakuru, Kenya",
            rating: 4.8,
            verified: true,
            image:
              "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400",
          },
          {
            id: 2,
            breed: "Boer Goat - Doe",
            sub: "Boer Goat",
            type: "Goat",
            price: 28000,
            age: "2 yrs",
            weight: "55kg",
            seller: "Sarah Wanjiku",
            location: "Kiambu, Kenya",
            rating: 4.9,
            verified: true,
            image:
              "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=400",
          },
          {
            id: 3,
            breed: "Sahiwal Heifer",
            sub: "Sahiwal",
            type: "Cow",
            price: 165000,
            age: "2.5yrs",
            weight: "380kg",
            seller: "James Kimani",
            location: "Nakuru, Kenya",
            rating: 4.8,
            verified: false,
            image:
              "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400",
          },
        ];
        setWishlist(mockData);
        setFilteredItems(mockData);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = wishlist;
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sub.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (selectedTypes.length > 0)
      result = result.filter((item) => selectedTypes.includes(item.type));
    if (selectedLocations.length > 0)
      result = result.filter((item) =>
        selectedLocations.includes(item.location),
      );
    if (healthOnly) result = result.filter((item) => item.verified === true);
    setFilteredItems(result);
  }, [searchQuery, selectedTypes, selectedLocations, healthOnly, wishlist]);

  const toggleFilter = (setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen flex">
      {/* Sidebar Filters */}
      <aside className="w-72 bg-[#f9fafb] border-r border-slate-200 p-6 hidden lg:block sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <Sliders size={20} className="text-slate-600" />
          <h2 className="text-xl font-bold text-slate-800">Filters</h2>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="font-bold text-slate-800 mb-4">Animal Types</h3>
            {["Cow", "Goat", "Sheep"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 mb-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-orange-500 rounded border-slate-300"
                  onChange={() => toggleFilter(setSelectedTypes, type)}
                />
                <span className="text-slate-600 group-hover:text-slate-900">
                  {type}
                </span>
              </label>
            ))}
          </section>

          <section>
            <h3 className="font-bold text-slate-800 mb-4">Location</h3>
            {[
              "Nakuru, Kenya",
              "Kiambu, Kenya",
              "Narok, Kenya",
              "Eldoret, Kenya",
            ].map((loc) => (
              <label
                key={loc}
                className="flex items-center gap-3 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-orange-500 rounded border-slate-300"
                  onChange={() => toggleFilter(setSelectedLocations, loc)}
                />
                <span className="text-slate-600">{loc}</span>
              </label>
            ))}
          </section>

          <hr className="border-slate-200" />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 accent-orange-500 rounded border-slate-300"
              onChange={(e) => setHealthOnly(e.target.checked)}
            />
            <span className="font-bold text-slate-800">
              Health Verified Only
            </span>
          </label>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Available Livestock
            </h1>
            <p className="text-slate-500 font-medium">
              {filteredItems.length} animals found
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search breed or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <X size={16} />
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="relative h-56">
                    <img
                      src={item.image}
                      alt={item.breed}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded border border-slate-200 uppercase">
                      {item.type}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900 leading-tight">
                        {item.breed}
                      </h3>
                      <p className="text-orange-500 font-bold whitespace-nowrap ml-2">
                        KSh {item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{item.sub}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 my-3">
                      <span>{item.age}</span> • <span>{item.weight}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {item.seller.charAt(0)}
                        </div>
                        <div className="text-[10px]">
                          <p className="font-bold text-slate-800">
                            {item.seller}
                          </p>
                          <p className="flex items-center gap-0.5 text-slate-400">
                            <MapPin size={8} /> {item.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-orange-500 font-bold text-xs">
                        <Star size={12} fill="currentColor" /> {item.rating}
                      </div>
                    </div>

                    {/* Navigation Button */}
                    <button
                      onClick={() => navigate(`/animal/${item.id}`)}
                      className="w-full bg-[#ffa502] hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm active:scale-[0.98]">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerDash;
