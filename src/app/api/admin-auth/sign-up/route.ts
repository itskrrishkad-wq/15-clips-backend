import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { name, lname, email, password } = await req.json();

    if (!name || !lname || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "all fields are required",
      });
    }

    const is_admin = await prisma.adminUser.findFirst({ where: { email } });

    if (is_admin) {
      console.log({ is_admin });
      return NextResponse.json({
        success: false,
        message: "email already exist",
      });
    }

    const hashed_password = bcrypt.hashSync(password, 10);

    const admin_user = await prisma.adminUser.create({
      data: { name, lname, email, password: hashed_password, role: "GUEST" },
    });

    if (!admin_user) {
      return NextResponse.json({
        success: false,
        message: "failed to create admin user",
      });
    }

    const token_data = {
      id: admin_user.id,
      role: admin_user.role,
    };

    const { password: _, ...safeUser } = admin_user;

    const token = jwt.sign(token_data, process.env.JWT_SECRET_KEY as string);

    const response = NextResponse.json({
      success: true,
      message: "created successfully",
      data: safeUser,
    });

    response.cookies.set("15clips-guest-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.log("error while signing up: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
