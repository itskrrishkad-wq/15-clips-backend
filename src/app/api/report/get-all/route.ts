import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWTPayloadCustom } from "../../ads/create/route";

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

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" }, // newest first
    });

    return NextResponse.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.log("error while fetching reports: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
