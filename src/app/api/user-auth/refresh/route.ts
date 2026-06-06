import { verifyRefreshToken, signAccessToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { refreshToken } = await req.json();

  try {
    const decoded: any = verifyRefreshToken(refreshToken);

    const newAccessToken = signAccessToken(decoded.userId);

    return Response.json({ accessToken: newAccessToken });
  } catch (e) {
    return Response.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
