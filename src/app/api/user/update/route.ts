import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJWTPayload extends JwtPayload {
  id: string;
}

export async function PUT(req: NextRequest) {
  try {
    const {
      profession,
      interests,
      preference,
      languages,
      firstName,
      lastName,
      phone,
      dob,
      location,
      gender,
      dailyTime,
      accessToken,
    } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "missing token" },
        { status: 400 },
      );
    }

    const token_data = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY as string,
    ) as CustomJWTPayload;

    if (!token_data.id) {
      return NextResponse.json({ success: false, message: "token expired" });
    }

    console.log({
      profession,
      interests,
      preference,
      languages,
      firstName,
      lastName,
      phone,
      dob,
      location,
      gender,
      dailyTime,
      accessToken,
    });

    const user = await prisma.user.findFirst({ where: { id: token_data.id } });

    if (!user) {
      return NextResponse.json({ success: false, message: "user not found" });
    }
    if (
      !profession ||
      interests.length <= 0 ||
      languages.length <= 0 ||
      !preference ||
      !firstName ||
      !lastName ||
      !phone ||
      !dob ||
      !location ||
      !gender ||
      !dailyTime
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
        languages: [languages],
        interests,
        name: firstName,
        lname: lastName,
        phoneNo: phone,
        dob: new Date(dob),
        location,
        gender,
        dailyTimeSpent: parseInt(dailyTime),
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
    console.log("error while updating user: ", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
