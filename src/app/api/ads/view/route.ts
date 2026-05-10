import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, uid } = await req.json();

    if (!id || !uid) {
      console.log({ id, uid });
      return NextResponse.json({ success: false, message: "missing id's" });
    }

    const user = await prisma.user.findFirst({ where: { id: uid } });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "no user found",
      });
    }

    const ad_view_exists = await prisma.adEvent.findFirst({
      where: { adId: id, userId: uid },
    });

    if (ad_view_exists) {
      return NextResponse.json({
        success: false,
        message: "ad view exists",
      });
    }

    const ads_view = await prisma.adEvent.create({
      data: {
        eventType: "VIEW",
        adId: id,
        userId: uid,
        gender: user.gender,
        location: user.location,
        profession: user.profession,
        interests: user.interests,
        languages: user.languages,
      },
    });

    if (!ads_view) {
      return NextResponse.json({
        success: false,
        message: "failed to create reel view",
      });
    }

    await prisma.ad.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, message: "ok" });
  } catch (error) {
    console.log("failed to create reel view: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
