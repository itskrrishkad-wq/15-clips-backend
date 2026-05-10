import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWTPayloadCustom } from "../../ads/create/route";

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("15clips-authentication")?.value;
    const { id } = await req.json();

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

    if (!id) {
      return NextResponse.json({ success: false, message: "missing id" });
    }

    const deletedReport = await prisma.report.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "report deleted successfully",
      data: deletedReport,
    });
  } catch (error: any) {
    console.log("error while deleting report: ", error);

    // Handle case where record doesn't exist
    if (error.code === "P2025") {
      return NextResponse.json({
        success: false,
        message: "report not found",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
