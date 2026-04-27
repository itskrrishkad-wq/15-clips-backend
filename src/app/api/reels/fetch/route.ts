import { commonInterests } from "@/data/intrests";
import { searchShorts } from "@/lib/fetch_shorts";
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
    const results: Record<string, any[]> = {};
    const globalSeen = new Set<string>();

    for (const lang of indianLanguages) {
      for (const interest of commonInterests.slice(0, 2)) {
        const key = `${lang}_${interest}`;
        const queries = generateQueries(lang, interest);

        const collected: any[] = [];

        for (const query of queries) {
          if (collected.length >= 5) break;

          const shorts = await searchShorts({
            query,
            maxResults: 4,
            publishedAfterDays: 5,
          });

          const update_shorts = shorts.map((short) => ({
            ...short,
            languages: [lang],
            interests: [interest],
          }));

          const filtered = update_shorts
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
