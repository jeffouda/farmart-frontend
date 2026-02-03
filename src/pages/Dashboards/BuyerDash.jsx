import React, { useState, useEffect } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import api from "../../services/api";

const BuyerDash = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-zinc-950 text-white min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <span className="text-zinc-500">{wishlist.length} items</span>
      </div>
      {/* Replace placeholder with this */}
      {loading ? (
        <p className="text-center text-zinc-500 py-20">Loading...</p>
      ) : (
        <div className="text-zinc-500 text-center">
          No items found in wishlist.
        </div>
        {/* Replace the 'No items found' div with this */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {wishlist.map((item) => (
    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <img src={item.image} alt={item.breed} className="rounded-lg h-40 w-full object-cover mb-4" />
      <h3 className="font-bold text-lg">{item.breed}</h3>
      <p className="text-zinc-400 text-sm mb-4">{item.location}</p>
      {/* Price and Buttons will go here */}
    </div>
  
      
  );
};

export default BuyerDash;
