#!/usr/bin/env python3
"""
YouTube Shorts Uploader
Usage: python3 youtube-upload.py <video.mp4> --title "..." --description "..." --tags "tag1,tag2"
"""

import argparse
import os
import sys
import pickle
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CREDENTIALS_DIR = Path(__file__).parent.parent / "credentials"
CLIENT_SECRET = CREDENTIALS_DIR / "google-client_secret.json"
TOKEN_FILE = CREDENTIALS_DIR / "youtube_token.pickle"
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]


def get_authenticated_service():
    credentials = None

    if TOKEN_FILE.exists():
        with open(TOKEN_FILE, "rb") as f:
            credentials = pickle.load(f)

    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET), SCOPES)
            credentials = flow.run_local_server(port=8090, open_browser=True)

        with open(TOKEN_FILE, "wb") as f:
            pickle.dump(credentials, f)

    return build("youtube", "v3", credentials=credentials)


def upload_video(youtube, video_path, title, description, tags, privacy="public"):
    body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags,
            "categoryId": "28",  # Science & Technology
        },
        "status": {
            "privacyStatus": privacy,
            "selfDeclaredMadeForKids": False,
        },
    }

    media = MediaFileUpload(video_path, mimetype="video/mp4", resumable=True, chunksize=1024 * 1024)

    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    print(f"📤 Uploading: {video_path}")
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"   ⏳ {int(status.progress() * 100)}%")

    video_id = response["id"]
    print(f"✅ Uploaded! https://youtube.com/shorts/{video_id}")
    return video_id


def main():
    parser = argparse.ArgumentParser(description="Upload YouTube Shorts")
    parser.add_argument("video", help="Path to video file")
    parser.add_argument("--title", required=True, help="Video title")
    parser.add_argument("--description", default="", help="Video description")
    parser.add_argument("--tags", default="", help="Comma-separated tags")
    parser.add_argument("--privacy", default="public", choices=["public", "unlisted", "private"])
    args = parser.parse_args()

    if not Path(args.video).exists():
        print(f"❌ File not found: {args.video}")
        sys.exit(1)

    youtube = get_authenticated_service()
    tags = [t.strip() for t in args.tags.split(",") if t.strip()]
    upload_video(youtube, args.video, args.title, args.description, tags, args.privacy)


if __name__ == "__main__":
    main()
