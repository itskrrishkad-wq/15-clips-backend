import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "all fields are required" },
        { status: 400 },
      );
    }

    const is_user = await prisma.user.findFirst({ where: { email } });

    if (is_user) {
      return NextResponse.json(
        { success: false, message: "user already exists" },
        { status: 400 },
      );
    }

    const hashed_pass = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed_pass },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "failed to create user" },
        { status: 400 },
      );
    }

    const otp = generateOTP();
    console.log({ otp });
    const token_data = {
      email,
      otp,
    };

    const token = bcrypt.hashSync(JSON.stringify(token_data), 10);

    return NextResponse.json(
      { success: true, message: "ok", verifyToken: token },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
