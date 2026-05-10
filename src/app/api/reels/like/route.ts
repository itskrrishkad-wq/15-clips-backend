import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const rid = req.nextUrl.searchParams.get("rid");
    const uid = req.nextUrl.searchParams.get("uid");
    const action = req.nextUrl.searchParams.get("a");

    if (!rid || !uid || !action) {
      return NextResponse.json({ success: false, message: "missing params" });
    }

    const reel = await prisma.reel.findFirst({ where: { id: rid } });

    if (!reel) {
      return NextResponse.json({ success: false, message: "no reel found" });
    }

    const user = await prisma.user.findFirst({ where: { id: uid } });

    if (!user) {
      return NextResponse.json({ success: false, message: "no user found" });
    }

    if (action === "like") {
      const like_exist = await prisma.reelLike.findFirst({
        where: { reelId: rid, userId: uid },
      });

      if (like_exist) {
        return NextResponse.json({
          success: false,
          message: "like already exists on this user and reel",
        });
      }

      const like = await prisma.reelLike.create({
        data: {
          reelId: rid,
          userId: uid,
          gender: user.gender,
          liked: true,
          location: user.location,
        },
      });

      if (!like) {
        return NextResponse.json({
          success: false,
          message: "failed to create like",
        });
      }

      const likeReel = await prisma.reel.update({
        where: { id: rid },
        data: { likeCount: { increment: 1 } },
      });

      if (!likeReel) {
        return NextResponse.json({
          success: false,
          message: "failed to increment like",
        });
      }

      return NextResponse.json({ success: true, message: "ok" });
    }
    if (action === "unlike") {
      const findLike = await prisma.reelLike.findFirst({
        where: { userId: user.id, reelId: reel.id },
      });

      if (!findLike) {
        return NextResponse.json({
          success: false,
          message: "like not found",
        });
      }

      await prisma.reelLike.deleteMany({
        where: { userId: findLike.userId, reelId: findLike.reelId },
      });

      await prisma.reel.update({
        where: { id: findLike.reelId },
        data: { likeCount: { decrement: 1 } },
      });

      return NextResponse.json({ success: true, message: "ok" });
    }
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  } catch (error) {
    console.log("error while reel like: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
