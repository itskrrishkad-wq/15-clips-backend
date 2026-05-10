import { Source } from "@/generated/prisma/client";

const API_KEY = process.env.YOUTUBE_DATA_API_V3!;

export type FetchReel = {
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
    tag?: string[];
};

// ISO duration -> seconds
const parseDuration = (iso: string): number => {
    const match = iso.match(
        /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );

    return (
        parseInt(match?.[1] || "0") * 3600 +
        parseInt(match?.[2] || "0") * 60 +
        parseInt(match?.[3] || "0")
    );
};

async function fetchShortIds(channelId: string) {
    try {
        const html = await fetch(
            `https://www.youtube.com/channel/${channelId}/shorts`
        ).then((res) => res.text());

        // extract videoIds
        const matches = [
            ...html.matchAll(/"videoId":"(.*?)"/g),
        ];

        const ids = [
            ...new Set(matches.map((m) => m[1])),
        ];

        return ids;
    } catch (err) {
        console.error(
            `Failed fetching shorts for ${channelId}`,
            err
        );

        return [];
    }
}

export async function fetchNewsYoutube(
    sources: Source[],
): Promise<FetchReel[]> {
    try {
        // 1️⃣ Fetch shorts IDs
        const shortsPromises = sources.slice(0, 1).map(async (channel) => {
            const ids = await fetchShortIds(
                channel.channelId
            );

            return ids.map((videoId) => ({
                videoId,
                channelId: channel.channelId,
            }));
        });

        const shortsResults = await Promise.all(
            shortsPromises
        );

        const flatVideos = shortsResults.flat();

        if (!flatVideos.length) {
            return [];
        }

        // 2️⃣ Unique IDs
        const uniqueVideoIds = [
            ...new Set(
                flatVideos.map((v) => v.videoId)
            ),
        ];

        const ids = uniqueVideoIds
            .filter(Boolean)
            .map((id) => id.trim())
            .join(",")

        console.log(ids);
        // 3️⃣ Fetch metadata
        const videoRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${ids}&key=${API_KEY}`
        ).then((res) => res.json());

        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

        if (!videoRes) {
            return []
        }

        // 4️⃣ Build reels
        const reels: FetchReel[] = videoRes.items
            .map((video: any) => {
                const meta = flatVideos.find(
                    (v) => v.videoId === video.id
                );

                if (!meta) return null;

                const channel = sources.find(
                    (c) =>
                        c.channelId === meta.channelId
                );

                if (!channel) return null;

                const duration = parseDuration(
                    video.contentDetails.duration
                );

                // optional safety
                if (duration > 180) return null;

                // only last 24 hrs
                const publishedAt = video.snippet.publishedAt;

                if (
                    !publishedAt ||
                    new Date(publishedAt).getTime() <
                    twentyFourHoursAgo
                ) {
                    return null;
                }

                const thumbnail =
                    video.snippet.thumbnails.maxres?.url ||
                    video.snippet.thumbnails.standard
                        ?.url ||
                    video.snippet.thumbnails.high
                        ?.url ||
                    video.snippet.thumbnails.medium
                        ?.url ||
                    video.snippet.thumbnails.default
                        ?.url ||
                    "";



                return {
                    videoId: video.id,
                    videoUrl: `https://www.youtube.com/shorts/${video.id}`,
                    title: video.snippet.title,
                    description:
                        video.snippet.description,
                    category: channel.categories,
                    language:
                        video.snippet
                            .defaultAudioLanguage ||
                        channel.language,
                    duration,
                    thumbnail,
                    channelId: channel.channelId,
                    publishedAt:
                        video.snippet.publishedAt,
                    tag:
                        video.snippet.tags || [],
                };
            })
            .filter(Boolean) as FetchReel[];

        // 5️⃣ Latest first
        reels.sort(
            (a, b) =>
                new Date(
                    b.publishedAt
                ).getTime() -
                new Date(
                    a.publishedAt
                ).getTime(),
        );

        return reels;
    } catch (err) {
        console.error(
            "Error fetching YouTube shorts:",
            err,
        );

        return [];
    }
}