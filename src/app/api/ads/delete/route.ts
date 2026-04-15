import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { JWTPayloadCustom } from "../create/route";
import jwt from "jsonwebtoken"

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
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

    if (!id) {
      return NextResponse.json({ success: false, message: "id missing" });
    }

    const delete_a = await prisma.ad.delete({ where: { id } });

    if (!delete_a) {
      return NextResponse.json({
        success: false,
        message: "failed to delete ad",
      });
    }

    return NextResponse.json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    console.log("error while deleting ad: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error ",
    });
  }
}
