import { Heart } from "lucide-react";
import { useState } from "react";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { addToWishlist } from "@/lib/services/wishlist";


export default function WishListButton({ product , handleAddToWishList , isWishListed }: WishListProps) {


  return (
    <button
      onClick={handleAddToWishList}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
        isWishListed
          ? "bg-red-100 text-red-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <Heart size={18} fill={isWishListed ? "currentColor" : "none"} />
      {isWishListed ? "Wishlisted" : "Add to Wishlist"}
    </button>
  );
}
