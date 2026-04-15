import { Reel } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { downloadAndUpload } from "@/lib/yt-downloader";
import { NextRequest, NextResponse } from "next/server";
import { JWTPayloadCustom } from "../../ads/create/route";
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
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
    const {
      languages,
      locations,
      professions,
      reelUrl,
      status,
    }: Partial<Reel> = await req.json();

    if (!languages || !locations || !professions || !reelUrl || !status) {
      console.log("All fields are required");
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    const url = await downloadAndUpload(reelUrl);
    console.log(url);
    // const res = await utapi.uploadFiles(file);
    // console.log(res.data?.name, res.data?.ufsUrl);

    if (!url) {
      return NextResponse.json({
        success: false,
        message: "failed to download the video ",
      });
    }

    let video_url: string = url;
    console.log({ video_url });

    const create_reel = await prisma.reel.create({
      data: {
        sourceUrl: reelUrl,
        source: reelUrl.split("https://")[1].split(".com")[0],
        status,
        languages,
        professions,
        locations,
        reelUrl: video_url,
      },
    });

    if (!create_reel) {
      return NextResponse.json({
        success: false,
        message: "failed to create reel",
      });
    }

    return NextResponse.json({
      success: true,
      data: create_reel,
      message: "created successfully",
    });
  } catch (error) {
    console.log("error while creating reel via url: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
