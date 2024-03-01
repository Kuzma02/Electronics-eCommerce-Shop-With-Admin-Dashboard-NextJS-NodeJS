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
  removeFromCart: (id: number) => void;
  updateCartAmount: (id: number, quantity: number) => void;
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

  removeFromCart: (id) => {
    set((state) => {

      state.products = state.products.filter((product: ProductInCart) => product.id !== id);
      return { products: state.products };
    });
  },

  updateCartAmount: (id, amount) => {
    set((state) => {
      const cartItem = state.products.find((item) => item.id === id)!;
      
      if(!cartItem){
        return { products: [...state.products] };
      }else{
        state.products.map(product => {
          if(product.id === cartItem.id){
            product.amount = amount;
          }
        })
        
      }

      
      return { products: [...state.products] };
    });
  },

  /**
   updateCartAmount: (state, action) => {
            const cartItem = state.cartItems.find(item => item.id === action.payload.id);
            cartItem.amount = Number(action.payload.amount);
            cartSlice.caseReducers.calculateTotals(state);
        },
   */

}));
