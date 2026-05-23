"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand/userStore";
import { useReelStore } from "@/zustand/reelStore";
import { useAdStore } from "@/zustand/adStore";
import { useAdminUserStore } from "@/zustand/adminStore";
import { useAdEventStore } from "@/zustand/adViewStore";
import { useReelViewStore } from "@/zustand/reelViewStore";
import { useSourceStore } from "@/zustand/sourceStore";
import { useReportStore } from "@/zustand/reportStore";

let initialized = false;

export function useInitializeApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        // Prevent duplicate initialization
        if (initialized) {
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);

        const response = await fetch(`/api/init`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to initialize app");
        }

        const res = await response.json();
        if (!res.success) {
          useUserStore.getState().setUsers([]);
          useReelStore.getState().setReel([]);
          useAdStore.getState().setAds([]);
          useAdminUserStore.getState().setAdminUsers([]);

          useAdEventStore.getState().setAdEvents([]);
          useReelViewStore.getState().setReelViews([]);
          useSourceStore.getState().setSources([]);
          useReportStore.getState().setReports([]);

          initialized = true;

          setIsInitialized(true);
          return;
        }

        const data = res.data;

        useUserStore.getState().setUsers(data.users || []);
        useReelStore.getState().setReel(data.reels || []);
        useAdStore.getState().setAds(data.ads || []);
        useAdminUserStore.getState().setAdminUsers(data.admins || []);

        useAdEventStore.getState().setAdEvents(data.adEvents || []);
        useReelViewStore.getState().setReelViews(data.reelViews || []);
        useSourceStore.getState().setSources(data.sources || []);
        useReportStore.getState().setReports(data.reports || []);

        initialized = true;

        setIsInitialized(true);
      } catch (error) {
        console.error("APP_INIT_ERROR:", error);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  return {
    isLoading,
    isInitialized,
  };
}
