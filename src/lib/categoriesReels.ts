import { CATEGORY_KEYWORDS } from "@/data/intrests";
import { FetchReel } from "./fetchNewsYoutube2";

const STOP_WORDS = [
  "breaking news",
  "latest news",
  "zee news",
  "india news",
  "subscribe",
  "follow us",
  "watch live",
  "facebook",
  "instagram",
  "telegram",
  "whatsapp",
  "channel",
  "news channel",
  "top news",
  "live tv",
  "download our mobile app",
];

function cleanText(text: string) {
  let cleaned = text.toLowerCase();

  // remove stop words
  for (const stopWord of STOP_WORDS) {
    cleaned = cleaned.replaceAll(stopWord, "");
  }

  return cleaned
    .replace(/[^\w\s#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w]+/g);

  if (!matches) return [];

  return matches.map((tag) => tag.replace("#", "").toLowerCase());
}

function countKeywordMatches(text: string, keywords: string[]) {
  let score = 0;

  for (const keyword of keywords) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // exact word boundary match
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");

    const matches = text.match(regex);

    if (matches) {
      score += matches.length;
    }
  }

  return score;
}

export function categorizeReels(reels: any[]) {
  return reels.map((reel) => {
    const title = cleanText(reel.title || "");

    const description = cleanText(
      (reel.description || "").slice(0, 500), // IMPORTANT
    );

    const tags = cleanText(Array.isArray(reel.tag) ? reel.tag.join(" ") : "");

    const hashtags = extractHashtags(reel.description || "");

    const hashtagText = hashtags.join(" ");

    const scores: Record<string, number> = {};

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      let score = 0;

      // TITLE gets highest priority
      score += countKeywordMatches(title, keywords) * 5;

      // HASHTAGS strong priority
      score += countKeywordMatches(hashtagText, keywords) * 4;

      // TAGS medium priority
      score += countKeywordMatches(tags, keywords) * 3;

      // DESCRIPTION lowest priority
      score += countKeywordMatches(description, keywords);

      if (score >= 5) {
        scores[category] = score;
      }
    }

    const categories = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);

    return {
      ...reel,
      categories,
      categoryScores: scores,
      hashtags,
    };
  });
}
