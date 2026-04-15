import { Ad } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { JWTPayloadCustom } from "../create/route";
import jwt from "jsonwebtoken"

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

    const ads_info_string = formData.get("ads_info");
    const file = formData.get("file") as File | null;

    const ads_info: Partial<any> & { id: string } = ads_info_string
      ? JSON.parse(ads_info_string.toString())
      : ({} as any);

    const {
      id,
      title,
      description,
      url,
      interests,
      locations,
      professions,
      gender,
      startAt,
      endAt,
      status,
      type,
      ageMax,
      ageMin,
    } = ads_info;

    // ✅ Require ID
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Ad id is required",
      });
    }

    // ✅ Check if ad exists
    const existingAd = await prisma.ad.findUnique({
      where: { id },
    });

    if (!existingAd) {
      return NextResponse.json({
        success: false,
        message: "Ad not found",
      });
    }

    // ✅ Array validation (only if provided)
    const isValidArray = (arr: any) => Array.isArray(arr) && arr.length > 0;

    if (
      (interests !== undefined && !isValidArray(interests)) ||
      (locations !== undefined && !isValidArray(locations)) ||
      (professions !== undefined && !isValidArray(professions))
    ) {
      return NextResponse.json({
        success: false,
        message: "Arrays must not be empty",
      });
    }

    // ✅ (Optional) handle file upload here
    let updatedFileUrl = existingAd.url;
    if (file) {
      // TODO: upload file and get URL
      // updatedFileUrl = "new_uploaded_file_url";

      const res = await utapi.uploadFiles([file]);

      if (!res[0].data?.ufsUrl) {
        return NextResponse.json({
          success: false,
          message: "failed to upload video ",
        });
      }

      updatedFileUrl = res[0].data.ufsUrl;
    }

    // ✅ Update only provided fields
    const updatedAd = await prisma.ad.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(url !== undefined && { url: file ? updatedFileUrl : url }),
        ...(gender !== undefined && { gender }),
        ...(startAt !== undefined && { startAt }),
        ...(endAt !== undefined && { endAt }),
        ...(status !== undefined && { status }),
        ...(type !== undefined && { type }),
        ...(ageMax !== undefined && { ageMax }),
        ...(ageMin !== undefined && { ageMin }),
        ...(interests !== undefined && { interests }),
        ...(locations !== undefined && { locations }),
        ...(professions !== undefined && { professions }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "updated successfully",
      data: updatedAd,
    });
  } catch (error) {
    console.log("error updating ad:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
