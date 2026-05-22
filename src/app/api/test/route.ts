import { Reel, ReelStatus } from "@/generated/prisma/client";
import { categorizeReels } from "@/lib/categoriesReels";
import { fetchNewsYoutube, FetchReel } from "@/lib/fetchNewsYoutube2";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface ExtendedFetchReel extends FetchReel {
  categories: string[];
  hashtags: string[];
}

type ReviewReelInput = {
  channel: string;
  channelId: string;

  duration: number;

  interests: string[];

  languages: string[];

  reelUrl: string;

  source: string;

  sourceUrl: string;

  professions: string[];

  status: ReelStatus;

  thumbnail: string | null;

  viewCount: number;
  saveCount: number;
  likeCount: number;

  sourceViews: number;
  sourceLikee: number;

  locations: string[];
};

export async function GET(req: NextRequest) {
  try {
    const sources = await prisma.source.findMany();

    if (!sources || sources.length <= 0) {
      return NextResponse.json(
        { success: false, message: "no sources found" },
        { status: 400 },
      );
    }

    let reels: ExtendedFetchReel[] = [];

    const reels_data = (
      await Promise.all(
        sources.map(async (source) => {
          return await fetchNewsYoutube([source]);
        }),
      )
    ).flat();

    reels = categorizeReels(reels_data);

    const reviewReels: ReviewReelInput[] = reels
      .filter((reel) => reel.duration > 0)
      .map((reel) => {
        const matchedSource = sources.find(
          (source) => source.channelId === reel.channelId,
        );

        return {
          channel: matchedSource?.channelName ?? "",
          channelId: reel.channelId,

          duration: reel.duration,

          interests: reel.categories,

          languages: [reel.language],

          reelUrl: "",

          source: matchedSource?.source ?? "YOUTUBE",

          sourceUrl: reel.videoUrl,

          professions: [],

          status: "REVIEW",

          thumbnail: reel.thumbnail,

          viewCount: 0,
          saveCount: 0,
          likeCount: 0,

          sourceViews: 0,
          sourceLikee: 0,

          locations: [],
        };
      });

    const last72Hours = new Date(Date.now() - 72 * 60 * 60 * 1000);

    const lastDayReels = await prisma.reel.findMany({
      where: {
        createdAt: {
          gte: last72Hours,
        },
      },
    });

    const existingIds = new Set(lastDayReels.map((reel) => reel.sourceUrl));

    const filtered_reels = reviewReels.filter(
      (reel) => !existingIds.has(reel.sourceUrl),
    );

    const create_reels = await prisma.reel.createMany({
      data: reviewReels,
    });

    console.log({
      beforeFilter: reviewReels.length,
      afterfilter: filtered_reels.length,
    });
    return NextResponse.json({ success: true, reels: filtered_reels });
  } catch (error) {
    console.log("error while testing: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
