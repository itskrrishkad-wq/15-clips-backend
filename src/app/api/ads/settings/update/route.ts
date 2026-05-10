import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWTPayloadCustom } from "../../create/route";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("15clips-authentication")?.value;
    const { id, numberOfReelsBetweenAds } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "not authorized" });
    }

    if (!id || !numberOfReelsBetweenAds) {
      return NextResponse.json({ success: false, message: "missing fields" });
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

    const adSetting = await prisma.adSettings.update({
      where: { id },
      data: { numberOfReelsBetweenAds },
    });

    if (!adSetting) {
      return NextResponse.json({
        success: false,
        message: "failed to update ad settings",
      });
    }

    return NextResponse.json({ success: true, message: "update successfully" });
  } catch (error) {
    console.log("error while settings update: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
