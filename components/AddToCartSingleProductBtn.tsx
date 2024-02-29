"use client";
import React from "react";
import { useProductStore } from "@/app/_zustand/store";

const AddToCartSingleProductBtn = ({ product } : { product: Product}) => {
  const { addToCart } = useProductStore();

  const handleAddToCart = () => {
    addToCart({
      id: product?.id,
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: 1
    });
  };
  return (
    <button
      onClick={handleAddToCart}
      className="btn w-[200px] text-lg border border-black border-2 font-normal bg-white text-black hover:bg-black hover:text-white hover:border-black rounded-md transition-colors uppercase ease-in max-[500px]:w-full"
    >
      Add to cart
    </button>
  );
};

export default AddToCartSingleProductBtn;
