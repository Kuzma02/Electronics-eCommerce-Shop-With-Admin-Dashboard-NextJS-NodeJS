"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { SectionTitle, WishItem } from "@/components";
import React from "react";
import { useWishlistStore } from "../_zustand/wishlistStore";
import { nanoid } from "nanoid";

const WishlistPage = () => {
  const { wishlist } = useWishlistStore();
  return (
    <>
      <SectionTitle title="Wishlist" path="Home | Wishlist" />
      {wishlist.length === 0 ? (
        <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">No items found in the wishlist</h3>
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
                {wishlist.map((item) => (
                  <WishItem
                    id={item?.id}
                    title={item?.title}
                    price={item?.price}
                    image={item?.image}
                    slug={item?.slug}
                    key={nanoid()}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistPage;
