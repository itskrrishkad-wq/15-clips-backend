"use client";

import ReportCard from "@/components/report/ReportCard";
import { useReelStore } from "@/zustand/reelStore";
import { useReportStore } from "@/zustand/reportStore";
import { useUserStore } from "@/zustand/userStore";



export default function ReportsPage() {
    const { reports } = useReportStore()
    const { users } = useUserStore();
    const { reels } = useReelStore();




    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Reports
                        </h1>

                        <p className="mt-1 text-sm text-zinc-400">
                            Manage reported reels and moderation requests.
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">
                        <p className="text-xs text-zinc-400">Total Reports</p>
                        <p className="text-lg font-semibold">
                            {reports.length}
                        </p>
                    </div>
                </div>

                {reports.length === 0 ? (
                    <div className="flex h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
                        <h2 className="text-lg font-semibold">
                            No Reports Found
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Everything looks clean right now.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {reports.map((report) => {
                            const user = users.find((u) => u.id === report.userId)
                            const reel = reels.find((r) => r.id === report.reelId)
                            return (
                                <ReportCard
                                    key={report.id}
                                    report={{
                                        ...report, user: { id: user?.id ?? "", name: user?.name ?? "" },
                                        reel: { id: reel?.id ?? "", thumbnailUrl: reel?.thumbnail ?? "" }

                                    }}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
