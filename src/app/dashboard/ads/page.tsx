"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import CreateAdsDialog from "@/components/ads/CreateAdsDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useAdStore } from "@/zustand/adStore";

import {
  Eye,
  MoreHorizontal,
  MousePointer,
  TrendingUp,
  Users,
  PlayCircle,
} from "lucide-react";
import { useAdEventStore } from "@/zustand/adViewStore";

function calculateAdAnalytics(
  adId: string,
  AdEvents: any[]
) {
  const events = AdEvents.filter(
    (event) => event.adId === adId
  );

  const views = events.filter(
    (event) => event.eventType === "VIEW"
  );

  const clicks = events.filter(
    (event) => event.eventType === "CLICK"
  );

  const impressions = views.length;

  const totalClicks = clicks.length;

  const ctr = impressions
    ? Number(
      ((totalClicks / impressions) * 100).toFixed(2)
    )
    : 0;

  const uniqueReach = new Set(
    events
      .map((event) => event.userId)
      .filter(Boolean)
  ).size;

  // =========================
  // TOP LOCATION
  // =========================

  const locationCounts: Record<string, number> = {};

  events.forEach((event) => {
    if (!event.location) return;

    locationCounts[event.location] =
      (locationCounts[event.location] || 0) + 1;
  });

  const topLocation =
    Object.entries(locationCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

  // =========================
  // LAST EVENT
  // =========================

  const latestEvent = events.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )[0];

  return {
    impressions,
    totalClicks,
    ctr,
    uniqueReach,
    topLocation,
    latestActivity: latestEvent?.createdAt || null,
  };
}

function AdCard({
  ad,
  analytics,
}: {
  ad: any;
  analytics: ReturnType<typeof calculateAdAnalytics>;
}) {
  return (
    <Link href={`/dashboard/ads/${ad.id}`}>
      <div className="rounded-2xl border border-border/40 bg-secondary/20 p-4 transition-all hover:bg-secondary/40 hover:border-border cursor-pointer">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold line-clamp-1">
              {ad.title}
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              {formatDistanceToNow(new Date(ad.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          <Badge
            variant={
              ad.status === "ACTIVE"
                ? "default"
                : "secondary"
            }
            className="rounded-lg text-[10px]"
          >
            {ad.status}
          </Badge>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="rounded-lg text-[10px]"
          >
            {ad.type}
          </Badge>

          {ad.locations?.slice(0, 2).map((location: string) => (
            <Badge
              key={location}
              variant="outline"
              className="rounded-lg text-[10px]"
            >
              {location}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-background/60 p-3">
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-violet-500" />

              <span className="text-[11px] text-muted-foreground">
                Impressions
              </span>
            </div>

            <p className="mt-1 text-sm font-bold">
              {analytics.impressions.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-background/60 p-3">
            <div className="flex items-center gap-2">
              <MousePointer className="h-3.5 w-3.5 text-emerald-500" />

              <span className="text-[11px] text-muted-foreground">
                Clicks
              </span>
            </div>

            <p className="mt-1 text-sm font-bold">
              {analytics.totalClicks.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-background/60 p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-orange-500" />

              <span className="text-[11px] text-muted-foreground">
                CTR
              </span>
            </div>

            <p className="mt-1 text-sm font-bold">
              {analytics.ctr}%
            </p>
          </div>

          <div className="rounded-xl bg-background/60 p-3">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-sky-500" />

              <span className="text-[11px] text-muted-foreground">
                Reach
              </span>
            </div>

            <p className="mt-1 text-sm font-bold">
              {analytics.uniqueReach.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function AdsPage() {
  const { ads } = useAdStore();

  const { AdEvents } = useAdEventStore();

  const totalImpressions = AdEvents.filter(
    (e) => e.eventType === "VIEW"
  ).length;

  const totalClicks = AdEvents.filter(
    (e) => e.eventType === "CLICK"
  ).length;

  const avgCtr = totalImpressions
    ? ((totalClicks / totalImpressions) * 100).toFixed(2)
    : "0.00";

  const uniqueReach = new Set(
    AdEvents.map((e) => e.userId).filter(Boolean)
  ).size;

  const adStats = [
    {
      title: "Total Impressions",
      value: totalImpressions.toLocaleString(),
      icon: Eye,
      change: "+12.3%",
      gradient:
        "from-violet-500/20 to-purple-500/20 text-violet-500",
    },
    {
      title: "Total Clicks",
      value: totalClicks.toLocaleString(),
      icon: MousePointer,
      change: "+8.7%",
      gradient:
        "from-emerald-500/20 to-green-500/20 text-emerald-500",
    },
    {
      title: "Average CTR",
      value: `${avgCtr}%`,
      icon: TrendingUp,
      change: "+2.1%",
      gradient:
        "from-orange-500/20 to-amber-500/20 text-orange-500",
    },
    {
      title: "Unique Reach",
      value: uniqueReach.toLocaleString(),
      icon: Users,
      change: "+5.4%",
      gradient:
        "from-sky-500/20 to-cyan-500/20 text-sky-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:gap-6">
      {/* TOP STATS */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {adStats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-3xl border border-border/40 bg-card p-4 shadow-card"
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>

              <span className="rounded-xl bg-success/10 px-2 py-1 text-[11px] font-semibold text-success">
                {stat.change}
              </span>
            </div>

            <p className="text-2xl font-bold tracking-tight">
              {stat.value}
            </p>

            <p className="mt-1 text-[12px] text-muted-foreground">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* CAMPAIGNS */}
      <div className="rounded-2xl bg-card shadow-card animate-fade-in">
        <div className="flex flex-col justify-between gap-3 p-4 pb-3 sm:flex-row sm:items-center sm:p-5">
          <div>
            <h3 className="text-[13px] font-semibold text-foreground">
              All Campaigns
            </h3>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {ads.length} campaigns total
            </p>
          </div>

          <CreateAdsDialog />
        </div>

        {/* MOBILE */}
        <div className="space-y-3 px-3 pb-4 sm:hidden">
          {ads.map((ad) => {
            const analytics = calculateAdAnalytics(
              ad.id,
              AdEvents
            );

            return (
              <AdCard
                key={ad.id}
                ad={ad}
                analytics={analytics}
              />
            );
          })}
        </div>

        {/* DESKTOP */}
        <div className="hidden overflow-x-auto px-5 pb-4 sm:block">
          <div className="min-w-[1000px]">
            <div className="mb-1 grid grid-cols-[1.5fr_80px_90px_100px_80px_80px_100px_120px_50px] gap-3 border-b border-border/50 px-2 pb-2.5">
              {[
                "Campaign",
                "Type",
                "Status",
                "Impressions",
                "Clicks",
                "CTR",
                "Reach",
                "Top Location",
                "",
              ].map((h) => (
                <span
                  key={h}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </span>
              ))}
            </div>

            {ads.map((ad) => {
              const analytics = calculateAdAnalytics(
                ad.id,
                AdEvents
              );

              return (
                <Link
                  href={`/dashboard/ads/${ad.id}`}
                  key={ad.id}
                  className="w-full"
                >
                  <div className="group grid grid-cols-[1.5fr_80px_90px_100px_80px_80px_100px_120px_50px] items-center gap-3 rounded-xl border-b border-border/20 px-2 py-3 transition-all hover:bg-secondary/30">
                    {/* CAMPAIGN */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 shrink-0 text-primary" />

                        <span className="truncate text-[13px] font-medium">
                          {ad.title}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-[11px] text-muted-foreground">
                        {ad.description}
                      </p>
                    </div>

                    {/* TYPE */}
                    <Badge
                      variant="secondary"
                      className="w-fit rounded-lg text-[9px]"
                    >
                      {ad.type}
                    </Badge>

                    {/* STATUS */}
                    <Badge
                      variant={
                        ad.status === "ACTIVE"
                          ? "default"
                          : "secondary"
                      }
                      className="w-fit rounded-lg text-[9px]"
                    >
                      {ad.status}
                    </Badge>

                    {/* IMPRESSIONS */}
                    <span className="text-[12px] tabular-nums">
                      {analytics.impressions.toLocaleString()}
                    </span>

                    {/* CLICKS */}
                    <span className="text-[12px] tabular-nums">
                      {analytics.totalClicks.toLocaleString()}
                    </span>

                    {/* CTR */}
                    <span className="text-[12px] font-semibold tabular-nums text-primary">
                      {analytics.ctr}%
                    </span>

                    {/* REACH */}
                    <span className="text-[12px] tabular-nums">
                      {analytics.uniqueReach.toLocaleString()}
                    </span>

                    {/* LOCATION */}
                    <span className="truncate text-[12px]">
                      {analytics.topLocation}
                    </span>

                    {/* ACTION */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}