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
      {/* Content placeholder */}
    </div>
  );
};

export default BuyerDash;
