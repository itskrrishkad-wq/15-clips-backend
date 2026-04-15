import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { JWTPayloadCustom } from "../../ads/create/route";
import jwt from "jsonwebtoken"

export async function DELETE(req: NextRequest) {
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
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "id missing" });
    }

    const delete_r = await prisma.reel.delete({ where: { id } });

    if (!delete_r) {
      return NextResponse.json({
        success: false,
        message: "failed to delete reel",
      });
    }

    return NextResponse.json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    console.log("error while deleting reel: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error ",
    });
  }
}
