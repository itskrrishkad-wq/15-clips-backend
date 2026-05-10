import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const rid = req.nextUrl.searchParams.get("rid");
    const uid = req.nextUrl.searchParams.get("uid");
    const action = req.nextUrl.searchParams.get("a");

    if (!rid || !uid || !action) {
      return NextResponse.json({
        success: false,
        message: "missing params",
      });
    }

    const reel = await prisma.reel.findUnique({
      where: { id: rid },
    });

    if (!reel) {
      return NextResponse.json({
        success: false,
        message: "no reel found",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: uid },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "no user found",
      });
    }

    // ✅ SAVE
    if (action === "save") {
      const existing = await prisma.reelSaved.findFirst({
        where: {
          reelId: rid,
          userId: uid,
        },
      });

      if (existing) {
        return NextResponse.json({
          success: false,
          message: "already saved",
        });
      }

      await prisma.reelSaved.create({
        data: {
          reelId: rid,
          userId: uid,
        },
      });

      // optional counter
      await prisma.reel.update({
        where: { id: rid },
        data: {
          saveCount: { increment: 1 },
        },
      });

      return NextResponse.json({
        success: true,
        message: "saved",
      });
    }

    // ❌ UNSAVE
    if (action === "unsave") {
      const existing = await prisma.reelSaved.findFirst({
        where: {
          reelId: rid,
          userId: uid,
        },
      });

      if (!existing) {
        return NextResponse.json({
          success: false,
          message: "not saved",
        });
      }

      await prisma.reelSaved.deleteMany({
        where: {
          reelId: rid,
          userId: uid,
        },
      });

      // optional counter
      await prisma.reel.update({
        where: { id: rid },
        data: {
          saveCount: { decrement: 1 },
        },
      });

      return NextResponse.json({
        success: true,
        message: "unsaved",
      });
    }

    return NextResponse.json({
      success: false,
      message: "invalid action",
    });
  } catch (error) {
    console.log("error while reel save:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}