import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJWTPayload extends JwtPayload {
  id: string;
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("15clips-authentication")?.value;
    const {
      name,
      lname,
      gender,
      location,
      profession,
      dailyTimeSpent,
      email,
      interests,
    } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "missing token" },
        { status: 400 },
      );
    }

    const token_data = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as CustomJWTPayload;

    if (!token_data.id) {
      return NextResponse.json({ success: false, message: "token expired" });
    }

    const admin = await prisma.adminUser.findFirst({
      where: { id: token_data.id, role: token_data.role },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: "not authorized" });
    }

    if (admin.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "not authorized" });
    }

    console.log({
      name,
      lname,
      gender,
      location,
      profession,
      dailyTimeSpent,
      email,
      interests,
    });

    const user = await prisma.user.findFirst({ where: { id: token_data.id } });

    if (!user) {
      return NextResponse.json({ success: false, message: "user not found" });
    }
    if (
      !profession ||
      interests.length <= 0 ||
      !name ||
      !lname ||
      !location ||
      !gender
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "all fields are required",
        },
        { status: 400 },
      );
    }

    const update_user = await prisma.user.update({
      where: { id: user.id },
      data: {
        profession,
        interests,
        name,
        lname,
        location,
        gender,
        dailyTimeSpent: dailyTimeSpent ? dailyTimeSpent : user.dailyTimeSpent,
      },
    });

    if (!update_user) {
      return NextResponse.json({
        success: false,
        message: "failed to update user info",
      });
    }

    const { password: _, ...safeUser } = update_user;

    return NextResponse.json({
      success: true,
      message: "ok",
      user: safeUser,
    });
  } catch (error) {
    console.log("error while updating user: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
