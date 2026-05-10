import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, uid, watchTime, completed } = await req.json();

    if (!id || !uid) {
      return NextResponse.json({ success: false, message: "missing id's" });
    }

    const user = await prisma.user.findFirst({ where: { id: uid } });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "no user found",
      });
    }

    const reel_view_exists = await prisma.reelView.findFirst({
      where: { reelId: id, userId: uid },
    });

    if (!reel_view_exists) {
      return NextResponse.json({
        success: false,
        message: "reel view exists",
      });
    }

    const reel_view = await prisma.reelView.create({
      data: {
        reelId: id,
        userId: uid,
        watchTime,
        completed,
        gender: user.gender,
        location: user.location,
      },
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
