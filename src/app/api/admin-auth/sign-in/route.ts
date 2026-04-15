import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "email and password are required",
      });
    }

    // 1. find user
    const user = await prisma.adminUser.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "user not found",
      });
    }

    // 2. check password
    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "invalid credentials",
      });
    }

    // 3. create token
    const tokenData = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "7d",
    });

    const token_name =
      user.role === "GUEST" ? "15clips-guest-token" : "15clips-authentication";

    // 4. remove password from response
    const { password: _, ...safeUser } = user;

    // 5. send response + cookie
    const response = NextResponse.json({
      success: true,
      message: "login successful",
      data: safeUser,
    });

    response.cookies.set(token_name, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.log("error while signing in:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
