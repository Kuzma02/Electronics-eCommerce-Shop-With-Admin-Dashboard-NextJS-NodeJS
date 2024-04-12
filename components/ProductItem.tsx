import Image from "next/image";
import React from "react";
import CustomButton from "./CustomButton";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={
            product.mainImage
              ? `/${product.mainImage}`
              : "/product_placeholder.jpg"
          }
          width={300}
          height={300}
          className="h-[300px] w-[300px]"
          alt="product 1"
        />
      </Link>
      <Link
        href={`/product/${product.slug}`}
        className={
          color === "black"
            ? `text-2xl text-black font-normal mt-2`
            : `text-2xl text-white font-normal mt-2`
        }
      >
        {product.title}
      </Link>
      <p
        className={
          color === "black"
            ? "text-xl text-black font-semibold"
            : "text-xl text-white font-semibold"
        }
      >
        ${product.price}
      </p>

      <ProductItemRating productRating={product?.rating} />
      <Link
        href={`/product/${product?.slug}`}
        className="block flex justify-center items-center w-full uppercase bg-white px-0 py-2 text-base border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-black hover:bg-gray-100 focus:outline-none focus:ring-2"
      >
        <p>View product</p>
      </Link>
    </div>
  );
};

export default ProductItem;
