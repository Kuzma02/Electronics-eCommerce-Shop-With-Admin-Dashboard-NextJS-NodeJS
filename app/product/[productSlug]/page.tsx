import {
  ColorInput,
  QuantityInput,
  StockAvailabillity,
  UrgencyText,
  SingleProductRating,
  ProductTabs,
} from "@/components";
import Image from "next/image";
import React from "react";
import { FaHeart } from "react-icons/fa6";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";

const SingleProductPage = () => {
  return (
    <div className="max-w-screen-2xl mx-auto">
    <div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-5 px-5">
      <div>
        <Image src="/laptop 1.webp" width={500} height={500} alt="main image" />
        <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center max-[500px]:gap-x-1">
          <Image
            src="/laptop 1.webp"
            width={100}
            height={100}
            alt="laptop image"
          />
          <Image
            src="/laptop 2.webp"
            width={100}
            height={100}
            alt="laptop image"
          />
          <Image
            src="/laptop 3.webp"
            width={100}
            height={100}
            alt="laptop image"
          />
          <Image
            src="/laptop 4.webp"
            width={100}
            height={100}
            alt="laptop image"
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-7 text-black max-[500px]:text-center">
        <SingleProductRating />
        <h1 className="text-3xl">Tablet keyboard</h1>
        <p className="text-xl font-semibold">$52.00</p>
        <UrgencyText stock={94} />
        <StockAvailabillity stock={94} />
        <ColorInput />
        <QuantityInput />
        <div className="flex gap-x-5 max-[500px]:flex-col max-[500px]:items-center max-[500px]:gap-y-1">
          <button className="btn w-[200px] text-lg border border-black border-2 font-normal bg-white text-black hover:bg-black hover:text-white hover:border-black rounded-md transition-colors uppercase ease-in max-[500px]:w-full">
            Add to cart
          </button>
          <button className="btn w-[200px] text-lg border border-black hover:border-black border-2 font-normal bg-custom-yellow text-black hover:bg-black hover:text-white rounded-md transition-colors uppercase ease-in max-[500px]:w-full">
            Buy Now
          </button>
        </div>
        <div className="flex flex-col gap-y-2 max-[500px]:items-center">
          <p className="flex items-center gap-x-2">
            <FaHeart className="text-lg text-custom-black" />
            <span className="text-lg">WISHLIST</span>
          </p>
          <p className="text-lg">
            SKU: <span className="ml-1">abccd-18</span>
          </p>
          <div className="text-lg flex gap-x-2">
            <span>Share:</span>
            <div className="flex items-center gap-x-1 text-2xl">
              <FaSquareFacebook />
              <FaSquareXTwitter />
              <FaSquarePinterest />
            </div>
          </div>
          <div className="flex gap-x-2">
            <Image src="/visa.svg" width={50} height={50} alt="visa icon" />
            <Image
              src="/mastercard.svg"
              width={50}
              height={50}
              alt="mastercard icon"
              className="h-auto w-auto"
            />
            <Image
              src="/ae.svg"
              width={50}
              height={50}
              alt="americal express icon"
              className="h-auto w-auto"
            />
            <Image src="/paypal.svg" width={50} height={50} alt="paypal icon" />
            <Image
              src="/dinersclub.svg"
              width={50}
              height={50}
              alt="diners club icon"
              className="h-auto w-auto"
            />
            <Image
              src="/discover.svg"
              width={50}
              height={50}
              alt="discover icon"
              className="h-auto w-auto"
            />
          </div>
        </div>
      </div>

      

    </div>
    <div className="py-16">
    <ProductTabs />

    </div>

    </div>
  );
};

export default SingleProductPage;
