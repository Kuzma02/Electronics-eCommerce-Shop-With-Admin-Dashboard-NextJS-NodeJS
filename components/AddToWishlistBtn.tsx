"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaHeartCrack } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";

interface AddToWishlistBtnProps {
  product: Product;
  slug: string;
}

const AddToWishlistBtn = ({ product, slug }: AddToWishlistBtnProps) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const [isInWishlist, setIsInWishlist] = useState<boolean>(
    wishlist.find((item) => item.id === product.id) === undefined ? false : true
  );
  

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.mainImage,
      slug: slug,
      stockAvailabillity: product.inStock
    });
    setIsInWishlist(true);
    toast.success("Product added to wishlist");
  };

  const handleRemoveFromWishlist = () => {
    removeFromWishlist(product.id);
    setIsInWishlist(false);
    toast.success("Product removed to wishlist");
  };

  return (
    <>
      {isInWishlist === false ? (
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={handleAddToWishlist}
        >
          <FaHeart className="text-xl text-custom-black" />
          <span className="text-lg">ADD TO WISHLIST</span>
        </p>
      ) : (
        <p
          className="flex items-center gap-x-2 cursor-pointer"
          onClick={handleRemoveFromWishlist}
        >
          <FaHeartCrack className="text-xl text-custom-black" />
          <span className="text-lg">REMOVE FROM WISHLIST</span>
        </p>
      )}
    </>
  );
};

export default AddToWishlistBtn;
