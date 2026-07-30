"use client";

import React from "react";

import {
  Users,
  MapPin,
  Languages,
  Briefcase,
  UserRound,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  Clock3,
  Eye,
  Film,
  Megaphone,
  Play,
  ShieldAlert,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/StatsCard";

import { useRouter } from "next/navigation";

import { useReelStore } from "@/zustand/reelStore";
import { useReelViewStore } from "@/zustand/reelViewStore";
import { useAdStore } from "@/zustand/adStore";
import { useUserStore } from "@/zustand/userStore";
import { useReportStore } from "@/zustand/reportStore";

export default function DashboardOverviewPage() {
  const router = useRouter();

  const { reels } = useReelStore();
  const { reelViews } = useReelViewStore();
  const { ads } = useAdStore();
  const { users } = useUserStore();
  const { reports } = useReportStore();

  // =========================================================
  // USER METRICS
  // =========================================================

  const totalUsers = users.length;

  const maleUsers = users.filter(
    (u) => u.gender?.toLowerCase() === "male"
  ).length;

  const femaleUsers = users.filter(
    (u) => u.gender?.toLowerCase() === "female"
  ).length;

  const otherUsers =
    totalUsers - maleUsers - femaleUsers;

  // =========================================================
  // REEL METRICS
  // =========================================================

  const totalViews = reelViews.length;

  const totalSaves = reels.reduce(
    (acc, reel) => acc + reel.saveCount,
    0
  );

  const publishedReels = reels.filter(
    (reel) => reel.status === "PUBLISH"
  ).length;

  const reviewReels = reels.filter(
    (reel) => reel.status === "REVIEW"
  ).length;

  // =========================================================
  // REPORT METRICS
  // =========================================================

  const pendingReports = reports.filter(
    (report) => report.status === "PENDING"
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status === "RESOLVED"
  ).length;

  // =========================================================
  // WATCH TIME
  // =========================================================

  const totalWatchTime = reelViews.reduce(
    (acc, curr) => acc + (curr.watchTime || 0),
    0
  );

  const avgWatchTime =
    reelViews.length > 0
      ? (
          totalWatchTime / reelViews.length
        ).toFixed(1)
      : "0";

  // =========================================================
  // COMPLETION RATE
  // =========================================================

  const completedViews = reelViews.filter(
    (view) => view.completed
  ).length;

  const completionRate =
    totalViews > 0
      ? (
          (completedViews / totalViews) *
          100
        ).toFixed(1)
      : "0";

  // =========================================================
  // ADS
  // =========================================================

  const activeAds = ads.filter(
    (ad) => ad.status === "ACTIVE"
  );

  const adImpressions = ads.reduce(
    (acc, ad) => acc + (ad.viewCount || 0),
    0
  );

  const adClicks = ads.reduce(
    (acc, ad) => acc + (ad.clickCount || 0),
    0
  );

  const ctr =
    adImpressions > 0
      ? (
          (adClicks / adImpressions) *
          100
        ).toFixed(1)
      : "0";

  // =========================================================
  // AGE CALCULATOR
  // =========================================================

  const getAge = (
    dob?: string | Date | null
  ) => {
    if (!dob) return null;

    const birth = new Date(dob);

    const today = new Date();

    let age =
      today.getFullYear() -
      birth.getFullYear();

    const month =
      today.getMonth() - birth.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() <
          birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // =========================================================
  // AGE GROUPS
  // =========================================================

  const ageGroups = {
    "13-17": 0,
    "18-24": 0,
    "25-34": 0,
    "35-44": 0,
    "45+": 0,
  };

  users.forEach((user) => {
    const age = getAge(user.dob);

    if (!age) return;

    if (age <= 17) ageGroups["13-17"]++;
    else if (age <= 24)
      ageGroups["18-24"]++;
    else if (age <= 34)
      ageGroups["25-34"]++;
    else if (age <= 44)
      ageGroups["35-44"]++;
    else ageGroups["45+"]++;
  });

  const ageChartData = Object.entries(
    ageGroups
  ).map(([name, value]) => ({
    name,
    value,
  }));

  // =========================================================
  // TOP INTERESTS
  // =========================================================

  const interestMap: Record<
    string,
    number
  > = {};

  users.forEach((user) => {
    user.interests?.forEach(
      (interest: string) => {
        if (!interest) return;

        const key = interest.trim();

        interestMap[key] =
          (interestMap[key] || 0) + 1;
      }
    );
  });

  const topInterests = Object.entries(
    interestMap
  )
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // =========================================================
  // TOP PROFESSIONS
  // =========================================================

  const professionMap: Record<
    string,
    number
  > = {};

  users.forEach((user) => {
    if (!user.profession) return;

    professionMap[user.profession] =
      (professionMap[user.profession] ||
        0) + 1;
  });

  const topProfessions = Object.entries(
    professionMap
  )
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // =========================================================
  // TOP LANGUAGES
  // =========================================================

  const languageMap: Record<
    string,
    number
  > = {};

  users.forEach((user) => {
    user.languages?.forEach(
      (language: string) => {
        if (!language) return;

        languageMap[language] =
          (languageMap[language] || 0) +
          1;
      }
    );
  });

  const topLanguages = Object.entries(
    languageMap
  )
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // =========================================================
  // TOP LOCATIONS
  // =========================================================

  const locationMap: Record<
    string,
    number
  > = {};

  users.forEach((user) => {
    if (!user.location) return;

    locationMap[user.location] =
      (locationMap[user.location] ||
        0) + 1;
  });

  const topLocations = Object.entries(
    locationMap
  )
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // =========================================================
  // CHART DATA
  // =========================================================

  const genderData = [
    {
      name: "Male",
      value: maleUsers,
    },
    {
      name: "Female",
      value: femaleUsers,
    },
    {
      name: "Other",
      value: otherUsers,
    },
  ];

  const PIE_COLORS = [
    "#8B5CF6",
    "#06B6D4",
    "#FB7185",
  ];

  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const viewsChartData = days.map((day) => {
    const views = reelViews.filter((view) => {
      const d = new Date(
        view.createdAt
      ).getDay();

      return days[d] === day;
    });

    return {
      name: day,
      views: views.length,
    };
  });

  const engagementData = days.map((day) => {
    const dayViews = reelViews.filter((view) => {
      const d = new Date(
        view.createdAt
      ).getDay();

      return days[d] === day;
    });

    const completed = dayViews.filter(
      (view) => view.completed
    ).length;

    const rate =
      dayViews.length > 0
        ? Math.round(
            (completed / dayViews.length) *
              100
          )
        : 0;

    return {
      name: day,
      rate,
    };
  });

  // =========================================================
  // TOP REELS
  // =========================================================

  const topReels = [...reels]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 6);

  // =========================================================
  // STATS
  // =========================================================

  const statsCards = [
    {
      title: "Total Users",
      value: totalUsers,
      change: "+12%",
      trend: "up" as const,
      icon: "Users",
    },
    {
      title: "Total Reels",
      value: reels.length,
      change: "+8%",
      trend: "up" as const,
      icon: "Film",
    },
    {
      title: "Total Views",
      value: totalViews,
      change: "+18%",
      trend: "up" as const,
      icon: "Eye",
    },
    {
      title: "Total Saves",
      value: totalSaves,
      change: "+6%",
      trend: "up" as const,
      icon: "Bookmark",
    },
    {
      title: "Completion Rate",
      value: Number(completionRate),
      change: "+3%",
      trend: "up" as const,
      icon: "CheckCircle2",
    },
    {
      title: "Avg Watch Time",
      value: Number(avgWatchTime),
      change: "+2%",
      trend: "up" as const,
      icon: "Clock3",
    },
    {
      title: "Active Ads",
      value: activeAds.length,
      change: "+1%",
      trend: "up" as const,
      icon: "Megaphone",
    },
    {
      title: "Pending Reports",
      value: pendingReports,
      change: "-4%",
      trend: "down" as const,
      icon: "ShieldAlert",
    },
  ];

  return (
    <div className="grid gap-5">
      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <div
            key={stat.title}
            style={{
              animationDelay: `${i * 70}ms`,
            }}
          >
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* ================================================= */}
      {/* CHARTS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* PLATFORM ACTIVITY */}

        <div className="lg:col-span-2 rounded-2xl bg-card p-5 shadow-card border border-border/40">
          <div className="mb-5">
            <h3 className="text-sm font-semibold">
              Platform Activity
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              Reel views this week
            </p>
          </div>

          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <LineChart data={viewsChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="views"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* GENDER DISTRIBUTION */}

        <div className="rounded-2xl bg-card p-5 shadow-card border border-border/40">
          <div className="mb-5">
            <h3 className="text-sm font-semibold">
              Gender Distribution
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              Audience by gender
            </p>
          </div>

          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                innerRadius={55}
                paddingAngle={3}
              >
                {genderData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        PIE_COLORS[
                          index %
                            PIE_COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================================================= */}
      {/* AGE + COMPLETION */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* AGE */}

        <div className="rounded-2xl bg-card p-5 shadow-card border border-border/40">
          <div className="mb-5">
            <h3 className="text-sm font-semibold">
              Age Distribution
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              Audience segmentation
            </p>
          </div>

          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <BarChart data={ageChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                fill="#8B5CF6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* COMPLETION */}

        <div className="rounded-2xl bg-card p-5 shadow-card border border-border/40">
          <div className="mb-5">
            <h3 className="text-sm font-semibold">
              Completion Rate
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              Reel completion by day
            </p>
          </div>

          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <BarChart data={engagementData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Bar
                dataKey="rate"
                radius={[10, 10, 0, 0]}
              >
                {engagementData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        index % 2 === 0
                          ? "#8B5CF6"
                          : "#C4B5FD"
                      }
                    />
                  )
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================================================= */}
      {/* OVERVIEW LISTS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <OverviewListCard
          title="Top Interests"
          description="Most selected interests"
          icon={
            <UserRound className="h-4 w-4" />
          }
          data={topInterests}
        />

        <OverviewListCard
          title="Top Professions"
          description="Most common professions"
          icon={
            <Briefcase className="h-4 w-4" />
          }
          data={topProfessions}
        />

        <OverviewListCard
          title="Top Languages"
          description="Most spoken languages"
          icon={
            <Languages className="h-4 w-4" />
          }
          data={topLanguages}
        />

        <OverviewListCard
          title="Top Locations"
          description="Most active cities"
          icon={
            <MapPin className="h-4 w-4" />
          }
          data={topLocations}
        />
      </div>

      {/* ================================================= */}
      {/* TOP REELS + SIDEBAR */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* TOP REELS */}

        <div className="lg:col-span-2 h-max rounded-2xl bg-card shadow-card border border-border/40">
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <h3 className="text-sm font-semibold">
                Top Performing Reels
              </h3>

              <p className="text-xs text-muted-foreground mt-1">
                Most watched content
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1"
            >
              View All

              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="px-5 pb-5 overflow-x-auto">
            <div className="min-w-[550px]">
              <div className="grid grid-cols-[1fr_80px_80px_90px_90px] gap-2 border-b border-border/50 pb-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Reel
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Views
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Saves
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Duration
                </span>
              </div>

              {topReels.map((reel) => (
                <div
                  key={reel.id}
                  className="grid grid-cols-[1fr_80px_80px_90px_90px] gap-2 items-center py-2.5 border-b border-border/30 last:border-0 hover:bg-secondary/30 rounded-lg px-1 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-12 items-center justify-center rounded-lg bg-secondary shrink-0">
                      <Play className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[12px] font-medium truncate">
                        {reel.title ||
                          "Untitled Reel"}
                      </p>

                      <p className="text-[10px] text-muted-foreground truncate">
                        {reel.channel ||
                          "Unknown"}
                      </p>
                    </div>
                  </div>

                  <span className="text-[12px]">
                    {reel.viewCount}
                  </span>

                  <span className="text-[12px]">
                    {reel.saveCount}
                  </span>

                  <Badge
                    variant="secondary"
                    className="rounded-md text-[9px]"
                  >
                    {reel.status}
                  </Badge>

                  <span className="text-[12px]">
                    {reel.duration || 0}s
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}

        <div className="flex flex-col gap-5">
          {/* QUICK ACTIONS */}

          <div className="rounded-2xl bg-card p-5 shadow-card border border-border/40">
            <h3 className="mb-4 text-sm font-semibold">
              Quick Actions
            </h3>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full justify-start gap-2.5 rounded-xl h-10"
                onClick={() =>
                  router.push("/dashboard/reels")
                }
              >
                <Film className="h-4 w-4" />
                Manage Reels
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 rounded-xl h-10"
                onClick={() =>
                  router.push("/dashboard/ads")
                }
              >
                <Megaphone className="h-4 w-4" />
                Manage Ads
              </Button>
            </div>
          </div>

          {/* SNAPSHOT */}

          <div className="rounded-2xl bg-card p-5 shadow-card border border-border/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">
                Platform Snapshot
              </h3>

              <Badge className="rounded-md text-[9px]">
                LIVE
              </Badge>
            </div>

            <div className="space-y-3">
              <SnapshotRow
                label="Published Reels"
                value={publishedReels}
              />

              <SnapshotRow
                label="Under Review"
                value={reviewReels}
              />

              <SnapshotRow
                label="Ad Impressions"
                value={adImpressions}
              />

              <SnapshotRow
                label="Ad Clicks"
                value={adClicks}
              />

              <SnapshotRow
                label="CTR"
                value={`${ctr}%`}
              />

              <SnapshotRow
                label="Resolved Reports"
                value={resolvedReports}
              />
            </div>
          </div>

          {/* MODERATION */}

          <div className="rounded-2xl bg-card p-5 shadow-card border border-border/40">
            <h3 className="mb-4 text-sm font-semibold">
              Moderation Overview
            </h3>

            <div className="space-y-3">
              <div className="rounded-xl border border-border/50 p-3">
                <p className="text-xs text-muted-foreground">
                  Pending Reports
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  {pendingReports}
                </h2>
              </div>

              <div className="rounded-xl border border-border/50 p-3">
                <p className="text-xs text-muted-foreground">
                  Resolved Reports
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  {resolvedReports}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SnapshotRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}

function OverviewListCard({
  title,
  description,
  icon,
  data,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  data: {
    name: string;
    value: number;
  }[];
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card border border-border/40">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>

      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />

                <span className="text-[13px] truncate">
                  {item.name}
                </span>
              </div>

              <span className="text-[13px] font-semibold">
                {item.value}
              </span>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}