import { verifyAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const uid = req.nextUrl.searchParams.get("uid");
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

    if (!id || !uid) {
      return NextResponse.json({ success: false, message: "missing params" });
    }

    const is_click = await prisma.adEvent.findFirst({
      where: { eventType: "CLICK", adId: id, userId: uid },
    });

    if (is_click) {
      return NextResponse.json({
        success: false,
        message: "click already exists",
      });
    }
  } catch (error) {
    console.log("error while ad click: ", error);
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
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
