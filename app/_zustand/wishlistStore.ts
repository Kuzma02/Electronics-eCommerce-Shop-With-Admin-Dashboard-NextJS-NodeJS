import { create } from "zustand";



export type State = {
  wishlist: ProductInWishlist[];
};

export type Actions = {
  addToWishlist: (product: ProductInWishlist) => void;
  removeFromWishlist: (id: number) => void;
};

export const useWishlistStore = create<State & Actions>((set) => ({
  wishlist: [],
  addToWishlist: (product) => {
    set((state) => {
      const productInWishlist = state.wishlist.find(
        (item) => product.id === item.id
      );

      if (productInWishlist === undefined) {
        return { wishlist: [...state.wishlist, product] };
      } else {
        return { wishlist: [...state.wishlist] };
      }
    });
  },
  removeFromWishlist: (id) => {
    set((state) => {
      const productInWishlist = state.wishlist.find(
        (item) => id === item.id
      );

      if (productInWishlist === undefined) {
        return { wishlist: [...state.wishlist] };
      } else {
        const newWishlist = state.wishlist.filter(item => item.id !== id);
        return { wishlist: [...newWishlist] };
      }
    });
  },
}));
