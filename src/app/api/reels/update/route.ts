import { Reel } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { JWTPayloadCustom } from "../../ads/create/route";
import jwt from "jsonwebtoken";

const utapi = new UTApi();

export async function PUT(req: NextRequest) {
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
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const update_info_string = formData.get("update_info");
    const update_info: Partial<Reel> = update_info_string
      ? JSON.parse(update_info_string.toString())
      : "";
    const { id, languages, locations, professions, status, source, sourceUrl } =
      update_info;

    if (
      !id ||
      !status ||
      !Array.isArray(languages) ||
      languages.length <= 0 ||
      !Array.isArray(locations) ||
      locations.length <= 0 ||
      !Array.isArray(professions) ||
      professions.length <= 0 ||
      !source ||
      !sourceUrl
    ) {
      console.log(
        id,
        status,
        Array.isArray(languages),
        languages!.length <= 0,
        Array.isArray(locations),
        locations!.length <= 0,
        Array.isArray(professions),
        professions!.length <= 0,
        source,
        sourceUrl,
      );
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingReel = await prisma.reel.findUnique({
      where: { id },
    });

    if (!existingReel) {
      return NextResponse.json({
        success: false,
        message: "Reel not found",
      });
    }

    // ✅ Validation for arrays (only if provided)
    const isValidArray = (arr: any) => Array.isArray(arr) && arr.length > 0;

    if (
      (languages !== undefined && !isValidArray(languages)) ||
      (locations !== undefined && !isValidArray(locations)) ||
      (professions !== undefined && !isValidArray(professions))
    ) {
      return NextResponse.json({
        success: false,
        message: "Arrays must not be empty",
      });
    }

    let video_url = existingReel.reelUrl;

    if (file) {
      const res = await utapi.uploadFiles([file]);

      if (!res[0].data?.ufsUrl) {
        return NextResponse.json({
          success: false,
          message: "failed to upload video ",
        });
      }

      video_url = res[0].data?.ufsUrl; // replace with actual path if needed
    }

    const updatedReel = await prisma.reel.update({
      where: { id },
      data: {
        ...(languages !== undefined && { languages }),
        ...(locations !== undefined && { locations }),
        ...(professions !== undefined && { professions }),
        ...(status !== undefined && { status }),
        ...(video_url && {
          sourceUrl: sourceUrl,
          source: source,
          reelUrl: video_url,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedReel,
      message: "updated successfully",
    });
  } catch (error) {
    console.log("error while updating reel: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
