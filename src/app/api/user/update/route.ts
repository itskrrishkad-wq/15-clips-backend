import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyAccessToken } from "@/lib/auth";

export interface CustomJWTPayload extends JwtPayload {
  id: string;
}

export async function PUT(req: NextRequest) {
  try {
    const {
      name,
      lname,
      gender,
      location,
      languages,
      dob,
      profession,
      dailyTimeSpent,
      email,
      interests,
    } = await req.json();
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        {
          success: false,
          message: "No authorization header",
        },
        { status: 401 },
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    console.log({ accessToken });

    if (!accessToken) {
      return NextResponse.json({
        success: false,
        message: "missing important fields",
      });
    }

    const decoded = verifyAccessToken(accessToken);

    console.log({ decoded });

    if (!decoded.id) {
      return NextResponse.json({ success: false, message: "token expired" });
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
      accessToken,
    });

    const user = await prisma.user.findFirst({ where: { id: decoded.id } });

    if (!user) {
      return NextResponse.json({ success: false, message: "user not found" });
    }
    if (
      !profession ||
      interests.length <= 0 ||
      !name ||
      !lname ||
      !location ||
      !gender ||
      !accessToken
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
        dailyTimeSpent: dailyTimeSpent
          ? parseInt(dailyTimeSpent)
          : user.dailyTimeSpent,
        dob: dob ? new Date(dob) : user.dob,
        languages: languages ? [languages] : user.languages,
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
     if (error instanceof jwt.TokenExpiredError) {
      return Response.json(
        {
          success: false,
          code: "TOKEN_EXPIRED",
          message: "Access token expired",
        },
        { status: 401 }
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return Response.json(
        {
          success: false,
          code: "INVALID_TOKEN",
          message: "Invalid token",
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
