import { searchShorts } from "@/lib/fetch_shorts";
import { NextRequest, NextResponse } from "next/server";

const commonInterests: string[] = [
  // "Technology",
  // "Business",
  "Health",
  // "Finance",
  // "Music",
  // "Sports",
  // "Travel",
  // "Food",
  "Movies",
];

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
  return [
    `${lang} ${interest} news`,
    `${lang} ${interest}`,
    `${interest} news India`,
    `${interest} trending India`,
    `${interest} latest`,
  ];
}

export async function GET(req: NextRequest) {
  try {
    const results: Record<string, any[]> = {};
    const globalSeen = new Set<string>();

    for (const lang of indianLanguages) {
      for (const interest of commonInterests) {
        const key = `${lang}_${interest}`;
        const queries = generateQueries(lang, interest);

        const collected: any[] = [];

        for (const query of queries) {
          if (collected.length >= 5) break;

          const shorts = await searchShorts({
            query,
            maxResults: 25,
            publishedAfterDays: 5,
          });

          const filtered = shorts
            .filter((s: any) => isRelevant(s.title, interest))
            .map((s: any) => ({
              ...s,
              score: getViralScore(s),
            }))
            .sort((a: any, b: any) => b.score - a.score);

          for (const item of filtered) {
            const uniqueId =
              item.id || item.url || item.title?.toLowerCase().trim();

            if (!globalSeen.has(uniqueId)) {
              globalSeen.add(uniqueId);
              collected.push(item);
            }

            if (collected.length >= 5) break;
          }
        }

        results[key] = collected;
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.log("error while fetching reels/shorts", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
