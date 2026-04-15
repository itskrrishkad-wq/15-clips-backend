import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  return NextResponse.json({ success: false, message: "ok" });
}
