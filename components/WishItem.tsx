// *********************
// Role of the component: Single row in the wishlist table
// Name of the component: WishItem.tsx
// Component call: <WishItem id={id} title={title} price={price} image={image} slug={slug} stockAvailabillity={stockAvailabillity} />
// Input parameters: { id: string; title: string; price: number; image: string; slug: string; stockAvailabillity: number; }
// Output: Table row with product image, name, stock status and a remove action
// *********************

"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaXmark } from "react-icons/fa6";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { sanitize } from "@/lib/sanitize";

const WishItem = ({
  id,
  title,
  price,
  image,
  slug,
  stockAvailabillity,
}: {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
}) => {
  const { data: session } = useSession();
  const { removeFromWishlist } = useWishlistStore();

  const handleRemove = async () => {
    if (!session?.user?.email) {
      return;
    }

    try {
      const userResponse = await apiClient.get(
        `/api/users/email/${session.user.email}`
      );
      const user = await userResponse.json();

      await apiClient.delete(`/api/wishlist/${user.id}/${id}`);
      removeFromWishlist(id);
      toast.success("Product removed from the wishlist");
    } catch (error) {
      toast.error("Error while removing product from the wishlist");
    }
  };

  return (
    <tr>
      <td>
        <button type="button" onClick={handleRemove} aria-label="Remove from wishlist">
          <FaXmark className="text-xl" />
        </button>
      </td>
      <td>
        <Link href={`/product/${slug}`}>
          <Image
            src={image ? `/${image}` : "/product_placeholder.jpg"}
            width={80}
            height={80}
            alt={sanitize(title) || "Product image"}
            className="mx-auto"
          />
        </Link>
      </td>
      <td>
        <Link href={`/product/${slug}`}>{sanitize(title)}</Link>
      </td>
      <td>{stockAvailabillity > 0 ? "In stock" : "Out of stock"}</td>
      <td>
        <Link
          href={`/product/${slug}`}
          className="uppercase bg-white px-5 py-2 text-base border border-black border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2"
        >
          View product
        </Link>
      </td>
    </tr>
  );
};

export default WishItem;
