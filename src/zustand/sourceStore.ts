import { Source } from "@/generated/prisma/client";
import { create } from "zustand";

type SourceState = {
  sources: Source[];

  setSources: (value: Source[]) => void;
  addSource: (value: Source) => void;

  updateSource: (value: Source) => void;
  removeSource: (id: string) => void;

  resetSources: () => void;
};

export const useSourceStore = create<SourceState>((set) => ({
  sources: [],

  setSources: (sources) =>
    set({
      sources,
    }),
  addSource: (newSource) =>
    set((state) => ({
      sources: [newSource, ...state.sources],
    })),

  updateSource: (updatedSource) =>
    set((state) => {
      const exists = state.sources.some(
        (source) => source.id === updatedSource.id,
      );

      if (exists) {
        return {
          sources: state.sources.map((source) =>
            source.id === updatedSource.id ? updatedSource : source,
          ),
        };
      }

      return {
        sources: [updatedSource, ...state.sources],
      };
    }),

  removeSource: (id) =>
    set((state) => ({
      sources: state.sources.filter((source) => source.id !== id),
    })),

  resetSources: () =>
    set({
      sources: [],
    }),
}));
