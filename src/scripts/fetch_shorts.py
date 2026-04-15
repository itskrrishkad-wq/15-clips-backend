from googleapiclient.discovery import build
from datetime import datetime, timedelta
import isodate
from dateutil import parser

API_KEY = "YOUR_YOUTUBE_API_KEY"

youtube = build("youtube", "v3", developerKey=API_KEY)


def is_short(duration):
    """Check if video is a Short (<= 60 sec)"""
    seconds = isodate.parse_duration(duration).total_seconds()
    return seconds <= 60


def search_shorts(
    query,
    max_results=20,
    published_after_days=7,
    channel_id=None
):
    """
    Fetch Shorts using keyword and filters
    """

    published_after = (
        datetime.utcnow() - timedelta(days=published_after_days)
    ).isoformat("T") + "Z"

    search_response = youtube.search().list(
        q=query,
        part="snippet",
        type="video",
        maxResults=max_results,
        order="date",
        publishedAfter=published_after,
        channelId=channel_id
    ).execute()

    video_ids = [item["id"]["videoId"] for item in search_response["items"]]

    # Fetch video details (duration, stats)
    videos_response = youtube.videos().list(
        part="contentDetails,snippet,statistics",
        id=",".join(video_ids)
    ).execute()

    shorts = []

    for video in videos_response["items"]:
        duration = video["contentDetails"]["duration"]

        if not is_short(duration):
            continue

        shorts.append({
            "video_id": video["id"],
            "title": video["snippet"]["title"],
            "channel": video["snippet"]["channelTitle"],
            "published_at": video["snippet"]["publishedAt"],
            "views": int(video["statistics"].get("viewCount", 0)),
            "likes": int(video["statistics"].get("likeCount", 0)),
            "url": f"https://www.youtube.com/shorts/{video['id']}"
        })

    return shorts


# 🚀 Example usage
if __name__ == "__main__":
    results = search_shorts(
        query="fitness motivation",
        max_results=30,
        published_after_days=3,
        channel_id=None  # optional
    )

    for r in results:
        print(r)