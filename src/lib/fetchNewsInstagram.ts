import { Source } from "@/generated/prisma/client";

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN!;
const IG_BUSINESS_ID = process.env.INSTAGRAM_BUSINESS_ID!;

export type FetchInstagramReel = {
  id: string;
  mediaUrl: string;
  thumbnail: string;
  permalink: string;
  caption: string;
  category: string[];
  language: string;
  publishedAt: string;
  username: string;
  like_count: number;
};

async function fetchInstagramReels(username: string) {
  try {
    const fields =
      `business_discovery.username(${username})` +
      `{media.limit(10)` +
      `{id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count}}`;

    const url =
      `https://graph.facebook.com/v23.0/${IG_BUSINESS_ID}` +
      `?fields=${encodeURIComponent(fields)}` +
      `&access_token=${TOKEN}`;

    const res = await fetch(url);

    if (!res.ok) {
      const body = await res.text();
      console.error(`Failed to fetch ${username}`, {
        status: res.status,
        statusText: res.statusText,
        body,
      });

      return [];
    }

    const data = await res.json();

    console.log({ data });

    return data.business_discovery?.media?.data ?? [];
  } catch (error) {
    console.error(`Unexpected error while fetching ${username}:`, error);
    return [];
  }
}

export async function fetchNewsInstagram(
  sources: Source[],
): Promise<FetchInstagramReel[]> {
  try {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    console.log({ sources });
    const reels = await Promise.all(
      sources.map(async (source) => {
        if (!source.channelName) return [];

        const media = await fetchInstagramReels(
          source.channelName.split("@")[1],
        );

        return media
          .filter((item: any) => item.media_type === "VIDEO")
          .filter((item: any) => {
            return new Date(item.timestamp).getTime() >= twentyFourHoursAgo;
          })
          .map(
            (item: any): FetchInstagramReel => ({
              id: item.id,
              mediaUrl: item.media_url,
              thumbnail: item.thumbnail_url ?? item.media_url,
              permalink: item.permalink,
              caption: item.caption ?? "",
              category: source.categories,
              language: source.language,
              publishedAt: item.timestamp,
              username: source.channelName,
              like_count: item.like_count,
            }),
          );
      }),
    );

    console.log({ reels });

    return reels
      .flat()
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
  } catch (err) {
    console.error("Error fetching Instagram reels:", err);

    return [];
  }
}
