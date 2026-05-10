import { Source } from "@/generated/prisma/client";

const API_KEY = process.env.YOUTUBE_DATA_API_V3!;

// type ChannelConfig = {
//   channelId: string;
//   categories: string[];
//   language: string;
//   channelName: string;
// };

// const CHANNELS: ChannelConfig[] = [
  // {
  //   channelId: "UCZFMm1mMw0F81Z37aaEzTUA",
  //   channelName: "NDTV",
  //   categories: ["Political", "Geopolitics", "Crime"],
  //   language: "en",
  // },
//   // {
//   //   channelId: "UCeARcCUiZg79SQQ-2_XNlXQ",
//   //   channelName: "CNBC-TV18",
//   //   categories: ["Finance", "Business"],
//   //   language: "en",
//   // },
//   // {
//   //   channelId: "UCt4t-jeY85JegMlZ-E5UWtA",
//   //   channelName: "Aaj Tak",
//   //   categories: ["Political", "Crime", "Viral"],
//   //   language: "hi",
//   // },
//   // {
//   //   channelId: "UC5wIf4yL_8e9pJq6l4Q7JXg",
//   //   channelName: "ABP News",
//   //   categories: ["Political", "Geopolitics", "Crime"],
//   //   language: "hi",
//   // },
//   {
//     channelId: "UC_gUM8rL-Lrg6O3adPW9K1g",
//     channelName: "Zee News",
//     categories: ["Political", "Crime", "Viral"],
//     language: "hi",
//   },
//   // {
//   //   channelId: "UCppHT7SZKKvar4Oc9J4oljQ",
//   //   channelName: "News18 India",
//   //   categories: ["Political", "Business", "Sports"],
//   //   language: "hi",
//   // },
//   {
//     channelId: "UC16niRr50-MSBwiO3YDb3RA",
//     channelName: "India Today",
//     categories: ["Political", "Geopolitics", "Business"],
//     language: "en",
//   },
//   // {
//   //   channelId: "UC6RJ7-PaXg6TIH2BzZfTV7w",
//   //   channelName: "CNN-News18",
//   //   categories: ["Geopolitics", "Business", "World"],
//   //   language: "en",
//   // },
//   // {
//   //   channelId: "UCN7B-QD0Qgn2boVH5Q0pOWg",
//   //   channelName: "WION",
//   //   categories: ["Geopolitics", "World", "Defense"],
//   //   language: "en",
//   // },
// ];

type Reel = {
  videoId: string;
  videoUrl: string;
  title: string;
  description: string;
  category: string[];
  language: string;
  duration: number;
  thumbnail: string;
  channelId: string;
  publishedAt: string;
};

export async function fetchNewsYoutube(sources: Source[]): Promise<Reel[]> {
  try {
    // 1️⃣ Get uploads playlist IDs
    const channelIds = sources.map((c) => c.channelId).join(",");

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelIds}&key=${API_KEY}`,
    ).then((res) => res.json());

    const uploadsMap: Record<string, string> = {};

    channelRes.items.forEach((item: any) => {
      uploadsMap[item.id] = item.contentDetails.relatedPlaylists.uploads;
    });

    // 2️⃣ Fetch latest videos from each channel
    // const playlistPromises = sources.map(async (channel) => {
    //   const playlistId = uploadsMap[channel.channelId];

    //   const res = await fetch(
    //     `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=1000&key=${API_KEY}`,
    //   ).then((res) => res.json());
    //   console.log({ res });
    //   return res?.items.map((item: any) => ({
    //     videoId: item.snippet.resourceId.videoId,
    //     channelId: channel.channelId,
    //     publishedAt: item.snippet.publishedAt,
    //     title: item.snippet.title,
    //     thumbnail: item.snippet.thumbnails.high?.url,
    //   }));
    // });

    const searchPromises = sources.map(async (channel) => {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.channelId}&maxResults=10000&order=date&type=video&key=${API_KEY}`,
      ).then((res) => res.json());

      return res.items.map((item: any) => ({
        videoId: item.id.videoId,
        channelId: channel.channelId,
      }));
    });

    const playlistResults = await Promise.all(searchPromises);

    const flatVideos = playlistResults.flat();

    // 3️⃣ Get full video details (batched)
    const videoIds = flatVideos.map((v) => v.videoId).join(",");

    // const videoRes = await fetch(
    //   `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`,
    // ).then((res) => res.json());

    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,player&id=${videoIds}&key=${API_KEY}`,
    ).then((res) => res.json());

    // Helper: ISO duration → seconds
    const parseDuration = (iso: string) => {
      const match = iso?.match(/PT(\d+M)?(\d+S)?/);
      const minutes = match?.[1] ? parseInt(match[1]) : 0;
      const seconds = match?.[2] ? parseInt(match[2]) : 0;
      return minutes * 60 + seconds;
    };

    console.log(videoIds);

    // 4️⃣ Filter + map
    const reels: Reel[] = videoRes.items
      .map((video: any) => {
        const meta = flatVideos.find((v) => v.videoId === video.id);
        if (!meta) return null;

        const channel = sources.find((c) => c.channelId === meta.channelId);

        if (!channel) return null;

        const duration = parseDuration(video.contentDetails.duration);
        const thumb =
          video.snippet.thumbnails.maxres ||
          video.snippet.thumbnails.standard ||
          video.snippet.thumbnails.high;

        const width = thumb?.width || 0;
        const height = thumb?.height || 0;

        // Shorts are vertical
        const isVertical = height > width;

        // 🎯 FILTER CONDITIONS
        if (duration > 60) return null;
        if (!isVertical) return null;

        console.log("video: ", video, "\n");

        return {
          videoId: video.id,
          videoUrl: `https://www.youtube.com/shorts/${video.id}`,
          title: video.snippet.title,
          description: video.snippet.description,
          category: channel.categories,
          language: video.snippet.defaultAudioLanguage || channel.language,
          duration,
          thumbnail: video.snippet.thumbnails.high.url,
          channelId: channel.channelId,
          publishedAt: video.snippet.publishedAt,
          tag: video.snippet.tags,
        };
      })
      .filter(Boolean) as Reel[];

    return reels;
  } catch (err) {
    console.error("Error fetching reels:", err);
    return [];
  }
}
