import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, language, categories } = body;

    // validate required fields
    if (!id || typeof language !== "string" || !Array.isArray(categories)) {
      return NextResponse.json(
        {
          success: false,
          message: "invalid or missing fields",
        },
        { status: 400 },
      );
    }

    // check if source exists
    const existing = await prisma.source.findUnique({
      where: { id }, // ensure id type matches your schema
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "source not found",
        },
        { status: 404 },
      );
    }

    // update
    const updatedSource = await prisma.source.update({
      where: { id },
      data: {
        language,
        categories,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "updated successfully",
        data: updatedSource,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("error updating source: ", error);

    return NextResponse.json(
      {
        success: false,
        message: "internal server error",
      },
      { status: 500 },
    );
  }
}
