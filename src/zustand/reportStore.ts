import { Report } from "@/generated/prisma/client";
import { create } from "zustand";

type ReportState = {
  reports: Report[];

  setReports: (value: Report[]) => void;
  addReport: (value: Report) => void;

  updateReport: (value: Report) => void;
  removeReport: (id: string) => void;

  resetReports: () => void;
};

export const useReportStore = create<ReportState>((set) => ({
  reports: [],

  setReports: (reports) =>
    set({
      reports,
    }),
  addReport: (newReport) =>
    set((state) => ({
      reports: [newReport, ...state.reports],
    })),

  updateReport: (updatedReport) =>
    set((state) => {
      const exists = state.reports.some(
        (report) => report.id === updatedReport.id,
      );

      if (exists) {
        return {
          reports: state.reports.map((report) =>
            report.id === updatedReport.id ? updatedReport : report,
          ),
        };
      }

      return {
        reports: [updatedReport, ...state.reports],
      };
    }),

  removeReport: (id) =>
    set((state) => ({
      reports: state.reports.filter((report) => report.id !== id),
    })),

  resetReports: () =>
    set({
      reports: [],
    }),
}));
