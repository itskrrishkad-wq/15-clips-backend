import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "logout successful",
    });

    // ❌ delete both possible cookies
    response.cookies.set("15clips-authentication", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set("15clips-guest-token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.log("error while logging out:", error);

    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
