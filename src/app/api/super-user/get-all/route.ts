import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { JWTPayloadCustom } from "../../ads/create/route";
import jwt from "jsonwebtoken";

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

    if (admin.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "not authorized" });
    }
    const admin_users = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // ❌ password not included
      },
    });

    if (!admin_users || admin_users.length === 0) {
      return NextResponse.json({
        success: true,
        message: "no admins found",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: "ok",
      data: admin_users,
    });
  } catch (error) {
    console.log("error while getting super user: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
