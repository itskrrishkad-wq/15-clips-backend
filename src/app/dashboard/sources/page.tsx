"use client"

import { Source } from "@/generated/prisma/browser";
import { useEffect, useState } from "react";



function SourceCard({
    img,
    title,
    children,
}: {
    img: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border border-white/[0.06]
        bg-white
        p-5
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-white/[0.12]
        w-full
      "
        >
            {/* subtle glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)] pointer-events-none" />

            {/* top section */}
            <div className="relative flex items-center gap-4">
                {/* image */}
                <div
                    className="
            relative
            h-14 w-14 shrink-0 overflow-hidden
            rounded-full
            ring-1 ring-white/10
          "
                >
                    <img
                        src={img}
                        alt={title}
                        className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-110 rounded-full
            "
                    />

                    <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* title */}
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-semibold">
                        {title}
                    </h3>

                    <p className="mt-1 text-[12px] text-zinc-500">
                        Content Source
                    </p>
                </div>
            </div>

            {/* content */}
            <div className="relative mt-5">
                {children}
            </div>
        </div>
    );
}

export default function SourcesPage() {
    const [sources, setSources] = useState<Source[]>([])
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setLoading(true);

                const res = await fetch("/api/source/get", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (!data.success) return;

                setSources(data.data || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);


    useEffect(() => {
        setMounted(true);
    }, []);


    if (!mounted) {
        return null;
    }
    return (
        <>
            <div className="w-full gap-4 sm:gap-6">
                <div className="w-full">
                    {loading ? <div>
                        <h2 className="text-sm font-semibold text-gray-500">loading...</h2>
                    </div> : sources.length <= 0 ? <div>
                        <h2 className="text-2xl font-semibold">No sources yet</h2>
                    </div> :
                        <div className="w-full grid grid-cols-3 gap-4">
                            {sources.map((source) => {
                                return <SourceCard
                                    key={source.channelId}
                                    img={source.profileImg ?? ""}
                                    title={source.channelName}
                                >
                                    <div
                                        className="
      relative overflow-hidden
      rounded-3xl
      border border-zinc-100
      bg-zinc-950/5
      p-5
      transition-all duration-300
      hover:border-zinc-1-0
      hover:bg-zinc-900/5
    "
                                    >
                                        {/* glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-transparent pointer-events-none" />

                                        {/* TOP */}
                                        <div className="relative flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div
                                                        className={`h-1.5 w-1.5 rounded-full ${source.source === "YOUTUBE"
                                                            ? "bg-red-500"
                                                            : "bg-pink-500"
                                                            }`}
                                                    />

                                                    <span className="text-[10px] font-medium tracking-[0.18em] text-zinc-500 uppercase">
                                                        {source.source}
                                                    </span>
                                                </div>

                                                <h2 className="text-[15px] font-semibold truncate">
                                                    {source.channelName}
                                                </h2>
                                            </div>

                                            <div className="shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 px-3 py-1.5">
                                                <p className="text-[10px] font-medium text-zinc-700">
                                                    {source.language}
                                                </p>
                                            </div>
                                        </div>

                                        {/* CATEGORY SECTION */}
                                        <div className="relative mt-5">
                                            <p className="mb-3 text-[11px] font-medium text-zinc-500">
                                                Categories
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {source.categories.map((category) => (
                                                    <div
                                                        key={category}
                                                        className="
              rounded-full
        border border-zinc-200
        bg-zinc-50
        px-3 py-1.5
        text-[11px]
        font-medium
        text-zinc-700
        transition-all duration-200
        hover:border-zinc-300
        hover:bg-zinc-100
            "
                                                    >
                                                        {category}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* BOTTOM */}
                                        <div className="relative mt-6 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <p className="text-[11px] text-zinc-500">
                                                    Connected
                                                </p>
                                            </div>

                                            <div className="text-[11px] text-zinc-600">
                                                Source Channel
                                            </div>
                                        </div>
                                    </div>
                                </SourceCard>
                            })}
                        </div>
                    }
                </div>




            </div>
        </>
    );
}
