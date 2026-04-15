"use client";

import {
  statsCards,
  viewsOverTime,
  engagementData,
  recentReels,
} from "@/lib/mock-data";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { ProjectWork } from "@/components/dashboard/ProjectWork";
import { ScheduleSection } from "@/components/dashboard/ScheduleSection";
import { InvoiceOverview } from "@/components/dashboard/InvoiceOverview";
import { RemindersSection } from "@/components/dashboard/RemindersSection";
import { Film, Megaphone, Play, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 sm:gap-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statsCards.map((stat, i) => (
          <div key={stat.title} style={{ animationDelay: `${i * 80}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-card p-4 sm:p-5 shadow-card animate-fade-in">
          <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground">
                Views Over Time
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Reel views & engagement this week
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full gradient-primary" /> Views
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full gradient-success" />{" "}
                Engagement
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={viewsOverTime}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px -2px rgb(0 0 0 / 0.08)",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#0992C2"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#F68048"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-card p-4 sm:p-5 shadow-card animate-fade-in">
          <div className="mb-4 sm:mb-5">
            <h3 className="text-[13px] font-semibold text-foreground">
              Engagement Rate
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Daily engagement %
            </p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={engagementData} barSize={28}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px -2px rgb(0 0 0 / 0.08)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                {engagementData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? "#685AFF" : "#B7BDF7"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reels Table + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-card shadow-card animate-fade-in">
          <div className="flex items-center justify-between p-4 sm:p-5 pb-3">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground">
                Top Performing Reels
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Your best content this week
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] text-primary gap-1 hover:bg-accent rounded-lg"
            >
              View All <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="px-4 sm:px-5 pb-4 overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-[1fr_70px_70px_80px_80px] gap-2 border-b border-border/50 pb-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Reel
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Views
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Likes
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Engage
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </span>
              </div>
              {recentReels.map((reel) => (
                <div
                  key={reel.id}
                  className="grid grid-cols-[1fr_70px_70px_80px_80px] gap-2 items-center py-2.5 border-b border-border/30 last:border-0 hover:bg-secondary/30 rounded-lg px-1 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-12 items-center justify-center rounded-lg bg-secondary group-hover:bg-accent transition-colors shrink-0">
                      <Play className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-foreground truncate">
                        {reel.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {reel.category}
                      </p>
                    </div>
                  </div>
                  <span className="text-[12px] tabular-nums text-foreground">
                    {reel.views}
                  </span>
                  <span className="text-[12px] tabular-nums text-foreground">
                    {reel.likes}
                  </span>
                  <span className="text-[12px] tabular-nums font-medium text-foreground">
                    {reel.engagement}%
                  </span>
                  <Badge
                    variant={
                      reel.status === "published" ? "default" : "secondary"
                    }
                    className="rounded-md text-[9px] capitalize w-fit"
                  >
                    {reel.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="rounded-2xl bg-card p-4 sm:p-5 shadow-card animate-fade-in">
            <h3 className="mb-3.5 text-[13px] font-semibold text-foreground">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              <Button className="w-full justify-start gap-2.5 rounded-xl h-10 gradient-primary shadow-glow text-[12px] font-medium border-0">
                <Film className="h-4 w-4" /> Upload Reel
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 rounded-xl h-10 text-[12px] font-medium border-border/60 hover:bg-secondary hover:shadow-soft transition-all"
              >
                <Megaphone className="h-4 w-4 text-accent-foreground" /> Create
                Ad Campaign
              </Button>
            </div>
          </div>
          <ActivityChart />
          <ProjectWork />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <InvoiceOverview />
        <ScheduleSection />
        <RemindersSection />
      </div>
    </div>
  );
}
