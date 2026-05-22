import { NextRequest, NextResponse } from "next/server";
import { JWTPayloadCustom } from "../../ads/create/route";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { Reel } from "@/generated/prisma/client";
import { downloadAndUpload } from "@/lib/yt-downloader";

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("15clips-authentication")?.value;
    const {
      id,
      languages,
      locations,
      professions,
      reelUrl,
      status,
      interests,
    }: Partial<Reel> = await req.json();

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

    if (
      !languages ||
      !locations ||
      !professions ||
      !reelUrl ||
      !status ||
      !interests
    ) {
      console.log("All fields are required");
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    const reel = await prisma.reel.findFirst({ where: { id } });

    if (!reel) {
      return NextResponse.json({
        success: false,
        message: "reel not found",
      });
    }

    const source = await prisma.source.findFirst({
      where: { channelId: reel.channelId ?? "" },
    });

    if (!source) {
      return NextResponse.json({
        success: false,
        message: "source not found",
      });
    }
    const url = await downloadAndUpload(reelUrl);

    if (!url) {
      return NextResponse.json({
        success: false,
        message: "failed to download the video ",
      });
    }

    let video_url: string = url;

    const approve_reel = await prisma.reel.update({
      where: { id },
      data: {
        languages,
        locations,
        professions,
        reelUrl: video_url,
        status,
        interests,
        sourceThumbnail: source.profileImg,
      },
    });

    if (!approve_reel) {
      return NextResponse.json({ success: false, message: "failed to update" });
    }

    return NextResponse.json({
      success: true,
      message: "ok",
      data: approve_reel,
    });
  } catch (error) {
    console.log("error approving: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
