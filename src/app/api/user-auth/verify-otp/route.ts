import { signAccessToken, signRefreshToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { verify_token, otp, email } = await req.json();


    const isValid = bcrypt.compareSync(
      JSON.stringify({ email, otp }),
      verify_token,
    );

    if (!isValid) {
      console.log("incorrect code ", isValid);
      return NextResponse.json({ success: false, message: "incorrect code" });
    }

    const user_verified = await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    if (!user_verified || !user_verified.emailVerified) {
      return NextResponse.json({ success: false, message: "failed to verify" });
    }

    const { password: _, ...safeUser } = user_verified;

    const accessToken = signAccessToken(user_verified.id);
    const refreshToken = signRefreshToken(user_verified.id);


    return NextResponse.json({
      success: true,
      message: "ok",
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("error while verifing otp: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
