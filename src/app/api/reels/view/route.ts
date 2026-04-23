import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const uid = req.nextUrl.searchParams.get("uid");

    if (!id || !uid) {
      console.log({ id, uid });
      return NextResponse.json({ success: false, message: "missing id's" });
    }

    const reel_view = await prisma.reelView.create({
      data: { reelId: id, userId: uid },
    });

    if (!reel_view) {
      return NextResponse.json({
        success: false,
        message: "failed to create reel view",
      });
    }

    await prisma.reel.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, message: "ok" });
  } catch (error) {
    console.log("failed to create reel view: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
