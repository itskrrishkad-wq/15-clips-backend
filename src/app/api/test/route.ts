import { fetchNewsYoutube, FetchReel } from "@/lib/fetchNewsYoutube2";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sources = await prisma.source.findMany();

    if (!sources || sources.length <= 0) {
      return NextResponse.json({ success: false, message: "no sources found" });
    }

    let reels: FetchReel[] = [];

    const reels_data = (
      await Promise.all(
        sources.map(async (source) => {
          return await fetchNewsYoutube([source]);
        }),
      )
    ).flat();

    reels = reels_data;

    console.log({ reels: reels.length });
    return NextResponse.json({ success: true, reels });
  } catch (error) {
    console.log("error while testing: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
