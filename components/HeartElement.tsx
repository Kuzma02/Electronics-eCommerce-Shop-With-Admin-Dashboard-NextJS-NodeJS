"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa6";

const HeartElement = () => {
  const { wishlist } = useWishlistStore();
  return (
    <div className="relative">
      <Link href="/wishlist">
        <FaHeart className="text-2xl text-black" />
        <span className="block w-5 h-5 bg-custom-yellow text-black rounded-full flex justify-center items-center absolute  top-[-10px] right-[-20px]">
          { wishlist.length }
        </span>
      </Link>
    </div>
  );
};

export default HeartElement;
