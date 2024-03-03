"use client";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";

const ProductItemRating = ({ productRating }: { productRating: number }) => {
  const [rating, setRating] = useState([
    "empty star",
    "empty star",
    "empty star",
    "empty star",
    "empty star",
  ]);

  for (let i = 0; i < productRating; i++) {
    rating[i] = "full star";
  }
  return (
    <div className="flex">
        { rating.map(singleRating => {
return (
    <>
    {singleRating === "full star" && <AiFillStar key={nanoid()} />}
    {singleRating === "empty star" && <AiOutlineStar key={nanoid()} />}
    </>
    
)
        }) }

    </div>
  );
};

export default ProductItemRating;
