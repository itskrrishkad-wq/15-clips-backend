import { AdminUserRole } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import jwt from "jsonwebtoken";

const utapi = new UTApi();

export interface JWTPayloadCustom extends JwtPayload {
  id: string;
  role: AdminUserRole;
}

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

    const formData = await req.formData();

    const ads_info_string = formData.get("ads_info");
    const file = formData.get("file") as File;
    const ads_info = ads_info_string
      ? JSON.parse(ads_info_string.toString())
      : {};

    const {
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

    if (
      !title ||
      !description ||
      !url ||
      !interests ||
      !locations ||
      !professions ||
      !gender ||
      !startAt ||
      !endAt ||
      !status ||
      !type ||
      ageMax == null ||
      ageMin == null
    ) {
      console.log("Some fields are missing");
      return NextResponse.json({
        success: false,
        message: "all fields are required",
      });
    }

    if (!file) {
      return NextResponse.json({ success: false, message: "file missing" });
    }

    const res = await utapi.uploadFiles([file]);

    if (!res[0].data?.ufsUrl) {
      return NextResponse.json({
        success: false,
        message: "failed to upload video ",
      });
    }

    const video_url = res[0].data.ufsUrl;

    const create_ad = await prisma.ad.create({
      data: {
        redirectUrl: url,
        endAt: new Date(endAt),
        startAt: new Date(startAt),
        status,
        title,
        type,
        url: video_url,
        ageMax,
        ageMin,
        description,
        gender,
        interests,
        professions,
        locations,
      },
    });

    if (!create_ad) {
      return NextResponse.json({
        success: false,
        message: "failed to create ad",
      });
    }

    return NextResponse.json({
      success: true,
      message: "created successfully",
      data: create_ad,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
