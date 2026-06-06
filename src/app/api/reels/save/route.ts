import { verifyAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const rid = req.nextUrl.searchParams.get("rid");
    const uid = req.nextUrl.searchParams.get("uid");
    const action = req.nextUrl.searchParams.get("a");
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        {
          success: false,
          message: "No authorization header",
        },
        { status: 401 },
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    console.log({ accessToken });

    if (!accessToken) {
      return NextResponse.json({
        success: false,
        message: "missing important fields",
      });
    }

    const decoded = verifyAccessToken(accessToken);

    console.log({ decoded });

    if (!decoded.id) {
      return NextResponse.json({ success: false, message: "token expired" });
    }

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

      const savedReel = await prisma.reelSaved.create({
        data: {
          reelId: rid,
          userId: uid,
        },
        include: {
          reel: true,
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
        data: savedReel,
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
        data: existing.id,
      });
    }

    return NextResponse.json({
      success: false,
      message: "invalid action",
    });
  } catch (error) {
    console.log("error while reel save:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return Response.json(
        {
          success: false,
          code: "TOKEN_EXPIRED",
          message: "Access token expired",
        },
        { status: 401 },
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return Response.json(
        {
          success: false,
          code: "INVALID_TOKEN",
          message: "Invalid token",
        },
        { status: 401 },
      );
    }
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
