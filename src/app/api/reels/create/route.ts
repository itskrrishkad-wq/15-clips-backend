import { Reel } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { JWTPayloadCustom } from "../../ads/create/route";
import jwt from "jsonwebtoken"

const utapi = new UTApi();

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
    const form_data = await req.formData();
    const reels_data_string = form_data.get("form_data");
    const reels_data: Partial<Reel> = reels_data_string
      ? JSON.parse(reels_data_string.toString())
      : {};

    const file = form_data.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "file missing" });
    }

    const { languages, locations, professions, source, sourceUrl, status } =
      reels_data;

    console.log({
      languages,
      locations,
      professions,
      source,
      sourceUrl,
      status,
    });

    if (
      !languages ||
      !locations ||
      !professions ||
      !source ||
      !sourceUrl ||
      !status
    ) {
      return NextResponse.json({
        success: false,
        message: "all fields are required",
      });
    }

    const res = await utapi.uploadFiles([file]);

    if (!res[0].data?.ufsUrl) {
      return NextResponse.json({
        success: false,
        message: "failed to upload video ",
      });
    }

    let video_url = res?.[0]?.data?.ufsUrl;

    const create_reel = await prisma.reel.create({
      data: {
        reelUrl: video_url,
        source,
        sourceUrl,
        status,
        languages,
        locations,
        professions,
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
      message: "created successfully",
      data: create_reel,
    });
  } catch (error) {
    console.log("error while creating reel: ", error);
    return NextResponse.json({ success: false, message: "ok" });
  }
}
