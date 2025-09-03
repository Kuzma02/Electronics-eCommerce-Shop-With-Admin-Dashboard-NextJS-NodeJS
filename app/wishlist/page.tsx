import { SectionTitle } from "@/components";
import { Loader } from "@/components/Loader";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

import { WishlistModule } from "@/components/modules/wishlist"; //slow

// const DynamicWishlistModule = dynamic(
//   () =>
//     (async () => {
//       const mod = await import("@/components/modules/wishlist");
//       return mod.WishlistModule
//     })(),
//   { ssr: false }
// );


const WishlistPage = () => {
  return (
    <div className="bg-white">
      <SectionTitle title="Wishlist" path="Home | Wishlist" />
      <Suspense fallback={<Loader />}>
        <WishlistModule />
      </Suspense>
    </div>
  );
};

export default WishlistPage;
