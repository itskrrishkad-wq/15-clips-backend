import { verifyAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { id, uid, watchTime, completed } = await req.json();
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
      where: { reelId: id, userId: user.id },
    });

    if (reel_view_exists) {
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
