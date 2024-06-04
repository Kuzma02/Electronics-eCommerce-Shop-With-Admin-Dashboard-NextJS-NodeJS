// *********************
// Role of the component: Wishlist item component for wishlist page
// Name of the component: WishItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <WishItem id={id} title={title} price={price} image={image} slug={slug} stockAvailabillity={stockAvailabillity} />
// Input parameters: ProductInWishlist interface
// Output: single wishlist item on the wishlist page
// *********************

"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { FaHeartCrack } from "react-icons/fa6";
import { deleteWishItem } from "@/app/actions";

interface wishItemStateTrackers {
  isWishItemDeleted: boolean;
  setIsWishItemDeleted: any; 
}

const WishItem = ({
  id,
  title,
  price,
  image,
  slug,
  stockAvailabillity
}: ProductInWishlist) => {
  // getting from Zustand wishlist store
  const { removeFromWishlist } = useWishlistStore();
  const router = useRouter();

  const openProduct = (slug: string): void => {
    router.push(`/product/${slug}`);
  };

  const removeItemFromWishlist = async (id: string) => {
    deleteWishItem(id);
    toast.success("Item removed from your wishlist");
  };

  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <th
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {id}
      </th>
      <th>
        <div className="w-12 h-12 mx-auto" onClick={() => openProduct(slug)}>
          <Image
            src={`/${image}`}
            width={200}
            height={200}
            className="w-auto h-auto"
            alt={title}
          />
        </div>
      </th>
      <td
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {title}
      </td>
      <td
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {stockAvailabillity ? (
          <span className="text-success">In stock</span>
        ) : (
          <span className="text-error">Out of stock</span>
        )}
      </td>
      <td>
        <button className="btn btn-xs bg-blue-500 text-white hover:text-blue-500 border border-blue-500 hover:bg-white hover:text-blue-500 text-sm">
          <FaHeartCrack />
          <span
            className="max-sm:hidden"
            onClick={() => removeItemFromWishlist(id)}
          >
            remove from the wishlist
          </span>
        </button>
      </td>
    </tr>
  );
};

export default WishItem;
