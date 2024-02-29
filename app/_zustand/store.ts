import { create } from "zustand";

export type ProductInCart = {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
};

export type State = {
  products: ProductInCart[];
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
};

export const useProductStore = create<State & Actions>((set) => ({
  products: [],
  addToCart: (newProduct) => {
    set((state) => {
      const cartItem = state.products.find(item => item.id === newProduct.id);
      if(!cartItem){
        return { products: [...state.products, newProduct] };
      }else{
        state.products.map(product => {
          if(product.id === cartItem.id){
            product.amount += newProduct.amount;
          }
        })
        
      }
      return { products: [...state.products] };
      
    });
  },
}));
