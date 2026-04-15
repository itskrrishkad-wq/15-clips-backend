import requests
from datetime import datetime, timedelta

ACCESS_TOKEN = "YOUR_LONG_LIVED_TOKEN"
IG_USER_ID = "YOUR_INSTAGRAM_USER_ID"


def get_reels(limit=10, days=7):
    """
    Fetch reels from your Instagram account
    """

    url = f"https://graph.facebook.com/v19.0/{IG_USER_ID}/media"

    params = {
        "fields": "id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count",
        "access_token": ACCESS_TOKEN,
        "limit": limit
    }

    res = requests.get(url, params=params).json()

    cutoff_date = datetime.utcnow() - timedelta(days=days)

    reels = []

    for item in res.get("data", []):
        # Filter only REELS
        if item["media_type"] != "VIDEO":
            continue

        published_time = datetime.fromisoformat(item["timestamp"].replace("Z", ""))

        if published_time < cutoff_date:
            continue

        reels.append({
            "id": item["id"],
            "caption": item.get("caption"),
            "media_url": item["media_url"],
            "permalink": item["permalink"],
            "timestamp": item["timestamp"],
            "likes": item.get("like_count", 0),
            "comments": item.get("comments_count", 0)
        })

    return reels


# 🚀 Example usage
if __name__ == "__main__":
    reels = get_reels(limit=20, days=5)

    for r in reels:
        print(r)