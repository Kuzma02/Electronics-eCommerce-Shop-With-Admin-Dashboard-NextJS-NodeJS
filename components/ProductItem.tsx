import Image from "next/image";
import React from "react";
import CustomButton from "./CustomButton";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";



const ProductItem = ({product, color} : {product: Product, color: string}) => {



  return (
    <div className="flex flex-col items-center gap-y-2">
      <Link href={`/product/${product.slug}`}>
        <Image src={ product.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg"} width={300} height={300} className="h-[300px] w-[300px]" alt="product 1" />
      </Link>
      <Link href={`/product/${product.slug}`} className={color === "black" ? `text-2xl text-black font-normal mt-2` : `text-2xl text-white font-normal mt-2`}>
        { product.title }
      </Link>
      <p className={color === "black" ? "text-xl text-black font-semibold" : "text-xl text-white font-semibold"}>${product.price}</p>
      
      <ProductItemRating productRating={product?.rating} />

      <CustomButton
        textSize="base"
        buttonType="button"
        customWidth="full"
        text="Add to cart"
        paddingX={0}
        paddingY={2}
      />
    </div>
  );
};

export default ProductItem;
