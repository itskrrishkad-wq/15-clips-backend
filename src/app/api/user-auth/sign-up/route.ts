import { transporter } from "@/lib/nodemailer";
import prisma from "@/lib/prisma";
import { generateOTP } from "@/lib/utils";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

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

    const mailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      padding: 25px;
      border-radius: 12px;
      background: #ffffff;
      border: 1px solid #e0e0e0;
    }
    h2 {
      color: #a56dff;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
    }
    .otp-box {
      margin: 25px 0;
      padding: 20px;
      text-align: center;
      background: #F5F5F5;
      border: 2px dashed #a56dff;
      border-radius: 10px;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 6px;
      color: #1a2b4b;
    }
    .warning {
      font-size: 13px;
      color: #d9480f;
      margin-top: 15px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify Your Account</h2>

    <p>Hello${email},</p>

    <p>
      Thank you for signing up. Please use the verification code below to
      complete your account setup.
    </p>

    <div class="otp-box">
      ${otp}
    </div>

    <p class="warning">
      This OTP is valid for <strong>${"5 mint"} minutes</strong>.
      Do not share this code with anyone.
    </p>

    <p>
      If you did not request this verification, you can safely ignore this email.
    </p>

    <div class="footer">
      © ${new Date().getFullYear()} Skill with AI<br/>
      This is an automated message, please do not reply.
    </div>
  </div>
</body>
</html>
`.trim();

    await transporter.sendMail({
      from: "15 Clips",
      to: email,
      subject: `Welcome ${email}! Your account verification code`,
      html: mailBody,
    });

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
