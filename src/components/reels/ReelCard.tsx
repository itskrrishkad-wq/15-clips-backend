"use client";

import Image from "next/image";

import {
  BookmarkIcon,
  HeartIcon,
  PlayIcon,
} from "lucide-react";

import { Reel } from "@/generated/prisma/browser";

const ReelCardPreview = ({
  reel,
}: {
  reel: Reel;
}) => {
  const thumbnail =
    reel.thumbnail ||
    reel.sourceThumbnail || reel.reelUrl ||
    "https://placehold.co/600x900/png";

  const statusStyles = {
    DRAFT:
      "border-yellow-500/20 bg-yellow-500/15 text-yellow-300",
    PUBLISH:
      "border-emerald-500/20 bg-emerald-500/15 text-emerald-300",
    REVIEW:
      "border-blue-500/20 bg-blue-500/15 text-blue-300",
  };

  return (
    <div
      className="
        group relative w-full
        max-w-56 overflow-hidden
        rounded-[28px]
        border border-white/10
        bg-black
        aspect-[9/16]
      "
    >
      {/* THUMBNAIL */}
      <Image
        fill
        priority
        unoptimized
        alt={reel.channel || "reel-thumbnail"}
        src={thumbnail}
        className="
          object-cover
          transition-transform duration-500
          group-hover:scale-[1.03]
        "
      />

      {/* OVERLAY */}
      <div
        className="
          absolute inset-0 z-10
          bg-gradient-to-t
          from-black/95
          via-black/20
          to-black/10
        "
      />

      {/* TOP */}
      <div
        className="
          absolute inset-x-0 top-0 z-20
          p-3
        "
      >
        <div className="flex items-start justify-between gap-2">
          {/* SOURCE */}
          <div
            className="
              max-w-[75%]
              rounded-full border border-white/10
              bg-black/40 px-3 py-1.5
              backdrop-blur-xl
            "
          >
            <p
              className="
                truncate text-[11px]
                font-medium text-white
              "
            >
              {reel.source}
            </p>
          </div>

          {/* STATUS */}
          <div
            className={`
              rounded-full border px-2.5 py-1
              text-[10px] font-semibold
              tracking-wide backdrop-blur-xl
              ${statusStyles[reel.status]}
            `}
          >
            {reel.status}
          </div>
        </div>
      </div>

      {/* BOTTOM CONTENT */}
      <div
        className="
          absolute inset-x-0 bottom-0
          z-20 p-4
        "
      >
        {/* CHANNEL */}
        <div className="mb-3">
          <h2
            className="
              line-clamp-1 text-sm
              font-semibold text-white
            "
          >
            {reel.channel || "Unknown Channel"}
          </h2>

          <p
            className="
              mt-1 line-clamp-2
              text-[11px]
              text-zinc-300
            "
          >
            {reel.languages
              ?.slice(0, 2)
              .join(" • ")}
          </p>
        </div>

        {/* TAGS */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {reel.interests
            ?.slice(0, 2)
            .map((item) => (
              <div
                key={item}
                className="
                  rounded-full
                  border border-white/10
                  bg-white/10
                  px-2 py-1
                  text-[10px]
                  font-medium text-white
                  backdrop-blur-xl
                "
              >
                {item}
              </div>
            ))}

          {reel.professions
            ?.slice(0, 1)
            .map((item) => (
              <div
                key={item}
                className="
                  rounded-full
                  border border-blue-500/20
                  bg-blue-500/15
                  px-2 py-1
                  text-[10px]
                  font-medium text-blue-200
                  backdrop-blur-xl
                "
              >
                {item}
              </div>
            ))}
        </div>

        {/* STATS */}
        <div
          className="
            flex items-center
            justify-between gap-2
          "
        >
          <div
            className="
              flex items-center gap-1
              rounded-full border
              border-white/10
              bg-black/30
              px-2.5 py-1.5
              backdrop-blur-xl
            "
          >
            <PlayIcon className="h-3.5 w-3.5 fill-white text-white" />

            <span className="text-[11px] font-medium text-white">
              {reel.viewCount}
            </span>
          </div>

          <div
            className="
              flex items-center gap-1
              rounded-full border
              border-white/10
              bg-black/30
              px-2.5 py-1.5
              backdrop-blur-xl
            "
          >
            <HeartIcon className="h-3.5 w-3.5 fill-white text-white" />

            <span className="text-[11px] font-medium text-white">
              {reel.likeCount}
            </span>
          </div>

          <div
            className="
              flex items-center gap-1
              rounded-full border
              border-white/10
              bg-black/30
              px-2.5 py-1.5
              backdrop-blur-xl
            "
          >
            <BookmarkIcon className="h-3.5 w-3.5 fill-white text-white" />

            <span className="text-[11px] font-medium text-white">
              {reel.saveCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCardPreview;