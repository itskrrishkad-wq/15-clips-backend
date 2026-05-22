import { AdEvent } from "@/generated/prisma/client";
import { create } from "zustand";

type AdEventState = {
  AdEvents: AdEvent[];

  setAdEvents: (value: AdEvent[]) => void;

  addAdEvent: (value: AdEvent) => void;
  updateAdEvent: (value: AdEvent) => void;
  removeAdEvent: (id: string) => void;

  resetAdEvents: () => void;
};

export const useAdEventStore = create<AdEventState>((set) => ({
  AdEvents: [],

  setAdEvents: (AdEvents) =>
    set({
      AdEvents,
    }),

  addAdEvent: (newAdEvent) =>
    set((state) => ({
      AdEvents: [newAdEvent, ...state.AdEvents],
    })),

  updateAdEvent: (updatedAdEvent) =>
    set((state) => ({
      AdEvents: state.AdEvents.map((av) =>
        av.id === updatedAdEvent.id ? updatedAdEvent : av,
      ),
    })),

  removeAdEvent: (id) =>
    set((state) => ({
      AdEvents: state.AdEvents.filter((av) => av.id !== id),
    })),

  resetAdEvents: () =>
    set({
      AdEvents: [],
    }),
}));
