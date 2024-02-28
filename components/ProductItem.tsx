import Image from "next/image";
import React from "react";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import CustomButton from "./CustomButton";
import Link from "next/link";

const ProductItem = () => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <Link href="/product/1">
        <Image src="/product1.webp" width={300} height={300} alt="product 1" />
      </Link>
      <Link href="/product/1" className="text-lg">
        Smart Phone
      </Link>
      <p>$22.00</p>
      <div className="flex">
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiFillStar />
        <AiOutlineStar />
      </div>
      <CustomButton
        textSize="sm"
        buttonType="button"
        customWidth="full"
        text="Add to cart"
        paddingX={0}
        paddingY={3}
      />
    </div>
  );
};

export default ProductItem;
