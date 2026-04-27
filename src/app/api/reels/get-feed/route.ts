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

    if (reels.length <= 0) {
      return NextResponse.json({
        success: false,
        message: "no reels available",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: "ok",
      data: reels,
    });
  } catch (error) {
    console.error("error while getting feed: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
