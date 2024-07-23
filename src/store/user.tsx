import { User } from "@/types";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user: User) => set({ user }),
      }),
      {
        name: "user",
      }
    )
  )
);
