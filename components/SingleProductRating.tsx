import { nanoid } from "nanoid";
import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const SingleProductRating = ({ rating }: { rating: number }) => {
  const ratingArray: Array<string> = [
    "empty star",
    "empty star",
    "empty star",
    "empty star",
    "empty star",
  ];

  // going through product rating and modifying rating state
  for (let i = 0; i < rating; i++) {
    ratingArray[i] = "full star";
  }
  return (
    <div className="flex text-2xl items-center max-[500px]:justify-center">
      {ratingArray &&
        ratingArray.map((singleRating) => {
          return (
            <>
              {singleRating === "full star" ? (
                <AiFillStar className="text-custom-yellow" />
              ) : (
                <AiOutlineStar className="text-custom-yellow" />
              )}
            </>
          );
        })}
      <span className="text-xl ml-1">(3 reviews)</span>
    </div>
  );
};

export default SingleProductRating;
