import React, { useState, useEffect } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import api from "../../services/api";

const BuyerDash = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-zinc-950 text-white min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
      {/* Content will go here */}
    </div>
  );
};

export default BuyerDash;
