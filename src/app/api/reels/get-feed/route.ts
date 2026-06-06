import { verifyAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
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

    if (!accessToken || !id) {
      return NextResponse.json({
        success: false,
        message: "missing important fields",
      });
    }

    const decoded = verifyAccessToken(accessToken);

    console.log({ decoded });

    const reels = await prisma.reel.findMany({ where: { status: "PUBLISH" } });

    const saved = await prisma.reelSaved.findMany({
      where: { userId: id },
      include: { reel: true },
    });

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
  } catch (error: any) {
    console.error("error while getting feed: ", error);
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
