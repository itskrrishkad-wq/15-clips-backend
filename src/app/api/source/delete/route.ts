import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "missing id" });
    }

    const delete_source = await prisma.source.delete({ where: { id } });

    if (!delete_source) {
      return NextResponse.json({
        success: false,
        message: "failed to delete source",
      });
    }

    return NextResponse.json({ success: true, message: "ok" });
  } catch (error) {
    console.log("error deleting source");
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
