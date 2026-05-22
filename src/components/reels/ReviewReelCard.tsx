"use client";

import { indianLanguages } from "@/data/languages";
import { Reel } from "@/generated/prisma/browser";
import Image from "next/image";

export type ReviewReelCardProps = {
    reel: Reel;
    setOpen: (value: boolean) => void
    setReel: (value: Reel) => void
};

function Tags({
    items,
}: {
    items: string[];
}) {
    if (!items?.length) return null;

    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {items.map((item, index) => (
                <div
                    key={`${item}-${index}`}
                    className="
            rounded-full border border-white/10
            bg-black/40 px-2.5 py-1
            text-[10px] font-medium text-white
            backdrop-blur-md
          "
                >
                    {item}
                </div>
            ))}
        </div>
    );
}

export default function ReviewReelCard({
    reel,
    setOpen,
    setReel
}: ReviewReelCardProps) {
    return (
        <div
            className="
        relative overflow-hidden rounded-3xl
        border border-zinc-800
        bg-zinc-950
      "
            onClick={() => {
                setReel(reel);
                setOpen(true)
            }}
        >
            {/* Thumbnail */}
            <div className="relative aspect-[9/16] w-full bg-zinc-900">
                <Image
                    priority
                    fill
                    unoptimized
                    alt={reel.channel || "reel-thumbnail"}
                    src={
                        reel.thumbnail ||
                        reel.sourceThumbnail ||
                        "https://placehold.co/600x900/png"
                    }
                    className="object-cover"
                />

                {/* Overlay */}
                <div
                    className="
            absolute inset-0
            bg-gradient-to-t
            from-black/95
            via-black/30
            to-black/10
          "
                />

                {/* Content */}
                <div
                    className="
            absolute inset-0
            flex flex-col justify-end
            p-5
          "
                >
                    {/* Source */}
                    <div
                        className="
              mb-3 inline-flex w-fit
              rounded-full border border-white/10
              bg-white/10 px-1.5 py-0.5
              backdrop-blur-md
            "
                    >
                        <p className="text-[11px] font-medium text-white">
                            {reel.source.slice(0, 1)}{reel.source.slice(1).toLowerCase()}
                        </p>
                    </div>

                    {/* Channel */}
                    <h2 className="text-base font-bold text-white">
                        {reel.channel || "Unknown Channel"}
                    </h2>

                    {/* Languages */}
                    {!!reel.languages?.length && (
                        <div className="mt-5">
                            <p className="text-[8px] font-semibold uppercase tracking-wider text-zinc-300">
                                Languages
                            </p>

                            <Tags
                                items={indianLanguages
                                    .filter((lang) =>
                                        reel.languages.some(
                                            (reLang) => reLang === lang.value || reLang === lang.locale
                                        )
                                    )
                                    .map((lang) => lang.label)}
                            />
                        </div>
                    )}

                    {/* Professions */}
                    {!!reel.professions?.length && (
                        <div className="mt-4">
                            <p className="text-[8px] font-semibold uppercase tracking-wider text-zinc-300">
                                Professions
                            </p>

                            <Tags items={reel.professions} />
                        </div>
                    )}

                    {/* Interests */}
                    {!!reel.interests?.length && (
                        <div className="mt-4">
                            <p className="text-[8px] font-semibold uppercase tracking-wider text-zinc-300">
                                Interests
                            </p>

                            <Tags items={reel.interests} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}