"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import CreateAdsDialog from "@/components/ads/CreateAdsDialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

import { useAdStore } from "@/zustand/adStore";

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import { useAdEventStore } from "@/zustand/adViewStore";
import {
  Eye,
  MoreHorizontal,
  MousePointer,
  PlayCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Ad } from "@/generated/prisma/client";
import UpdateAdDialog from "@/components/ads/UpdateAdDialog";
import { DeleteAdDialog } from "@/components/ads/DeleteAdDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


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
  const { ads, removeAd } = useAdStore();
  const { AdEvents } = useAdEventStore();
  const [updateAdDialogOpen, setUpdateAdDialogOpen] = useState(false);
  const [deleteAdDialogOpen, setDeleteAdDialogOpen] = useState(false);
  const [deleteAd, setDeleteAd] = useState<Ad | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [updateAd, setUpdateAd] = useState<Ad | null>(null);

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


  const handle_ad_del = async () => {
    if (!deleteAd) return;
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/ads/delete?id=${deleteAd.id}`, {
        method: "DELETE",
        credentials: "include",

      });

      const res = await response.json();

      if (!res.success) {
        console.log("error deleting ad: ", res.messgae)
        return;
      }

      removeAd(res.data.id)

    } catch (error) {
      console.log("error deleting ad: ", error);
    } finally {
      setIsDeleting(false);
    }
  }

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
        <div className="overflow-x-auto px-5 pb-4">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Reach</TableHead>
                <TableHead>Top Location</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {ads.map((ad) => {
                const analytics = calculateAdAnalytics(
                  ad.id,
                  AdEvents
                )

                return (
                  <TableRow
                    key={ad.id}
                    className="group hover:bg-secondary/30"
                  >
                    {/* CAMPAIGN */}
                    <TableCell className="min-w-[280px]">
                      <Link
                        href={`/dashboard/ads/${ad.id}`}
                        className="block w-full"
                      >
                        <div className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 shrink-0 text-primary" />

                          <span className="truncate text-[13px] font-medium">
                            {ad.title}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-[11px] text-muted-foreground">
                          {ad.description}
                        </p>
                      </Link>
                    </TableCell>

                    {/* TYPE */}
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="rounded-lg text-[9px] whitespace-nowrap"
                      >
                        {ad.type}
                      </Badge>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <Badge
                        variant={
                          ad.status === "ACTIVE"
                            ? "default"
                            : "secondary"
                        }
                        className="rounded-lg text-[9px] whitespace-nowrap"
                      >
                        {ad.status}
                      </Badge>
                    </TableCell>

                    {/* IMPRESSIONS */}
                    <TableCell className="text-[12px] tabular-nums whitespace-nowrap">
                      {analytics.impressions.toLocaleString()}
                    </TableCell>

                    {/* CLICKS */}
                    <TableCell className="text-[12px] tabular-nums whitespace-nowrap">
                      {analytics.totalClicks.toLocaleString()}
                    </TableCell>

                    {/* CTR */}
                    <TableCell className="text-[12px] font-semibold tabular-nums text-primary whitespace-nowrap">
                      {analytics.ctr}%
                    </TableCell>

                    {/* REACH */}
                    <TableCell className="text-[12px] tabular-nums whitespace-nowrap">
                      {analytics.uniqueReach.toLocaleString()}
                    </TableCell>

                    {/* LOCATION */}
                    <TableCell className="max-w-[140px] truncate text-[12px]">
                      {analytics.topLocation}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <Menubar className="w-max border-none">
                        <MenubarMenu>
                          <MenubarTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </MenubarTrigger>

                          <MenubarContent>
                            <MenubarGroup className="space-y-0.5">
                              <MenubarItem
                                onClick={() => {
                                  setUpdateAd(ad)
                                  setUpdateAdDialogOpen(true)
                                }}
                              >
                                Edit
                              </MenubarItem>

                              <MenubarItem
                                className={cn(
                                  buttonVariants({
                                    variant: "destructive",
                                  }),
                                  "w-full justify-start"
                                )}
                                onClick={() => {
                                  setDeleteAd(ad)
                                  setDeleteAdDialogOpen(true)
                                }}
                              >
                                Delete
                              </MenubarItem>
                            </MenubarGroup>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <UpdateAdDialog
        ad={updateAd}
        onOpenChange={setUpdateAdDialogOpen}
        open={updateAdDialogOpen}
        setUpdateAd={setUpdateAd}
      />
      <DeleteAdDialog
        adTitle={deleteAd?.title}
        onConfirm={handle_ad_del}
        open={deleteAdDialogOpen}
        openChange={setDeleteAdDialogOpen}
        setDeleteAd={setDeleteAd}
        isLoading={isDeleting}

      />
    </div>
  );
}