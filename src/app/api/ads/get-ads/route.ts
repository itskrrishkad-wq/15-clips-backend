import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, id } = await req.json();

    if (!accessToken || !id) {
      return NextResponse.json({
        success: false,
        message: "missing important fields",
      });
    }

    const ads = await prisma.ad.findMany({ where: { status: "ACTIVE" } });

    if (!ads || ads.length <= 0) {
      return NextResponse.json({
        success: false,
        message: "no active ads",
        data: [],
      });
    }

    console.log({ ads });
    return NextResponse.json({ success: true, message: "ok", data: ads });
  } catch (error) {
    console.log("error while getting ads: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
