import { Ad } from "@/generated/prisma/client";
import { create } from "zustand";

type AdState = {
  ads: Ad[];

  setAds: (value: Ad[]) => void;
  addAd: (value: Ad) => void;

  updateAd: (value: Ad) => void;
  removeAd: (id: string) => void;

  resetAds: () => void;
};

export const useAdStore = create<AdState>((set) => ({
  ads: [],

  setAds: (ads) =>
    set({
      ads,
    }),

  addAd: (newAd) =>
    set((state) => ({
      ads: [newAd, ...state.ads],
    })),
  updateAd: (updatedAd) =>
    set((state) => {
      const exists = state.ads.some((ad) => ad.id === updatedAd.id);

      if (exists) {
        return {
          ads: state.ads.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)),
        };
      }

      return {
        ads: [updatedAd, ...state.ads],
      };
    }),

  removeAd: (id) =>
    set((state) => ({
      ads: state.ads.filter((ad) => ad.id !== id),
    })),

  resetAds: () =>
    set({
      ads: [],
    }),
}));
