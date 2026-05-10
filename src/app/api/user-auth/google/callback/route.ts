import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/google/callback"
);

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code" }, { status: 400 });
  }

  // Exchange code for tokens
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  // Get user info
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const user = {
    email: payload?.email,
    name: payload?.name,
    picture: payload?.picture,
  };

  // TODO: Save user in DB here

  // Create JWT tokens
  const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  // 🔥 Redirect back to mobile app
  const redirectUrl = `15clips://auth?accessToken=${accessToken}&refreshToken=${refreshToken}`;

  return NextResponse.redirect(redirectUrl);
}