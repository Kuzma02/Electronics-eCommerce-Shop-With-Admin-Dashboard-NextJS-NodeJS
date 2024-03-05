export const dynamic = "force-dynamic";
export const revalidate = 0;
import { CustomButton, SectionTitle, WishItem } from "@/components";
import Image from "next/image";
import React from "react";

const WishlistPage = () => {
  return (
    <>
      <SectionTitle title="Wishlist" path="Home | Wishlist" />
      <div className="max-w-screen-2xl mx-auto">
        <div className="overflow-x-auto">
          <table className="table text-center">
            <thead>
              <tr>
                <th></th>
                <th className="text-accent-content">Image</th>
                <th className="text-accent-content">Name</th>
                <th className="text-accent-content">Size</th>
                <th className="text-accent-content">Action</th>
              </tr>
            </thead>
            <tbody>
              <WishItem />
              <WishItem />
              <WishItem />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
