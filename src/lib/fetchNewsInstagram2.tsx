import { Source } from "@/generated/prisma/client";

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN!;
const IG_BUSINESS_ID = process.env.INSTAGRAM_BUSINESS_ID!;

// --- Tunables -------------------------------------------------------------
const MAX_CONCURRENCY = 5; // parallel requests in flight at once
const MAX_RETRIES = 3; // retries per source on transient failure
const BASE_BACKOFF_MS = 800; // exponential backoff base
const REQUEST_TIMEOUT_MS = 10_000; // abort a hung request
const GRAPH_VERSION = "v23.0";

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

type RawMedia = {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
};

// Graph API error codes that are worth retrying (transient / throttling).
// 4, 17, 32, 613 = various flavors of rate limiting.
// 1, 2 = transient server errors. 5xx handled separately via res.status.
const RETRYABLE_ERROR_CODES = new Set([1, 2, 4, 17, 32, 613]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractUsername(channelName: string | null): string | null {
  if (!channelName) return null;
  const handle = channelName.includes("@")
    ? channelName.split("@")[1]
    : channelName;
  return handle?.trim() || null;
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetches reels for a single username via Business Discovery, with
 * retry + exponential backoff for transient/rate-limit errors.
 * Returns [] (never throws) so one bad source can't sink Promise.all.
 */
async function fetchInstagramReels(
  username: string,
): Promise<{ media: RawMedia[]; ok: boolean }> {
  const fields =
    `business_discovery.username(${username})` +
    `{media.limit(25)` +
    `{id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count}}`;

  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${IG_BUSINESS_ID}` +
    `?fields=${encodeURIComponent(fields)}` +
    `&access_token=${TOKEN}`;

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);

      if (res.ok) {
        const data = await res.json();
        return { media: data?.business_discovery?.media?.data ?? [], ok: true };
      }

      // Try to read Graph API's structured error body.
      let errorCode: number | undefined;
      let errorMessage = res.statusText;
      try {
        const body = await res.json();
        errorCode = body?.error?.code;
        errorMessage = body?.error?.message ?? errorMessage;
      } catch {
        // body wasn't JSON, ignore
      }

      const isServerError = res.status >= 500;
      const isRetryable =
        isServerError ||
        res.status === 429 ||
        (errorCode !== undefined && RETRYABLE_ERROR_CODES.has(errorCode));

      // Non-retryable (bad username, permissions, invalid token, etc.) -> bail immediately.
      if (!isRetryable) {
        console.error(`[instagram] permanent error for ${username}`, {
          status: res.status,
          errorCode,
          errorMessage,
        });
        return { media: [], ok: false };
      }

      lastError = { status: res.status, errorCode, errorMessage };
      console.warn(
        `[instagram] transient error for ${username} (attempt ${attempt + 1}/${MAX_RETRIES + 1})`,
        lastError,
      );
    } catch (err) {
      // Network error, timeout/abort, etc. — treat as retryable.
      lastError = err;
      console.warn(
        `[instagram] network error for ${username} (attempt ${attempt + 1}/${MAX_RETRIES + 1})`,
        err instanceof Error ? err.message : err,
      );
    }

    if (attempt < MAX_RETRIES) {
      const backoff =
        BASE_BACKOFF_MS * 2 ** attempt + Math.floor(Math.random() * 250); // jitter
      await sleep(backoff);
    }
  }

  console.error(
    `[instagram] giving up on ${username} after ${MAX_RETRIES + 1} attempts`,
    lastError,
  );
  return { media: [], ok: false };
}

/**
 * Simple concurrency-limited map so 10-30 sources don't all fire at once
 * (bursty parallel requests are what typically trips rate limits/timeouts).
 */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current]);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

export async function fetchNewsInstagram(
  sources: Source[],
): Promise<FetchInstagramReel[]> {
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

  const validSources = sources
    .map((source) => ({ source, username: extractUsername(source.channelName) }))
    .filter((entry): entry is { source: Source; username: string } => {
      if (!entry.username) {
        console.warn(
          `[instagram] skipping source with invalid channelName`,
          entry.source.channelName,
        );
        return false;
      }
      return true;
    });

  const perSourceResults = await mapWithConcurrency(
    validSources,
    MAX_CONCURRENCY,
    async ({ source, username }) => {
      const { media, ok } = await fetchInstagramReels(username);
      if (!ok) {
        // Logged already inside fetchInstagramReels; keep going with empty result.
        return [];
      }
      return media
        .filter((item) => item.media_type === "VIDEO")
        .filter((item) => new Date(item.timestamp).getTime() >= twentyFourHoursAgo)
        .map(
          (item): FetchInstagramReel => ({
            id: item.id,
            mediaUrl: item.media_url,
            thumbnail: item.thumbnail_url ?? item.media_url,
            permalink: item.permalink,
            caption: item.caption ?? "",
            category: source.categories,
            language: source.language,
            publishedAt: item.timestamp,
            username: source.channelName.split("@")[1]!,
            like_count: item.like_count ?? 0,
          }),
        );
    },
  );

  const reels = perSourceResults.flat();

  console.log(
    `[instagram] fetched ${reels.length} reels from ${validSources.length}/${sources.length} sources`,
  );

  return reels.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}