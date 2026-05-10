import prisma from "@/lib/prisma";
import { getChannelId } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { channelName, language, categories, source } = await req.json();

    if (
      !channelName ||
      typeof language !== "string" ||
      !Array.isArray(categories) ||
      !source
    ) {
      return NextResponse.json(
        { success: false, message: "missing or invalid fields" },
        { status: 400 },
      );
    }

    const UPPERCASE_SOURCE = source.toUpperCase();

    if (UPPERCASE_SOURCE === "YOUTUBE") {
      const { channelId, thumbnail, channel } = await getChannelId(channelName);

      if (!channelId) {
        return NextResponse.json(
          { success: false, message: "id not found" },
          { status: 404 },
        );
      }

      console.log({ channelId, thumbnail, channel });

      const create_source = await prisma.source.upsert({
        where: { channelId },
        update: {
          channelName: channel,
          language,
          source: UPPERCASE_SOURCE,
          categories,
          profileImg: thumbnail,
        },
        create: {
          channelId,
          channelName: channel,
          language,
          source: UPPERCASE_SOURCE,
          categories,
          profileImg: thumbnail,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "ok",
          data: create_source,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, message: "unsupported source" },
      { status: 400 },
    );
  } catch (error) {
    console.log("error creating source: ", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
