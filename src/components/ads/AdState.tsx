"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    CalendarDays,
    Eye,
    Globe,
    MapPin,
    MousePointerClick,
    TrendingUp,
    Users,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AdStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { useAdStore } from "@/zustand/adStore";
import { useAdEventStore } from "@/zustand/adViewStore";
import { ConfirmAdStatusDialog } from "./ConfirmAdStatusDialog";

const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "16px",
    fontSize: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

function getAgeRange(age?: number | null) {
    if (!age) return "Unknown";

    if (age <= 18) return "13-18";
    if (age <= 24) return "18-24";
    if (age <= 34) return "25-34";
    if (age <= 44) return "35-44";

    return "45+";
}



export default function AdStatPage({ id }: { id: string }) {
    const adId = id;
    const { ads } = useAdStore();
    const { AdEvents } = useAdEventStore();
    const [adStatus, setAdStatus] = useState<AdStatus>("ACTIVE")
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)

    const ad = ads.find((a) => a.id === adId);
    // const ad = ads[0]

    const analytics = useMemo(() => {
        if (!ad) {
            return {
                impressions: 0,
                totalClicks: 0,
                ctr: 0,
                uniqueUsers: 0,

                performanceData: [],
                genderCtrData: [],
                ageCtrData: [],
                cityCtrData: [],

                highestCtrCity: null,
            };
        }

        const adEvents = AdEvents.filter((e) => e.adId === ad.id);

        const views = adEvents.filter((e) => e.eventType === "VIEW");

        const clicks = adEvents.filter((e) => e.eventType === "CLICK");

        const impressions = views.length;

        const totalClicks = clicks.length;

        const ctr = impressions
            ? Number(((totalClicks / impressions) * 100).toFixed(2))
            : 0;

        const uniqueUsers = new Set(
            adEvents
                .map((e) => e.userId)
                .filter(Boolean)
        ).size;

        // =========================================
        // PERFORMANCE DATA
        // =========================================

        const performanceMap = new Map<
            string,
            {
                date: string;
                impressions: number;
                clicks: number;
            }
        >();

        adEvents.forEach((event) => {
            const day = format(new Date(event.createdAt), "EEE");

            if (!performanceMap.has(day)) {
                performanceMap.set(day, {
                    date: day,
                    impressions: 0,
                    clicks: 0,
                });
            }

            const item = performanceMap.get(day)!;

            if (event.eventType === "VIEW") {
                item.impressions += 1;
            }

            if (event.eventType === "CLICK") {
                item.clicks += 1;
            }
        });

        const performanceData = Array.from(performanceMap.values()).map((d) => ({
            ...d,
            ctr: d.impressions
                ? Number(((d.clicks / d.impressions) * 100).toFixed(2))
                : 0,
        }));

        // =========================================
        // GENDER CTR
        // =========================================

        const genderMap = new Map<
            string,
            {
                gender: string;
                views: number;
                clicks: number;
            }
        >();

        adEvents.forEach((event) => {
            const gender = event.gender || "Unknown";

            if (!genderMap.has(gender)) {
                genderMap.set(gender, {
                    gender,
                    views: 0,
                    clicks: 0,
                });
            }

            const item = genderMap.get(gender)!;

            if (event.eventType === "VIEW") {
                item.views += 1;
            }

            if (event.eventType === "CLICK") {
                item.clicks += 1;
            }
        });

        const genderCtrData = Array.from(genderMap.values()).map((g) => ({
            gender: g.gender,
            impressions: g.views,
            ctr: g.views
                ? Number(((g.clicks / g.views) * 100).toFixed(2))
                : 0,
        }));

        // =========================================
        // AGE CTR
        // =========================================

        const ageMap = new Map<
            string,
            {
                range: string;
                views: number;
                clicks: number;
            }
        >();

        adEvents.forEach((event) => {
            const range = getAgeRange(event.age);

            if (!ageMap.has(range)) {
                ageMap.set(range, {
                    range,
                    views: 0,
                    clicks: 0,
                });
            }

            const item = ageMap.get(range)!;

            if (event.eventType === "VIEW") {
                item.views += 1;
            }

            if (event.eventType === "CLICK") {
                item.clicks += 1;
            }
        });

        const ageCtrData = Array.from(ageMap.values()).map((a) => ({
            range: a.range,
            ctr: a.views
                ? Number(((a.clicks / a.views) * 100).toFixed(2))
                : 0,
        }));

        // =========================================
        // CITY CTR
        // =========================================

        const cityMap = new Map<
            string,
            {
                city: string;
                views: number;
                clicks: number;
            }
        >();

        adEvents.forEach((event) => {
            const city = event.location || "Unknown";

            if (!cityMap.has(city)) {
                cityMap.set(city, {
                    city,
                    views: 0,
                    clicks: 0,
                });
            }

            const item = cityMap.get(city)!;

            if (event.eventType === "VIEW") {
                item.views += 1;
            }

            if (event.eventType === "CLICK") {
                item.clicks += 1;
            }
        });

        const cityCtrData = Array.from(cityMap.values())
            .map((c) => ({
                city: c.city,
                ctr: c.views
                    ? Number(((c.clicks / c.views) * 100).toFixed(2))
                    : 0,
            }))
            .sort((a, b) => b.ctr - a.ctr);

        const highestCtrCity = cityCtrData[0];


        // =========================================
        // LANGUAGE CTR
        // =========================================

        const languageMap = new Map<
            string,
            {
                language: string;
                views: number;
                clicks: number;
            }
        >();

        adEvents.forEach((event) => {
            const languages =
                event.languages && event.languages.length > 0
                    ? event.languages
                    : ["Unknown"];

            languages.forEach((language) => {
                if (!languageMap.has(language)) {
                    languageMap.set(language, {
                        language,
                        views: 0,
                        clicks: 0,
                    });
                }

                const item = languageMap.get(language)!;

                if (event.eventType === "VIEW") {
                    item.views += 1;
                }

                if (event.eventType === "CLICK") {
                    item.clicks += 1;
                }
            });
        });

        const languageCtrData = Array.from(languageMap.values())
            .map((l) => ({
                language: l.language,
                impressions: l.views,
                ctr: l.views
                    ? Number(((l.clicks / l.views) * 100).toFixed(2))
                    : 0,
            }))
            .sort((a, b) => b.ctr - a.ctr);

        return {
            impressions,
            totalClicks,
            ctr,
            uniqueUsers,

            performanceData,
            genderCtrData,
            ageCtrData,
            cityCtrData,
            languageCtrData,

            highestCtrCity,
        };
    }, [AdEvents, ad]);

    if (!ad) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    Ad not found
                </p>
            </div>
        );
    }

    const stats = [
        {
            title: "Impressions",
            value: analytics.impressions.toLocaleString(),
            change: "+12.8%",
            icon: Eye,
            gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
        },
        {
            title: "Clicks",
            value: analytics.totalClicks.toLocaleString(),
            change: "+8.4%",
            icon: MousePointerClick,
            gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
        },
        {
            title: "CTR",
            value: `${analytics.ctr}%`,
            change: "+1.4%",
            icon: TrendingUp,
            gradient: "bg-gradient-to-br from-orange-500 to-amber-600",
        },
        {
            title: "Unique Reach",
            value: analytics.uniqueUsers.toLocaleString(),
            change: "+18.2%",
            icon: Users,
            gradient: "bg-gradient-to-br from-sky-500 to-cyan-600",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-[1600px] space-y-5 p-4 sm:p-6">
                {/* HEADER */}
                <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-5 shadow-card sm:p-7">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10" />

                    <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-xl bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                                    {ad.status}
                                </span>

                                <span className="rounded-xl bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                                    {ad.type} AD
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                {ad.title}
                            </h1>

                            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                {ad.description}
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/70 px-3 py-2">
                                    <CalendarDays className="h-4 w-4 text-primary" />

                                    <div>
                                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                            Duration
                                        </p>

                                        <p className="text-xs font-medium">
                                            {format(new Date(ad.startAt), "dd MMM yyyy")} -{" "}
                                            {format(new Date(ad.endAt), "dd MMM yyyy")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/70 px-3 py-2">
                                    <Globe className="h-4 w-4 text-primary" />

                                    <div>
                                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                            Target
                                        </p>

                                        <p className="text-xs font-medium">
                                            {ad.locations?.join(", ") || "Global"} •{" "}
                                            {ad.ageMin || 0}-{ad.ageMax || 100}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/40 bg-background/70 px-4 py-3 backdrop-blur">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                Status
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-success shrink-0" />

                                <div className="flex-1">
                                    <Select
                                        value={ad.status}
                                        onValueChange={(val) => {
                                            setAdStatus(val as AdStatus);
                                            setConfirmDialogOpen(true);
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-full! text-[11px]">
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="PAUSED">Paused</SelectItem>
                                            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                            <SelectItem value="CANCELED">Canceled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    {stats.map((s, i) => (
                        <div
                            key={s.title}
                            className="rounded-3xl border border-border/40 bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-5"
                            style={{
                                animationDelay: `${i * 80}ms`,
                            }}
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div
                                    className={cn(
                                        "flex h-11 w-11 items-center justify-center rounded-2xl shadow-soft",
                                        s.gradient
                                    )}
                                >
                                    <s.icon className="h-5 w-5 text-white" />
                                </div>

                                <span className="rounded-xl bg-success/10 px-2 py-1 text-[11px] font-semibold text-success">
                                    {s.change}
                                </span>
                            </div>

                            <p className="text-2xl font-bold tracking-tight">
                                {s.value}
                            </p>

                            <p className="mt-1 text-[12px] text-muted-foreground">
                                {s.title}
                            </p>
                        </div>
                    ))}
                </div>

                {/* MAIN CHARTS */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {/* PERFORMANCE */}
                    <div className="rounded-3xl border border-border/40 bg-card p-4 shadow-card sm:p-5">
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold">
                                Campaign Performance
                            </h3>

                            <p className="mt-0.5 text-[12px] text-muted-foreground">
                                Impressions & clicks over time
                            </p>
                        </div>

                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={analytics.performanceData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="hsl(var(--border) / 0.5)"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="date"
                                    tick={{
                                        fontSize: 11,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    tick={{
                                        fontSize: 11,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip contentStyle={tooltipStyle} />

                                <Line
                                    type="monotone"
                                    dataKey="impressions"
                                    stroke="#8B5CF6"
                                    strokeWidth={3.5}
                                    dot={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="#10B981"
                                    strokeWidth={3.5}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* CTR */}
                    <div className="rounded-3xl border border-border/40 bg-card p-4 shadow-card sm:p-5">
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold">
                                CTR Trend
                            </h3>

                            <p className="mt-0.5 text-[12px] text-muted-foreground">
                                Click-through rate performance
                            </p>
                        </div>

                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={analytics.performanceData}>
                                <defs>
                                    <linearGradient
                                        id="ctrFill"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#8B5CF6"
                                            stopOpacity={0.35}
                                        />

                                        <stop
                                            offset="95%"
                                            stopColor="#8B5CF6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="hsl(var(--border) / 0.5)"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="date"
                                    tick={{
                                        fontSize: 11,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    tick={{
                                        fontSize: 11,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip contentStyle={tooltipStyle} />

                                <Area
                                    type="monotone"
                                    dataKey="ctr"
                                    stroke="#8B5CF6"
                                    fill="url(#ctrFill)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AUDIENCE */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                    {/* GENDER */}
                    <div className="rounded-3xl border border-border/40 bg-card p-4 shadow-card sm:p-5">
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold">
                                CTR by Gender
                            </h3>

                            <p className="mt-0.5 text-[12px] text-muted-foreground">
                                Click-through rate by gender demographics
                            </p>
                        </div>

                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={analytics.genderCtrData}
                                barSize={42}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="hsl(var(--border) / 0.5)"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="gender"
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip contentStyle={tooltipStyle} />

                                <Bar
                                    dataKey="ctr"
                                    radius={[10, 10, 0, 0]}
                                >
                                    {analytics.genderCtrData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={
                                                ["#8B5CF6", "#10B981", "#F59E0B"][
                                                i % 3
                                                ]
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="mt-4 space-y-3">
                            {analytics.genderCtrData.map((g, i) => (
                                <div
                                    key={g.gender}
                                    className="flex items-center justify-between rounded-2xl border border-border/40 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{
                                                background:
                                                    ["#8B5CF6", "#10B981", "#F59E0B"][
                                                    i % 3
                                                    ],
                                            }}
                                        />

                                        <div>
                                            <p className="text-sm font-medium">
                                                {g.gender}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {g.impressions.toLocaleString()}{" "}
                                                impressions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-bold">
                                            {g.ctr}%
                                        </p>

                                        <p className="text-[11px] text-muted-foreground">
                                            CTR
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AGE */}
                    <div className="rounded-3xl border border-border/40 bg-card p-4 shadow-card sm:p-5">
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold">
                                CTR by Age
                            </h3>

                            <p className="mt-0.5 text-[12px] text-muted-foreground">
                                Best converting age groups
                            </p>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={analytics.ageCtrData}>
                                <defs>
                                    <linearGradient
                                        id="ageCtrFill"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#8B5CF6"
                                            stopOpacity={0.4}
                                        />

                                        <stop
                                            offset="95%"
                                            stopColor="#8B5CF6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="hsl(var(--border) / 0.5)"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="range"
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip contentStyle={tooltipStyle} />

                                <Area
                                    type="monotone"
                                    dataKey="ctr"
                                    stroke="#8B5CF6"
                                    fill="url(#ageCtrFill)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {analytics.ageCtrData.map((a) => (
                                <div
                                    key={a.range}
                                    className="rounded-2xl border border-border/40 p-3"
                                >
                                    <p className="text-xs text-muted-foreground">
                                        {a.range}
                                    </p>

                                    <p className="mt-1 text-lg font-bold">
                                        {a.ctr}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CITY */}
                    <div className="rounded-3xl border border-border/40 bg-card p-4 shadow-card sm:p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />

                            <div>
                                <h3 className="text-sm font-semibold">
                                    CTR by City
                                </h3>

                                <p className="mt-0.5 text-[12px] text-muted-foreground">
                                    Top performing locations
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {analytics.cityCtrData.map((city) => (
                                <div
                                    key={city.city}
                                    className="rounded-2xl border border-border/40 p-4"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {city.city}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                Location CTR
                                            </p>
                                        </div>

                                        <p className="text-xl font-bold">
                                            {city.ctr}%
                                        </p>
                                    </div>

                                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                                            style={{
                                                width: `${Math.min(
                                                    city.ctr * 20,
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {analytics.highestCtrCity && (
                            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Highest CTR City
                                        </p>

                                        <p className="mt-1 text-lg font-bold">
                                            {analytics.highestCtrCity.city}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-primary/10 p-3">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* LANGUAGE */}
                    {analytics.languageCtrData && <div className="rounded-3xl border border-border/40 bg-card p-4 shadow-card sm:p-5">
                        <div className="mb-5 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />

                            <div>
                                <h3 className="text-sm font-semibold">
                                    CTR by Language
                                </h3>

                                <p className="mt-0.5 text-[12px] text-muted-foreground">
                                    Best performing languages
                                </p>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={analytics.languageCtrData}
                                barSize={36}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="hsl(var(--border) / 0.5)"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="language"
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip contentStyle={tooltipStyle} />

                                <Bar
                                    dataKey="ctr"
                                    radius={[10, 10, 0, 0]}
                                >
                                    {analytics.languageCtrData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={
                                                [
                                                    "#8B5CF6",
                                                    "#10B981",
                                                    "#F59E0B",
                                                    "#3B82F6",
                                                    "#EF4444",
                                                ][i % 5]
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="mt-4 space-y-3">
                            {analytics.languageCtrData.map((lang, i) => (
                                <div
                                    key={lang.language}
                                    className="flex items-center justify-between rounded-2xl border border-border/40 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{
                                                background:
                                                    [
                                                        "#8B5CF6",
                                                        "#10B981",
                                                        "#F59E0B",
                                                        "#3B82F6",
                                                        "#EF4444",
                                                    ][i % 5],
                                            }}
                                        />

                                        <div>
                                            <p className="text-sm font-medium">
                                                {lang.language}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {lang.impressions.toLocaleString()} impressions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-bold">
                                            {lang.ctr}%
                                        </p>

                                        <p className="text-[11px] text-muted-foreground">
                                            CTR
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            </div>
            <ConfirmAdStatusDialog
                adId={ad.id}
                adTitle={ad.title}
                newStatus={adStatus}
                open={confirmDialogOpen}
                openChange={setConfirmDialogOpen}
                onConfirm={() => { }}
            />
        </div>
    );
}