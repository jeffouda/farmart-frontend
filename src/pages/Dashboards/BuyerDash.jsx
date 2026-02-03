import React, { useState, useEffect } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
// Import your central API configuration
import api from "../../services/api";

const BuyerDash = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        // Axios uses the baseURL from your api.js automatically
        const response = await api.get("/wishlist");

        // Axios puts the response body in .data
        const data = response.data;
        setWishlist(Array.isArray(data) ? data : data.items || []);
      } catch (err) {
        console.error("API Error:", err);
        // Fallback mock data
        setWishlist([
          {
            id: 1,
            breed: "Boer",
            category: "Goat",
            location: "Nairobi, Kenya",
            price: 15000,
            dateAdded: "1/30/2026",
            image: "https://via.placeholder.com/300x200",
          },
          {
            id: 2,
            breed: "Kuroiler",
            category: "Poultry",
            location: "Kisumu, Kenya",
            price: 800,
            dateAdded: "1/30/2026",
            image: "https://via.placeholder.com/300x200",
          },
          {
            id: 3,
            breed: "Large White",
            category: "Pig",
            location: "Thika, Kenya",
            price: 25000,
            dateAdded: "1/30/2026",
            image: "https://via.placeholder.com/300x200",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToCart = async (itemId) => {
    try {
      await api.post("/cart", { id: itemId });
      alert("Added to cart!");
    } catch (err) {
      console.error("Cart Error:", err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/wishlist/${itemId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="bg-white text-zinc-100 min-h-screen">
      <main className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">My Wishlist</h1>
          <span className="text-white font-medium">
            {wishlist.length} items
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
            <p>Fetching your farm items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition-colors">
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.breed}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-zinc-900/90 text-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-all shadow-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Container */}
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {item.breed}
                    </h3>
                    <p className="text-zinc-400 text-sm">{item.category}</p>
                    <p className="text-zinc-500 text-xs mt-1">
                      {item.location}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mb-5">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                        Price
                      </p>
                      <p className="text-green-500 font-bold text-xl">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[10px] text-zinc-600 italic">
                      Added {item.dateAdded}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-900/20">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerDash;
