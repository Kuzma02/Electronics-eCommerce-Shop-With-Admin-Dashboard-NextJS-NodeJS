// *********************
// Role of the component: Helper component for seperating dynamic client component from server component on the single product page with the intention to preserve SEO benefits of Next.js
// Name of the component: SingleProductDynamicFields.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SingleProductDynamicFields product={product} />
// Input parameters: { product: Product }
// Output: Quantity, add to cart and buy now component on the single product page
// *********************

"use client";
import React, { useState } from "react";
import QuantityInput from "./QuantityInput";
import AddToCartSingleProductBtn from "./AddToCartSingleProductBtn";
import BuyNowSingleProductBtn from "./BuyNowSingleProductBtn";
import WishlistButton from "./modules/wishlist/WishListButton";
import WishListButton from "./modules/wishlist/WishListButton";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import toast from "react-hot-toast";
import { addToWishlist } from "@/lib/services/wishlist";

const SingleProductDynamicFields = ({ product }: { product: Product }) => {
  const [quantityCount, setQuantityCount] = useState<number>(1);
  const [isWishListed, setIsWishListed] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const { addToWishlistStore } = useWishlistStore();

  const handleAddToWishList = async () => {
  if (!session?.user) {
    toast.error("Please log in to add items to your wishlist.");
    return;
  }
  try {
    const wishlistData = {
      userId: session.user.id,
      productId: product.id,
    };
    // Wishlist Api Call
     await addToWishlist(wishlistData);
    // Update UI
    addToWishlistStore(product);
    setIsWishListed(true);

    toast.success("Added to wishlist ❤️");

  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  }
};
  
  
  return (
    <>
      <QuantityInput
        quantityCount={quantityCount}
        setQuantityCount={setQuantityCount}
      />
      {Boolean(product.inStock) && (
        <div className="flex gap-x-5 max-[500px]:flex-col max-[500px]:items-center max-[500px]:gap-y-1">
          <AddToCartSingleProductBtn
            quantityCount={quantityCount}
            product={product}
          />
          <WishListButton
            product={product}
            isWishListed ={isWishListed}
            handleAddToWishList= {handleAddToWishList}
          />
        </div>
      )}
    </>
  );
};

export default SingleProductDynamicFields;
