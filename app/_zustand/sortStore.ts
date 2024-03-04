import { create } from "zustand";

export type State = {
  sortBy: string;
};

export type Actions = {
  changeSortBy: (mode: string) => void;
};

export const useSortStore = create<State & Actions>((set) => ({
  sortBy: "defaultSort",
  changeSortBy: (mode: string) => {
    set((state) => {
      return { sortBy: mode };
    });
  },
}));
