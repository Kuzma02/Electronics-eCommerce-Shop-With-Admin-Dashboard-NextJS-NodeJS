"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import WishlistCard from "./WishListCard";
import { deleteWishlist, getWishlistByUserId } from "@/lib/services/wishlist";
import toast from "react-hot-toast";


export const WishlistModule = () => {

  const { data: session, status } = useSession();
  const [wishlist, setWishlist ] = useState<WishListItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {removeFromWishlist} = useWishlistStore();

  const fetchWishlist = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const data = await getWishlistByUserId(session?.user?.id);
      setWishlist(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const products = wishlist?.map((item)=>{
     return item.product
  });


  //remove from whislist 
  const handleRemoveWishlist = async (id: string) => {
  try {
    const userId = session?.user?.id;
    if (!userId) {
      toast.error("Please login");
      return;
    }

    await deleteWishlist({
      userId,
      productId: id,
    });

    // Update Zustand immediately
    removeFromWishlist(id);
    toast.success("Product removed");
    // sync with server
    await fetchWishlist();

  } catch (error) {
    console.error(error);
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to remove item"
    );
  }
};

  // fetch wishlist products
 useEffect(() => {
  if (session?.user?.id) {
    fetchWishlist();
  }
}, [session?.user?.id]);


console.log(products);

  return (
    <>
      {products && products.length === 0 ? (
        <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
          No items found in the wishlist
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((item) => (
              <WishlistCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                image={item.mainImage}
                slug={item.slug}
                stockAvailabillity={item.inStock}
                product={item}
                quantityCount ={1}
                onRemove = {handleRemoveWishlist}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
