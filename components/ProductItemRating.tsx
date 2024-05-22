"use client";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";

const ProductItemRating = ({ productRating }: { productRating: number }) => {
  // setting rating with all empty stars by default
  const rating: Array<string> = [
    "empty star",
    "empty star",
    "empty star",
    "empty star",
    "empty star",
  ];

  // going through product rating and modifying rating state
  for (let i = 0; i < productRating; i++) {
    rating[i] = "full star";
  }
  return (
    <div className="flex">
        { rating && rating?.map(singleRating => {
return (
    <div  key={nanoid()}>
    {singleRating === "full star" && <AiFillStar className="text-yellow-400 text-xl" />}
    {singleRating === "empty star" && <AiOutlineStar className="text-yellow-400 text-xl" />}
    </div>
    
)
        }) }

    </div>
  );
};

export default ProductItemRating;
