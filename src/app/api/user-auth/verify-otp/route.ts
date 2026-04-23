import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { verify_token, otp, email } = await req.json();

    console.log({ verify_token, otp, email });

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

    const token_data = {
      id: user_verified.id,
    };

    const token = jwt.sign(token_data, process.env.JWT_SECRET_KEY as string);

    return NextResponse.json({
      success: true,
      message: "ok",
      user: safeUser,
      accessToken: token,
    });
  } catch (error) {
    console.log("error while verifing otp: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
