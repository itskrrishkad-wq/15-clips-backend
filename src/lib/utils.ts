import { JWTPayloadCustom } from "@/app/api/ads/create/route";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtVerify } from "jose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function decodeCustomJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayloadCustom;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

export function generateOTP(): string {
  // ensures 6 digits, including leading zeros
  return Math.floor(100000 + Math.random() * 900000).toString();
}
