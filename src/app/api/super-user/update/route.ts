import { AdminUserRole } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { JWTPayloadCustom } from "../../ads/create/route";
import jwt from "jsonwebtoken";

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

    if (admin.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "not authorized" });
    }
    const { role, id }: { role: AdminUserRole; id: string } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "missing id" });
    }

    if (id === admin.id) {
      return NextResponse.json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const update_admin = await prisma.adminUser.update({
      where: { id },
      data: { role },
    });

    if (!update_admin) {
      return NextResponse.json({
        success: false,
        message: "failed to update admin user",
      });
    }

    return NextResponse.json({
      success: true,
      message: "ok",
      data: update_admin,
    });
  } catch (error) {
    console.log("error while updating admin users: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
