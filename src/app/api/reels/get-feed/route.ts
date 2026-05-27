import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, id } = await req.json();

    if (!accessToken || !id) {
      return NextResponse.json({
        success: false,
        message: "missing important fields",
      });
    }

    const reels = await prisma.reel.findMany({ where: { status: "PUBLISH" } });

    const saved = await prisma.reelSaved.findMany({
      where: { userId: id },
      include: { reel: true },
    });
    console.log({ saved });

    const views = await prisma.reelView.findMany();

    const new_reels = reels.filter((reel) =>
      views.some((view) => view.reelId !== reel.id),
    );

    if (reels.length <= 0) {
      return NextResponse.json({
        success: false,
        message: "no reels available",
        data: [],
        saved: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: "ok",
      data: reels,
      saved,
    });
  } catch (error) {
    console.error("error while getting feed: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
