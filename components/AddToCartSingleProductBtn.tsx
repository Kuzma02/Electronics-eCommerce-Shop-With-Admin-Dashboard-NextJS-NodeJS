"use client";
import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";

interface AddToCartSingleProductBtnProps {
  product: Product;
  quantityCount: number;
} 

const AddToCartSingleProductBtn = ({ product, quantityCount } : AddToCartSingleProductBtnProps) => {
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = () => {
    addToCart({
      id: product?.id,
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount
    });
    calculateTotals();
    toast.success("Product added to the cart");
  };
  return (
    <button
      onClick={handleAddToCart}
      className="btn w-[200px] text-lg border border-gray-300 border-1 font-normal bg-white text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:scale-110 transition-all uppercase ease-in max-[500px]:w-full"
    >
      Add to cart
    </button>
  );
};

export default AddToCartSingleProductBtn;
