import { verifyAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
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

    if (!accessToken || !id) {
      return NextResponse.json({
        success: false,
        message: "missing important fields",
      });
    }

    const decoded = verifyAccessToken(accessToken);

    console.log({ decoded });

    const ads = await prisma.ad.findMany({ where: { status: "ACTIVE" } });

    if (!ads || ads.length <= 0) {
      return NextResponse.json({
        success: false,
        message: "no active ads",
        data: [],
      });
    }

    return NextResponse.json({ success: true, message: "ok", data: ads });
  } catch (error) {
    console.log("error while getting ads: ", error);
    if (error instanceof jwt.TokenExpiredError) {
      return Response.json(
        {
          success: false,
          code: "TOKEN_EXPIRED",
          message: "Access token expired",
        },
        { status: 401 },
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return Response.json(
        {
          success: false,
          code: "INVALID_TOKEN",
          message: "Invalid token",
        },
        { status: 401 },
      );
    }
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
