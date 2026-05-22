import { ReelView } from "@/generated/prisma/client";
import { create } from "zustand";

type ReelViewState = {
  reelViews: ReelView[];

  setReelViews: (value: ReelView[]) => void;

  addReelView: (value: ReelView) => void;
  updateReelView: (value: ReelView) => void;
  removeReelView: (id: string) => void;

  resetReelViews: () => void;
};

export const useReelViewStore = create<ReelViewState>((set) => ({
  reelViews: [],

  setReelViews: (reelViews) =>
    set({
      reelViews,
    }),

  addReelView: (newReelView) =>
    set((state) => ({
      reelViews: [newReelView, ...state.reelViews],
    })),

  updateReelView: (updatedReelView) =>
    set((state) => ({
      reelViews: state.reelViews.map((rv) =>
        rv.id === updatedReelView.id ? updatedReelView : rv,
      ),
    })),

  removeReelView: (id) =>
    set((state) => ({
      reelViews: state.reelViews.filter((rv) => rv.id !== id),
    })),

  resetReelViews: () =>
    set({
      reelViews: [],
    }),
}));
