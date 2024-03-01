"use client";
import React, { useState } from "react";
import ColorInput from "./ColorInput";
import QuantityInput from "./QuantityInput";
import AddToCartSingleProductBtn from "./AddToCartSingleProductBtn";
import BuyNowSingleProductBtn from "./BuyNowSingleProductBtn";

const SingleProductDynamicFields = ({ product } : { product: Product}) => {
    const [quantityCount, setQuantityCount] = useState<number>(1);
  return (
    <>
      <ColorInput />
      <QuantityInput quantityCount={quantityCount} setQuantityCount={setQuantityCount} />

      <div className="flex gap-x-5 max-[500px]:flex-col max-[500px]:items-center max-[500px]:gap-y-1">
        <AddToCartSingleProductBtn quantityCount={quantityCount} product={product} />
        <BuyNowSingleProductBtn />
      </div>
    </>
  );
};

export default SingleProductDynamicFields;
