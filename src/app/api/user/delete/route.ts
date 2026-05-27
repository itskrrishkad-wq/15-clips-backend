import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJWTPayload extends JwtPayload {
  id: string;
  role: string;
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("15clips-authentication")?.value;

    const id = req.nextUrl.searchParams.get("id");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "missing token",
        },
        { status: 401 },
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "user id is required",
        },
        { status: 400 },
      );
    }

    const token_data = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as CustomJWTPayload;

    if (!token_data.id) {
      return NextResponse.json(
        {
          success: false,
          message: "token expired",
        },
        { status: 401 },
      );
    }

    const admin = await prisma.adminUser.findFirst({
      where: {
        id: token_data.id,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "not authorized",
        },
        { status: 403 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 },
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log("error while deleting user:", error);

    return NextResponse.json(
      {
        success: false,
        message: "internal server error",
      },
      { status: 500 },
    );
  }
}
