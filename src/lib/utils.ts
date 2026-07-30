import { JWTPayloadCustom } from "@/app/api/ads/create/route";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtVerify } from "jose";

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN!;
const IG_BUSINESS_ID = process.env.INSTAGRAM_BUSINESS_ID!;

const API_KEY = process.env.YOUTUBE_DATA_API_V3!;

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

export async function getChannelId(
  handle: string,
): Promise<{ channelId: string; thumbnail: string; channel: string }> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id,snippet&forHandle=${handle}&key=${API_KEY}`,
  ).then((r) => r.json());

  return {
    channelId: res.items?.[0]?.id,
    thumbnail: res.items?.[0]?.snippet?.thumbnails?.default?.url,
    channel: res.items?.[0]?.snippet?.customUrl,
  };
}

export async function getIgAccont(
  username: string,
): Promise<{ channelId: string; thumbnail: string; channel: string }> {
  try {
    const fields =
      `business_discovery.username(${username})` +
      `{id,username,name,profile_picture_url}`;

    const url =
      `https://graph.facebook.com/v23.0/${IG_BUSINESS_ID}` +
      `?fields=${encodeURIComponent(fields)}` +
      `&access_token=${TOKEN}`;

    const res = await fetch(url);

    console.log({ res });

    if (!res.ok) {
      console.error(`Failed to fetch ${username}`);

      return { channel: "", channelId: "", thumbnail: "" };
    }

    const data = await res.json();

    return {
      channelId: data.business_discovery?.id,
      thumbnail: data.business_discovery?.profile_picture_url,
      channel: data.business_discovery?.username,
    };
  } catch (error) {
    console.log(`error sourcing ig: `, username, " : ", error);
    return { channel: "", channelId: "", thumbnail: "" };
  }
}
