import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const SingleProductRating = () => {
  return (
    <div className="flex text-2xl items-center">
      <AiFillStar className="text-custom-yellow" />
      <AiFillStar className="text-custom-yellow" />
      <AiFillStar className="text-custom-yellow" />
      <AiFillStar className="text-custom-yellow" />
      <AiOutlineStar className="text-custom-yellow" />
      <span className="text-xl ml-1">(3 reviews)</span>
    </div>
  );
};

export default SingleProductRating;
