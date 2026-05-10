import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const uid = req.nextUrl.searchParams.get("uid");

    if (!id || !uid) {
      return NextResponse.json({ success: false, message: "missing params" });
    }

    const is_click = await prisma.adEvent.findFirst({
      where: { eventType: "CLICK", adId: id, userId: uid },
    });

    if(is_click) {
        return NextResponse.json({success: false, message: "click already exists"})
    }


    
  } catch (error) {
    console.log("error while ad click: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
