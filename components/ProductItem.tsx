import Image from "next/image";
import React from "react";
import CustomButton from "./CustomButton";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";



const ProductItem = ({product} : {product: Product}) => {



  return (
    <div className="flex flex-col items-center gap-y-2">
      <Link href={`/product/${product.slug}`}>
        <Image src={ product.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg"} width={300} height={350} className="h-[350px] w-[300px]" alt="product 1" />
      </Link>
      <Link href={`/product/${product.slug}`} className="text-lg">
        { product.title }
      </Link>
      <p>${product.price}</p>
      
      <ProductItemRating productRating={product?.rating} />

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
