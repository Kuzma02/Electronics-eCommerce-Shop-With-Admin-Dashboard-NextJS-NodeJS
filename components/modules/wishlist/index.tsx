'use client';
import { useWishlistStore } from '@/app/_zustand/wishlistStore';
import WishItem from '@/components/WishItem';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';

export const WishlistModule = () => {
  const { data: session } = useSession();
  const { wishlist, setWishlist } = useWishlistStore();

  const getWishlistByUserId = useCallback(
    async (id: string) => {
      const response = await fetch(`http://localhost:3001/api/wishlist/${id}`, {
        cache: 'no-store',
      });
      const wishlistData = await response.json();

      const productArray = wishlistData.map((item: any) => ({
        id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        image: item?.product?.mainImage,
        slug: item?.product?.slug,
        stockAvailabillity: item?.product?.inStock,
      }));

      setWishlist(productArray);
    },
    [setWishlist],
  );

  const getUserByEmail = useCallback(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:3001/api/users/email/${session.user.email}`, {
        cache: 'no-store',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.id) {
            getWishlistByUserId(data.id);
          }
        });
    }
  }, [session?.user?.email, getWishlistByUserId]);

  useEffect(() => {
    getUserByEmail();
  }, [getUserByEmail]);

  return (
    <>
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
                {wishlist?.map((item) => (
                  <WishItem
                    key={item.id} // ✅ stable key
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    image={item.image}
                    slug={item.slug}
                    stockAvailabillity={item.stockAvailabillity}
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
