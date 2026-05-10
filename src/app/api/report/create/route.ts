import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { uid, rid, note, reason } = await req.json();

    if (!uid || !rid || !note || !reason) {
      return NextResponse.json(
        { success: false, message: "missing fields " },
        { status: 400 },
      );
    }

    const report = await prisma.report.create({
      data: { userId: uid, reelId: rid, note, reason },
    });

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "failed to create report",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, message: "report issued" });
  } catch (error) {
    console.log("error while reporting reel: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
