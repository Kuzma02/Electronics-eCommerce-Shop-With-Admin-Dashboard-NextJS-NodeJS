import {
  ColorInput,
  QuantityInput,
  StockAvailabillity,
  UrgencyText,
  SingleProductRating,
  ProductTabs,
  AddToCartSingleProductBtn,
  BuyNowSingleProductBtn,
  SingleProductDynamicFields,
} from "@/components";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaHeart } from "react-icons/fa6";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const data = await fetch(
    `http://localhost:3000/api/products/${params.productSlug}`,
    { cache: "no-store" }
  );
  const product = await data.json();

  const imagesData = await fetch(
    `http://localhost:3000/api/images/${product.id}`,
    { cache: "no-store" }
  );
  const images = await imagesData.json();

  if (!product || product.error) {
    notFound();
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-5 px-5">
        <div>
          <Image
            src={`/${product?.mainImage}`}
            width={500}
            height={500}
            alt="main image"
            className="w-auto h-auto"
          />
          <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center max-[500px]:gap-x-1">
            {images?.map((imageItem: ImageItem) => (
              <Image
                key={imageItem.imageID}
                src={`/${imageItem.image}`}
                width={100}
                height={100}
                alt="laptop image"
                className="w-auto h-auto"
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-7 text-black max-[500px]:text-center">
          <SingleProductRating />
          <h1 className="text-3xl">{product?.title}</h1>
          <p className="text-xl font-semibold">${product?.price}</p>
          <UrgencyText stock={94} />
          <StockAvailabillity stock={94} />
          <SingleProductDynamicFields product={product} />
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
              <Image
                src="/visa.svg"
                width={50}
                height={50}
                alt="visa icon"
                className="w-auto h-auto"
              />
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
              <Image
                src="/paypal.svg"
                width={50}
                height={50}
                alt="paypal icon"
                className="w-auto h-auto"
              />
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
        <ProductTabs product={product} />
      </div>
    </div>
  );
};

export default SingleProductPage;
