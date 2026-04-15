import axios from "axios";

const API_KEY = process.env.YOUTUBE_DATA_API_V3;

type ShortVideo = {
  video_id: string;
  title: string;
  channel: string;
  published_at: string;
  views: number;
  likes: number;
  url: string;
};

// Convert ISO 8601 duration → seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = match?.[1] ? parseInt(match[1]) : 0;
  const minutes = match?.[2] ? parseInt(match[2]) : 0;
  const seconds = match?.[3] ? parseInt(match[3]) : 0;

  return hours * 3600 + minutes * 60 + seconds;
}

function isShort(duration: string): boolean {
  return parseDuration(duration) <= 60;
}

export async function searchShorts({
  query,
  maxResults = 20,
  minResults = 15,
  publishedAfterDays = 7,
  channelId,
}: {
  query: string;
  maxResults?: number;
  minResults?: number;
  publishedAfterDays?: number;
  channelId?: string;
}): Promise<ShortVideo[]> {
  const publishedAfter = new Date(
    Date.now() - publishedAfterDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  let nextPageToken: string | undefined = undefined;
  const shorts: ShortVideo[] = [];

  while (shorts.length < minResults) {
    const searchRes: any = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: API_KEY,
          q: query,
          part: "snippet",
          type: "video",
          maxResults,
          order: "date",
          publishedAfter,
          channelId,
          pageToken: nextPageToken,
        },
      },
    );

    const items = searchRes.data.items;
    if (!items.length) break;

    const videoIds = items.map((item: any) => item.id.videoId);

    const videosRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: API_KEY,
          part: "contentDetails,snippet,statistics",
          id: videoIds.join(","),
        },
      },
    );

    for (const video of videosRes.data.items) {
      const duration = video.contentDetails.duration;

      if (!isShort(duration)) continue;

      shorts.push({
        video_id: video.id,
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        published_at: video.snippet.publishedAt,
        views: parseInt(video.statistics?.viewCount || "0"),
        likes: parseInt(video.statistics?.likeCount || "0"),
        url: `https://www.youtube.com/shorts/${video.id}`,
      });

      // Stop early if we reached minResults
      if (shorts.length >= minResults) break;
    }

    nextPageToken = searchRes.data.nextPageToken;

    // No more pages available
    if (!nextPageToken) break;
  }

  return shorts;
}
