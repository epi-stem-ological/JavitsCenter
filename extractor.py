"""Fetch YouTube metadata and an English transcript.

Requires both libraries in the *same* environment that runs this file:

    pip install yt-dlp youtube-transcript-api

Note that `uv tool install yt-dlp` / `pipx install yt-dlp` are not enough — those
install the command-line executable into an isolated virtualenv, so `import
yt_dlp` still fails. This module uses yt-dlp as a library.

Usage:

    from extractor import extract_video

    video = extract_video("https://youtu.be/dQw4w9WgXcQ")
    if video.transcript:
        print(video.title, video.author)
        print(video.transcript)
    else:
        print("no transcript:", video.transcript_error)

Or from the shell:

    python extractor.py "https://youtu.be/dQw4w9WgXcQ"
"""

from __future__ import annotations

import re
import sys
import urllib.parse
from dataclasses import dataclass

__all__ = ["VideoData", "extract_video", "parse_video_id"]

DEFAULT_LANGUAGES = ("en", "en-US", "en-GB")
VIDEO_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
YOUTUBE_HOSTS = {
    "youtube.com",
    "youtu.be",
    "youtube-nocookie.com",
    "music.youtube.com",
}


class InvalidYouTubeURL(ValueError):
    """The string given was not a YouTube URL or video id."""


@dataclass
class VideoData:
    """Result of one extraction.

    Metadata and transcript fail independently: a video with captions turned
    off still returns its title, author, and description, with the reason in
    `transcript_error`. Callers should check the fields they need rather than
    assuming the whole object succeeded.
    """

    url: str
    video_id: str
    title: str | None = None
    author: str | None = None
    description: str | None = None
    duration_seconds: int | None = None
    transcript: str | None = None
    transcript_language: str | None = None
    metadata_error: str | None = None
    transcript_error: str | None = None

    @property
    def ok(self) -> bool:
        """True only when both metadata and transcript came back."""
        return self.metadata_error is None and self.transcript is not None


# ---------------------------------------------------------------------------
# URL handling
# ---------------------------------------------------------------------------

def parse_video_id(url: str) -> str:
    """Extract the 11-character video id from any common YouTube URL shape.

    Handles watch?v=, youtu.be/, /shorts/, /live/, /embed/, and tolerates
    tracking parameters such as ?si= and ?fbclid=.

    Raises InvalidYouTubeURL if no video id can be found.
    """
    raw = (url or "").strip().strip("<>")
    if not raw:
        raise InvalidYouTubeURL("empty URL")
    if VIDEO_ID_RE.match(raw):
        return raw

    if "://" not in raw:
        raw = "https://" + raw
    try:
        parsed = urllib.parse.urlparse(raw)
    except ValueError as exc:
        raise InvalidYouTubeURL(f"unparseable URL: {url!r}") from exc

    host = (parsed.hostname or "").lower()
    host = host.removeprefix("www.").removeprefix("m.")
    if host not in YOUTUBE_HOSTS:
        raise InvalidYouTubeURL(f"not a YouTube URL: {url!r}")

    if host == "youtu.be":
        candidate = parsed.path.lstrip("/").split("/")[0]
        if VIDEO_ID_RE.match(candidate):
            return candidate
        raise InvalidYouTubeURL(f"no video id in {url!r}")

    query_id = urllib.parse.parse_qs(parsed.query).get("v", [""])[0]
    if VIDEO_ID_RE.match(query_id):
        return query_id

    parts = [p for p in parsed.path.split("/") if p]
    for marker in ("shorts", "live", "embed", "v"):
        if marker in parts:
            index = parts.index(marker)
            if index + 1 < len(parts) and VIDEO_ID_RE.match(parts[index + 1]):
                return parts[index + 1]

    raise InvalidYouTubeURL(f"no video id in {url!r}")


def format_timestamp(seconds: float) -> str:
    """Seconds to [MM:SS], or [HH:MM:SS] once the video passes an hour."""
    total = int(seconds)
    hours, minutes, secs = total // 3600, (total % 3600) // 60, total % 60
    if hours:
        return f"[{hours:02d}:{minutes:02d}:{secs:02d}]"
    return f"[{minutes:02d}:{secs:02d}]"


# ---------------------------------------------------------------------------
# Metadata via yt-dlp
# ---------------------------------------------------------------------------

class _SilentLogger:
    """Swallow yt-dlp's own console output; errors surface via metadata_error."""

    def debug(self, msg: str) -> None: ...

    def info(self, msg: str) -> None: ...

    def warning(self, msg: str) -> None: ...

    def error(self, msg: str) -> None: ...


def _fetch_metadata(video: VideoData) -> None:
    """Fill title/author/description on `video`, or set metadata_error."""
    try:
        from yt_dlp import YoutubeDL
    except ImportError:
        video.metadata_error = (
            "yt-dlp is not importable. Install it into this environment with "
            "`pip install yt-dlp` (a pipx/uv tool install only provides the CLI)."
        )
        return

    options = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "noplaylist": True,
        "extract_flat": False,
        # `quiet` alone still lets yt-dlp write ERROR lines to stderr. A library
        # function should stay silent and report through the returned object,
        # so route its logging into a sink.
        "logger": _SilentLogger(),
    }

    try:
        with YoutubeDL(options) as ydl:
            # download=False means metadata only — no media is ever written.
            info = ydl.extract_info(video.url, download=False)
    except Exception as exc:  # yt-dlp raises DownloadError and friends
        video.metadata_error = f"{type(exc).__name__}: {exc}"
        return

    if not info:
        video.metadata_error = "yt-dlp returned no metadata"
        return

    video.title = info.get("title")
    video.author = info.get("uploader") or info.get("channel") or info.get("uploader_id")
    video.description = info.get("description")
    duration = info.get("duration")
    video.duration_seconds = int(duration) if isinstance(duration, (int, float)) else None


# ---------------------------------------------------------------------------
# Transcript via youtube-transcript-api
# ---------------------------------------------------------------------------

def _transcript_exceptions() -> tuple:
    """Collect the library's error classes that exist in the installed version.

    The package renames and adds exceptions between releases, so look them up
    by name instead of importing a fixed list that may not exist.
    """
    import youtube_transcript_api as yta

    names = (
        "CouldNotRetrieveTranscript",  # base class for most of the below
        "TranscriptsDisabled",
        "NoTranscriptFound",
        "VideoUnavailable",
        "VideoUnplayable",
        "AgeRestricted",
        "RequestBlocked",
        "IpBlocked",
        "TooManyRequests",
        "YouTubeRequestFailed",
        "NotTranslatable",
    )
    found = []
    for name in names:
        candidate = getattr(yta, name, None)
        if isinstance(candidate, type) and issubclass(candidate, Exception):
            found.append(candidate)
    return tuple(found) or (Exception,)


def _fetch_snippets(video_id: str, languages: tuple[str, ...]):
    """Return ([(start_seconds, text), ...], language_code).

    Supports both the 1.x instance API (`.fetch`) and the pre-1.0 static API
    (`.get_transcript`), since which one is installed varies widely.
    """
    from youtube_transcript_api import YouTubeTranscriptApi

    api = YouTubeTranscriptApi()
    if hasattr(api, "fetch"):  # youtube-transcript-api >= 1.0
        fetched = api.fetch(video_id, languages=list(languages))
        snippets = [(snippet.start, snippet.text) for snippet in fetched]
        return snippets, getattr(fetched, "language_code", None)

    entries = YouTubeTranscriptApi.get_transcript(video_id, languages=list(languages))
    return [(entry["start"], entry["text"]) for entry in entries], None


def _fetch_transcript(
    video: VideoData,
    languages: tuple[str, ...],
    include_timestamps: bool,
) -> None:
    """Fill transcript on `video`, or set transcript_error explaining why not."""
    try:
        import youtube_transcript_api  # noqa: F401
    except ImportError:
        video.transcript_error = (
            "youtube-transcript-api is not installed. "
            "Install it with `pip install youtube-transcript-api`."
        )
        return

    try:
        snippets, language = _fetch_snippets(video.video_id, languages)
    except _transcript_exceptions() as exc:
        video.transcript_error = _explain_transcript_error(exc, video.video_id)
        return
    except Exception as exc:  # network failures, proxy blocks, parser changes
        video.transcript_error = f"{type(exc).__name__}: {exc}"
        return

    lines = []
    for start, text in snippets:
        cleaned = " ".join(text.split())  # captions arrive with hard line breaks
        if not cleaned:
            continue
        lines.append(f"{format_timestamp(start)} {cleaned}" if include_timestamps else cleaned)

    if not lines:
        video.transcript_error = "the transcript came back empty"
        return

    video.transcript = "\n".join(lines)
    video.transcript_language = language or languages[0]


def _explain_transcript_error(exc: Exception, video_id: str) -> str:
    """Turn a library exception into something a human can act on."""
    name = type(exc).__name__
    messages = {
        "TranscriptsDisabled": "the uploader has disabled captions for this video",
        "NoTranscriptFound": "no transcript exists in the requested language(s)",
        "VideoUnavailable": "the video is unavailable (removed, private, or region-blocked)",
        "VideoUnplayable": "the video cannot be played (removed, private, or region-blocked)",
        "AgeRestricted": "the video is age-restricted and needs an authenticated session",
        "RequestBlocked": "YouTube blocked the request from this IP (try again later or use a proxy)",
        "IpBlocked": "YouTube blocked the request from this IP (try again later or use a proxy)",
        "TooManyRequests": "YouTube is rate-limiting this IP",
    }
    detail = messages.get(name)
    return f"{name}: {detail}" if detail else f"{name}: {exc}"


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def extract_video(
    url: str,
    languages: tuple[str, ...] = DEFAULT_LANGUAGES,
    include_timestamps: bool = True,
) -> VideoData:
    """Fetch title, author, description, and the English transcript for a video.

    No media is downloaded. Metadata and transcript are fetched independently,
    so one failing does not discard the other — check `metadata_error` and
    `transcript_error` on the result.

    Args:
        url: A YouTube URL in any common form, or a bare 11-character video id.
        languages: Preferred transcript languages, most preferred first.
        include_timestamps: Prefix each line with [MM:SS] / [HH:MM:SS].

    Returns:
        VideoData. `transcript` is a single newline-joined string, or None if
        no transcript could be retrieved.

    Raises:
        InvalidYouTubeURL: if `url` contains no recognizable video id. Every
            other failure is reported on the returned object instead.
    """
    video_id = parse_video_id(url)
    video = VideoData(url=f"https://www.youtube.com/watch?v={video_id}", video_id=video_id)

    _fetch_metadata(video)
    _fetch_transcript(video, tuple(languages), include_timestamps)
    return video


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(f"usage: {argv[0] if argv else 'extractor.py'} <youtube-url>", file=sys.stderr)
        return 64

    try:
        video = extract_video(argv[1])
    except InvalidYouTubeURL as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    print(f"title:       {video.title or '(unavailable)'}")
    print(f"author:      {video.author or '(unavailable)'}")
    print(f"video id:    {video.video_id}")
    if video.metadata_error:
        print(f"metadata:    FAILED — {video.metadata_error}", file=sys.stderr)
    if video.description:
        preview = video.description.strip().splitlines()[0][:100]
        print(f"description: {preview}{'…' if len(video.description) > 100 else ''}")

    print()
    if video.transcript:
        print(f"transcript ({video.transcript_language}, {len(video.transcript.splitlines())} lines):")
        print(video.transcript)
        return 0

    print(f"transcript unavailable — {video.transcript_error}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
