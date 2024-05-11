import { create } from "zustand";

export type State = {
  page: number;
};

export type Actions = {
  incrementPage: () => void;
  decrementPage: () => void;
};

export const usePaginationStore = create<State & Actions>((set) => ({
  page: 1,
  incrementPage: () => {
    set((state: any) => {
      state.page = state.page + 1;
      return { page: state.page };
    });
  },
  decrementPage: () => {
    set((state: any) => {
      if (state.page !== 1) {
        state.page = state.page - 1;
        return { page: state.page };
      }
      return {page: 1};
    });
  },
}));
