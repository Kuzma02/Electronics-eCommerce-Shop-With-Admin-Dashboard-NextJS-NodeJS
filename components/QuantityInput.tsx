"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

interface QuantityInputProps {
  quantityCount: number;
  setQuantityCount: React.Dispatch<React.SetStateAction<number>>;
}

const QuantityInput = ({quantityCount, setQuantityCount} : QuantityInputProps) => {


  const handleQuantityChange = (actionName: string): void => {
    if (actionName === "plus") {
      setQuantityCount(quantityCount + 1);
    } else if (actionName === "minus" && quantityCount !== 1) {
      setQuantityCount(quantityCount - 1);
    }
  };

  return (
    <div className="flex items-center gap-x-4 max-[500px]:justify-center">
      <p className="text-xl">Quantity: </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="size-10 leading-10 text-gray-600 transition hover:opacity-75 flex justify-center items-center border"
          onClick={() => handleQuantityChange("minus")}
        >
          <FaMinus />
        </button>

        <input
          type="number"
          id="Quantity"
          disabled={true}
          value={quantityCount}
          className="h-10 w-24 rounded border-gray-200 sm:text-sm"
        />

        <button
          type="button"
          className="size-10 leading-10 text-gray-600 transition hover:opacity-75 flex justify-center items-center border"
          onClick={() => handleQuantityChange("plus")}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
