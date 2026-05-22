import { Reel } from "@/generated/prisma/client";
import { create } from "zustand";

type ReelState = {
  reels: Reel[];

  setReel: (value: Reel[]) => void;
  addReel: (value: Reel) => void;

  updateReel: (value: Reel) => void;
  removeReel: (id: string) => void;

  resetReel: () => void;
};

export const useReelStore = create<ReelState>((set) => ({
  reels: [],

  setReel: (reels) =>
    set({
      reels,
    }),
  addReel: (newReel) =>
    set((state) => ({
      reels: [newReel, ...state.reels],
    })),

  updateReel: (updatedReel) =>
    set((state) => {
      const exists = state.reels.some((reel) => reel.id === updatedReel.id);

      if (exists) {
        return {
          reels: state.reels.map((reel) =>
            reel.id === updatedReel.id ? updatedReel : reel,
          ),
        };
      }

      return {
        reels: [updatedReel, ...state.reels],
      };
    }),

  removeReel: (id) =>
    set((state) => ({
      reels: state.reels.filter((reel) => reel.id !== id),
    })),

  resetReel: () =>
    set({
      reels: [],
    }),
}));
