"use client";

import CreateAdsDialog from "@/components/ads/CreateAdsDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adPerformanceData, ads } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Eye,
  MoreHorizontal,
  MousePointer,
  TrendingUp
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const adStats = [
  {
    title: "Total Impressions",
    value: "493K",
    icon: Eye,
    change: "+12.3%",
    gradient: "gradient-info",
  },
  {
    title: "Total Clicks",
    value: "31.2K",
    icon: MousePointer,
    change: "+8.7%",
    gradient: "gradient-success",
  },
  {
    title: "Avg CTR",
    value: "6.02%",
    icon: BarChart3,
    change: "+2.1%",
    gradient: "gradient-warning",
  },
  {
    title: "Engagement",
    value: "24.5%",
    icon: TrendingUp,
    change: "+5.4%",
    gradient: "gradient-primary",
  },
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  boxShadow: "0 4px 16px -2px rgb(0 0 0 / 0.08)",
  fontSize: "12px",
};

function AdCard({ ad }: { ad: (typeof ads)[0] }) {
  return (
    <div className="rounded-xl bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-medium truncate">{ad.title}</span>
        <Badge
          variant={ad.status === "active" ? "default" : "secondary"}
          className="rounded-lg text-[9px] capitalize shrink-0 ml-2"
        >
          {ad.status}
        </Badge>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <Badge variant="secondary" className="rounded-lg text-[9px]">
          {ad.type}
        </Badge>
        <span>{ad.impressions} imp</span>
        <span>{ad.clicks} clicks</span>
        <span>{ad.ctr} CTR</span>
      </div>
    </div>
  );
}

export default function AdsPage() {
  return (
    <>
      <div className="grid gap-4 sm:gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {adStats.map((s, i) => (
            <div
              key={s.title}
              className="group rounded-2xl bg-card p-4 sm:p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div
                  className={cn(
                    "flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl shadow-soft",
                    s.gradient,
                  )}
                >
                  <s.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                </div>
                <span className="rounded-lg bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                  {s.change}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] sm:text-[12px] text-muted-foreground">
                {s.title}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="rounded-2xl bg-card p-4 sm:p-5 shadow-card animate-fade-in">
            <div className="mb-4 sm:mb-5">
              <h3 className="text-[13px] font-semibold text-foreground">
                Performance Over Time
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Impressions vs clicks trend
              </p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={adPerformanceData}>
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
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="hsl(var(--success))"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl bg-card p-4 sm:p-5 shadow-card animate-fade-in">
            <div className="mb-4 sm:mb-5">
              <h3 className="text-[13px] font-semibold text-foreground">
                Audience Breakdown
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Weekly audience reach
              </p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={adPerformanceData} barSize={32}>
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
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="impressions"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaigns */}
        <div className="rounded-2xl bg-card shadow-card animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 pb-3 gap-3">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground">
                All Campaigns
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {ads.length} campaigns total
              </p>
            </div>
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl gradient-primary border-0 shadow-glow h-10 text-[13px] w-full sm:w-auto"><Plus className="h-4 w-4" />Create Ad</Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl max-w-[calc(100vw-2rem)] sm:max-w-lg">
                <DialogHeader><DialogTitle className="text-base">Create New Ad</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div><Label className="text-[12px]">Title</Label><Input className="mt-1.5 rounded-xl" placeholder="Ad title" /></div>
                  <div><Label className="text-[12px]">Ad Type</Label>
                    <Select><SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-[12px]">CTA Link</Label><Input className="mt-1.5 rounded-xl" placeholder="https://..." /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label className="text-[12px]">Start Date</Label><Input type="date" className="mt-1.5 rounded-xl" /></div>
                    <div><Label className="text-[12px]">End Date</Label><Input type="date" className="mt-1.5 rounded-xl" /></div>
                  </div>
                  <Button className="rounded-xl gradient-primary border-0 text-[12px]">Create Campaign</Button>
                </div>
              </DialogContent>
            </Dialog> */}
            <CreateAdsDialog />
          </div>
          {/* Mobile cards */}
          <div className="px-3 pb-4 space-y-2 sm:hidden">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
          {/* Desktop table */}
          <div className="px-5 pb-4 hidden sm:block overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-[1fr_70px_70px_80px_70px_60px_70px_40px] gap-3 border-b border-border/50 pb-2.5 mb-1 px-2">
                {[
                  "Campaign",
                  "Type",
                  "Status",
                  "Impressions",
                  "Clicks",
                  "CTR",
                  "Budget",
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
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="grid grid-cols-[1fr_70px_70px_80px_70px_60px_70px_40px] gap-3 items-center py-3 border-b border-border/20 last:border-0 hover:bg-secondary/30 rounded-xl px-2 transition-all cursor-pointer group"
                >
                  <span className="text-[12px] font-medium truncate">
                    {ad.title}
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-lg text-[9px] w-fit"
                  >
                    {ad.type}
                  </Badge>
                  <Badge
                    variant={ad.status === "active" ? "default" : "secondary"}
                    className="rounded-lg text-[9px] capitalize w-fit"
                  >
                    {ad.status}
                  </Badge>
                  <span className="text-[12px] tabular-nums">
                    {ad.impressions}
                  </span>
                  <span className="text-[12px] tabular-nums">{ad.clicks}</span>
                  <span className="text-[12px] tabular-nums">{ad.ctr}</span>
                  <span className="text-[12px] font-medium tabular-nums">
                    {ad.budget}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
