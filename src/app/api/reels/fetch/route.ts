import { commonInterests } from "@/data/intrests";
import { NextRequest, NextResponse } from "next/server";

export const indianLanguages: string[] = ["English", "Marathi"];

function getViralScore(short: any) {
  const views = short.views || 0;
  const likes = short.likes || 0;
  const likeRatio = views > 0 ? likes / views : 0;

  return views * 0.7 + likeRatio * 0.3 * 100000;
}

function isRelevant(title: string, interest: string) {
  return title?.toLowerCase().includes(interest.toLowerCase());
}

// 🔥 fallback query generator
function generateQueries(lang: string, interest: string) {
  return [`${lang} ${interest} news`];
}

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: "success",
    });
  } catch (error) {
    console.log("error while fetching reels/shorts", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
