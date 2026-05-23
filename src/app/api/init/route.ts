import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWTPayloadCustom } from "../ads/create/route";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("15clips-authentication")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "not authorized" });
    }

    const token_data = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as JWTPayloadCustom;

    const admin = await prisma.adminUser.findFirst({
      where: { id: token_data.id, role: token_data.role },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: "not authorized" });
    }

    if (admin.role !== "MANAGER" && admin.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "not authorized" });
    }

    const reels = await prisma.reel.findMany();

    const ads = await prisma.ad.findMany();

    const users = await prisma.user.findMany();

    const admins = await prisma.adminUser.findMany();

    const sources = await prisma.source.findMany();

    const reports = await prisma.report.findMany();

    const reelViews = await prisma.reelView.findMany();

    const adEvents = await prisma.adEvent.findMany();

    return NextResponse.json({
      success: true,
      message: "ok",
      data: {
        reels,
        ads,
        users,
        admins,
        sources,
        reports,
        reelViews,
        adEvents,
      },
    });
  } catch (error) {
    console.log("error while getting all reels: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
