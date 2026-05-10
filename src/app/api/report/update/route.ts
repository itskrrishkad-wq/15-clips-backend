import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWTPayloadCustom } from "../../ads/create/route";

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("15clips-authentication")?.value;
    const { id, status } = await req.json();

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

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "missing fields" });
    }

    const report = await prisma.report.update({
      where: { id },
      data: { status },
    });

    if (!report) {
      return NextResponse.json({
        success: false,
        message: "failed to update report",
      });
    }

    return NextResponse.json({ success: true, message: "ok" });
  } catch (error) {
    console.log("error while updating report: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
