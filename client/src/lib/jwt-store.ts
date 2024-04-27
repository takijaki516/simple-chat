"use client";

import { create } from "zustand";

interface jwtStore {
  token: string | null;
  setToken: (token: string) => void;
  // TODO: logout
}

export const useJwtStore = create<jwtStore>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
