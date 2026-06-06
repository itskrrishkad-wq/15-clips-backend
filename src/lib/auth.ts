// lib/auth.ts
import { CustomJWTPayload } from "@/app/api/user/update/route";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const signAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as CustomJWTPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as CustomJWTPayload;
};
