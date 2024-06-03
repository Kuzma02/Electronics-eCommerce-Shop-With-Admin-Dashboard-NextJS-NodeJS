"use client";
import { SectionTitle, WishItem } from "@/components";
import React, { useEffect, useState } from "react";
import { useWishlistStore } from "../_zustand/wishlistStore";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";

interface WishListItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}

const WishlistPage = () => {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState<WishListItem[]>([]);
  const [isWishItemDeleted, setIsWishItemDeleted] = useState<boolean>(false);

  const getWishlistByUserId = async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/wishlist/${id}`, {
      cache: "no-store",
    });
    const wishlist = await response.json();
    setWishlist(wishlist);
  };

  const getUserByEmail = async () => {
    if (session?.user?.email) {
      fetch(`http://localhost:3001/api/users/email/${session?.user?.email}`, {
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((data) => {
          getWishlistByUserId(data?.id);
        });
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email, isWishItemDeleted]);
  return (
    <div className="bg-white">
      <SectionTitle title="Wishlist" path="Home | Wishlist" />
      {wishlist && wishlist.length === 0 ? (
        <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
          No items found in the wishlist
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto">
          <div className="overflow-x-auto">
            <table className="table text-center">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-accent-content">Image</th>
                  <th className="text-accent-content">Name</th>
                  <th className="text-accent-content">Stock Status</th>
                  <th className="text-accent-content">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist &&
                  wishlist?.map((item) => (
                    <WishItem
                      id={item?.id}
                      title={item?.product?.title}
                      price={item?.product?.price}
                      image={item?.product?.mainImage}
                      slug={item?.product?.slug}
                      stockAvailabillity={item?.product?.inStock}
                      key={nanoid()}
                      isWishItemDeleted={isWishItemDeleted}
                      setIsWishItemDeleted={setIsWishItemDeleted}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
