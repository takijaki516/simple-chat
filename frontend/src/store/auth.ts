import { create } from "zustand";

export type AuthState =
  | { token: null; username: null; userId: null }
  | { token: string; username: string; userId: string };

interface authStore {
  auth: AuthState;
  setAuth: (data: AuthState) => void;
  // TODO: add logout
}

export const useAuthStore = create<authStore>((set) => ({
  auth: { token: null, username: null, userId: null },
  setAuth: (auth) => set({ auth }),
}));
