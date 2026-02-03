import React, { useState, useEffect } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
// Import your central API configuration
import api from "../../services/api";

const BuyerDash = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data on Mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        // Axios uses the baseURL from your api.js
        const response = await api.get("/wishlist");

        // Ensure we set an array to avoid .map() errors
        const data = response.data;
        setWishlist(Array.isArray(data) ? data : data.items || []);
      } catch (err) {
        console.error("API Error:", err);
        // Fallback mock data for development
        setWishlist([
          {
            id: 1,
            breed: "Boer",
            category: "Goat",
            location: "Nairobi, Kenya",
            price: 15000,
            dateAdded: "1/30/2026",
            image:
              "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=400",
          },
          {
            id: 2,
            breed: "Kuroiler",
            category: "Poultry",
            location: "Kisumu, Kenya",
            price: 800,
            dateAdded: "1/30/2026",
            image:
              "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400",
          },
          {
            id: 3,
            breed: "Large White",
            category: "Pig",
            location: "Thika, Kenya",
            price: 25000,
            dateAdded: "1/30/2026",
            image:
              "https://images.unsplash.com/photo-1544225580-3ef372242826?auto=format&fit=crop&w=400",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // 2. Action: Add to Cart
  const handleAddToCart = async (itemId) => {
    try {
      await api.post("/cart", { id: itemId });
      alert("Added to cart!");
    } catch (err) {
      console.error("Cart Error:", err);
    }
  };

  // 3. Action: Remove from Wishlist
  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/wishlist/${itemId}`);
      // Optimistic UI update: remove from local state immediately
      setWishlist((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="bg-slate-50 text-zinc-900 min-h-screen">
      <main className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-800">
            My Wishlist
          </h1>
          <span className="text-zinc-500 font-medium">
            {wishlist.length} items
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
            <p className="font-medium">Fetching your farm items...</p>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300">
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden bg-zinc-100">
                  <img
                    src={item.image}
                    alt={item.breed}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 text-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    title="Remove from wishlist">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Container */}
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-zinc-800">
                      {item.breed}
                    </h3>
                    <p className="text-zinc-500 text-sm font-medium">
                      {item.category}
                    </p>
                    <p className="text-zinc-400 text-xs mt-1">
                      📍 {item.location}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mb-5">
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">
                        Price
                      </p>
                      <p className="text-green-600 font-bold text-xl">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[10px] text-zinc-400 italic">
                      Added {item.dateAdded}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm shadow-green-200">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State Fallback */}
        {!loading && wishlist.length === 0 && (
          <div className="text-center py-24 bg-white border border-dashed border-zinc-300 rounded-2xl">
            <p className="text-zinc-500">Your wishlist is currently empty.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerDash;
