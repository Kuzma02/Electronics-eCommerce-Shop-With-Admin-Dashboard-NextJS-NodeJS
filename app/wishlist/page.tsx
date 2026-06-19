import { SectionTitle } from "@/components";
import { Loader } from "@/components/Loader";
import { WishlistModule } from "@/components/modules/wishlist";
import { Suspense } from "react";

const WishlistPage = () => {
  return (
    <div className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="flex justify-center  mb-2">
            <h1 className=" ml-4 text-lg sm:text-xl  font-bold tracking-tight text-gray-900 ">
              Wishlist
            </h1>
          </div>

          <Suspense fallback={<Loader />}>
            <WishlistModule />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
