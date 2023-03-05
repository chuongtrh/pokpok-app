import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: {},
  setUserStore: (data) => set((state) => ({ user: data })),
}));
