import { create } from "zustand";

export type State = {
  wishlist: ProductInWishlist[];
  wishQuantity: number;
};

export type Actions = {
  addToWishlist: (product: ProductInWishlist) => void;
  removeFromWishlist: (id: string) => void;
  setWishlist: (wishlist: ProductInWishlist[]) => void;
};

export const useWishlistStore = create<State & Actions>((set) => ({
  wishlist: [],
  wishQuantity: 0,
  addToWishlist: (product) => {
    set((state) => {
      const productInWishlist = state.wishlist.find(
        (item) => product.id === item.id
      );

      if (productInWishlist === undefined) {
        return { wishlist: [...state.wishlist, product], wishQuantity: state.wishlist.length };
      } else {
        return { wishlist: [...state.wishlist], wishQuantity: state.wishlist.length };
      }
    });
  },
  removeFromWishlist: (id) => {
    set((state) => {
      const productInWishlist = state.wishlist.find((item) => id === item.id);

      if (productInWishlist === undefined) {
        return { wishlist: [...state.wishlist], wishQuantity: state.wishlist.length };
      } else {
        const newWishlist = state.wishlist.filter((item) => item.id !== id);
        return { wishlist: [...newWishlist], wishQuantity: state.wishlist.length };
      }
    });
  },
  setWishlist: (wishlist: ProductInWishlist[]) => {
    set((state) => {
      console.log("WStore");
      console.log(wishlist);
      
      
      return { wishlist: [...wishlist], wishQuantity: wishlist.length };
    });
  },
}));
