type Reel = {
  id: string;
  caption?: string;
  likes: number;
  comments: number;
  media_url: string;
  permalink: string;
  posted_at: string;
};

const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";
const IG_USER_ID = "YOUR_IG_USER_ID";

export async function fetchReels(limit = 20, days = 7): Promise<Reel[]> {
  const url = `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`;

  const params = new URLSearchParams({
    fields:
      "id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count",
    access_token: ACCESS_TOKEN,
    limit: limit.toString(),
  });

  const res = await fetch(`${url}?${params.toString()}`);
  const data = await res.json();

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const reels: Reel[] = [];

  for (const item of data.data || []) {
    // Only reels (videos)
    if (item.media_type !== "VIDEO") continue;

    // Filter by date
    const postedTime = new Date(item.timestamp);
    if (postedTime < cutoff) continue;

    reels.push({
      id: item.id,
      caption: item.caption,
      likes: item.like_count ?? 0,
      comments: item.comments_count ?? 0,
      media_url: item.media_url,
      permalink: item.permalink,
      posted_at: item.timestamp,
    });
  }

  return reels;
}