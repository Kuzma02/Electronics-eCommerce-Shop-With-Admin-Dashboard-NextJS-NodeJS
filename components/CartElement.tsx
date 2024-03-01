"use client";
import Link from 'next/link'
import React from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { useProductStore } from "@/app/_zustand/store";

const CartElement = () => {
    const { allQuantity } = useProductStore();
  return (
    <div className="relative">
            <Link href="/cart">
              <FaCartShopping className="text-2xl text-black" />
              <span className="block w-5 h-5 bg-custom-yellow text-black rounded-full flex justify-center items-center absolute  top-[-10px] right-[-20px]">
                { allQuantity }
              </span>
            </Link>
          </div>
  )
}

export default CartElement