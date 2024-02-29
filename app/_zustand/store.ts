import { create } from "zustand";

export type ProductInCart = {
  id: number;
  title: string;
  price: number;
  image: string;
};


export type State = {
  products: ProductInCart[];
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
};

export const useProductStore = create<State & Actions>((set) => ({
  products: [
    {
      id: 1,
      title: "Product 1",
      price: 22,
      image: "product1.webp"
    },
    {
        id: 2,
        title: "Product 2",
        price: 32,
        image: "product2.webp"
      },
  ],
  addToCart: (newProduct) => {
    set((state) => {
      console.log(state);

      return { products: [...state.products, newProduct] };
    });
  },
}));