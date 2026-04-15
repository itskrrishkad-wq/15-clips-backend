import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "id missing" });
    }

    const delete_a = await prisma.adminUser.delete({ where: { id } });

    if (!delete_a) {
      return NextResponse.json({
        success: false,
        message: "failed to delete admin user",
      });
    }

    return NextResponse.json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    console.log("error while deleting admin user: ", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error ",
    });
  }
}
