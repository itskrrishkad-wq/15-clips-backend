import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWTPayloadCustom } from "../../create/route";
import prisma from "@/lib/prisma";

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

    // If you only have one settings row
    const adSetting = await prisma.adSettings.findFirst();

    if (!adSetting) {
      return NextResponse.json({
        success: false,
        message: "ad settings not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: adSetting,
    });
  } catch (error) {
    console.log("error while fetching ad settings: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
