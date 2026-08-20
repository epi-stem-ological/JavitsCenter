#!/usr/bin/env python3
"""Single ingest entry point for the youtube-to-agent skill.

Tries two paths in order and writes one consistent output either way:

  Path 1  extractor.py — yt-dlp + youtube-transcript-api. Preferred: richer
          metadata, better handling of gated videos, maintained upstream.
  Path 2  fetch_transcript.py — stdlib only. Used when the libraries are
          missing, when extractor.py is not on disk, or when path 1 fails.

If both fail, print a formatted diagnostic naming what each path tried and
what stopped it, so the agent can tell the user the real reason instead of
guessing — or worse, inventing a summary.

Exit codes:
  0  transcript captured
  2  video reachable but has no usable transcript (captions off)
  3  YouTube unreachable (network egress blocked / offline)
  4  not a YouTube URL
  5  video unavailable (private, removed, region- or age-blocked)
  6  both paths failed for an unclassified reason
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import re
import sys
from dataclasses import dataclass, field

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Failure classes, in the order we prefer to report them when the two paths
# disagree about what went wrong.
NETWORK_BLOCKED = "NETWORK_BLOCKED"
NO_CAPTIONS = "NO_CAPTIONS"
VIDEO_UNAVAILABLE = "VIDEO_UNAVAILABLE"
MISSING_LIBRARIES = "MISSING_LIBRARIES"
INVALID_URL = "INVALID_URL"
UNKNOWN = "UNKNOWN"

EXIT_CODES = {
    NO_CAPTIONS: 2,
    NETWORK_BLOCKED: 3,
    INVALID_URL: 4,
    VIDEO_UNAVAILABLE: 5,
    MISSING_LIBRARIES: 6,
    UNKNOWN: 6,
}

GUIDANCE = {
    NETWORK_BLOCKED: (
        "This machine cannot reach youtube.com — an egress proxy or firewall is "
        "refusing the connection. Nothing about the video is known.\n"
        "Tell the user plainly that the sandbox blocked the fetch, and offer to run "
        "the analysis on a transcript they paste in."
    ),
    NO_CAPTIONS: (
        "The video exists but has no transcript in the requested language — the "
        "uploader disabled captions, or none were generated.\n"
        "Offer the user two options: paste a transcript, or supply a different video. "
        "Installing yt-dlp does not help when captions genuinely do not exist."
    ),
    VIDEO_UNAVAILABLE: (
        "The video is private, deleted, age-restricted, or blocked in this region.\n"
        "Ask the user to confirm the link, or to supply a transcript directly."
    ),
    MISSING_LIBRARIES: (
        "Neither ingest path could run. Install the libraries with "
        "`pip install yt-dlp youtube-transcript-api`.\n"
        "Note that `pipx install` / `uv tool install` provide only the yt-dlp CLI, "
        "not the importable module."
    ),
    INVALID_URL: "The argument was not a YouTube URL or an 11-character video id.",
    UNKNOWN: (
        "Both paths failed for a reason this script does not recognize. The raw "
        "errors are above — report them to the user verbatim rather than guessing."
    ),
}

NEVER_FABRICATE = (
    "DO NOT write a summary, brief, insight, or agent definition for this video. "
    "No transcript was retrieved, so there is nothing to analyze. Report the "
    "failure to the user instead."
)


MAX_DETAIL_CHARS = 300


def _condense(detail: str) -> str:
    """Keep diagnostics scannable.

    yt-dlp appends its "please report this issue" boilerplate to every error,
    which buries the actual cause. Trim it and anything else overlong.
    """
    text = " ".join((detail or "").split())
    for boilerplate in ("; please report this issue", " Confirm you are on the latest version"):
        index = text.find(boilerplate)
        if index != -1:
            text = text[:index]
    if len(text) > MAX_DETAIL_CHARS:
        text = text[:MAX_DETAIL_CHARS].rstrip() + " […]"
    return text


@dataclass
class Attempt:
    """One ingest path's outcome."""

    name: str
    tool: str
    status: str = "not attempted"
    classification: str = ""
    detail: str = ""


@dataclass
class Ingest:
    """The combined result of trying both paths."""

    url: str
    video_id: str = ""
    attempts: list = field(default_factory=list)
    transcript_path: str = ""
    source_path: str = ""
    out_dir: str = ""
    method: str = ""
    title: str = ""
    channel: str = ""
    description: str = ""
    transcript_text: str = ""
    segment_count: int = 0
    word_count: int = 0

    @property
    def ok(self) -> bool:
        return bool(self.transcript_path)


# ---------------------------------------------------------------------------
# Module loading
# ---------------------------------------------------------------------------

def _load_module(name: str, path: str):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def find_extractor() -> str | None:
    """Locate extractor.py: cwd, then repo root, then near this script."""
    candidates = [
        os.path.join(os.getcwd(), "extractor.py"),
        os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", "..", "..", "extractor.py")),
        os.path.join(SCRIPT_DIR, "extractor.py"),
    ]
    for path in candidates:
        if os.path.isfile(path):
            return path
    return None


def libraries_present() -> tuple[bool, str]:
    """Are yt-dlp and youtube-transcript-api importable here?"""
    missing = []
    for module, package in (("yt_dlp", "yt-dlp"), ("youtube_transcript_api", "youtube-transcript-api")):
        if importlib.util.find_spec(module) is None:
            missing.append(package)
    if missing:
        return False, "not importable: " + ", ".join(missing)
    return True, ""


# ---------------------------------------------------------------------------
# Failure classification
# ---------------------------------------------------------------------------

NETWORK_MARKERS = (
    "tunnel connection failed", "proxyerror", "unable to connect to proxy",
    "403 forbidden", "connection refused", "temporary failure in name resolution",
    "max retries exceeded", "nodename nor servname", "network is unreachable",
    "unable to download api page", "timed out", "egress",
)
NO_CAPTION_MARKERS = (
    "transcriptsdisabled", "disabled captions", "no transcript", "notranscriptfound",
    "no caption tracks", "empty caption", "came back empty", "subtitles are disabled",
)
UNAVAILABLE_MARKERS = (
    "videounavailable", "videounplayable", "agerestricted", "private video",
    "removed", "not available in your country", "members-only", "sign in to confirm",
    "login_required", "age-restricted",
)
MISSING_LIB_MARKERS = ("not importable", "not installed", "modulenotfounderror", "no module named")


def classify(text: str) -> str:
    """Map an error string onto a failure class.

    Order matters: a proxy error mentioning "no transcript" is still a network
    failure, so network markers are checked first.
    """
    low = (text or "").lower()
    for markers, label in (
        (NETWORK_MARKERS, NETWORK_BLOCKED),
        (UNAVAILABLE_MARKERS, VIDEO_UNAVAILABLE),
        (NO_CAPTION_MARKERS, NO_CAPTIONS),
        (MISSING_LIB_MARKERS, MISSING_LIBRARIES),
    ):
        if any(marker in low for marker in markers):
            return label
    return UNKNOWN


def combine(attempts: list) -> str:
    """Pick the most informative classification across both paths.

    A specific diagnosis from either path beats UNKNOWN, and a video-level
    reason (no captions, unavailable) beats an infrastructure one, since it
    tells the user something actionable about the video itself.
    """
    found = [a.classification for a in attempts if a.classification]
    for label in (NO_CAPTIONS, VIDEO_UNAVAILABLE, NETWORK_BLOCKED, MISSING_LIBRARIES, INVALID_URL):
        if label in found:
            return label
    return UNKNOWN


# ---------------------------------------------------------------------------
# Transcript rendering (shared so both paths write identical files)
# ---------------------------------------------------------------------------

TIMESTAMP_LINE = re.compile(r"^\[(?:(\d+):)?(\d{1,2}):(\d{2})\]\s*(.*)$")


def parse_timestamped_lines(transcript: str) -> list:
    """Turn extractor.py's '[MM:SS] text' lines back into (start, text) pairs."""
    segments = []
    for line in (transcript or "").splitlines():
        match = TIMESTAMP_LINE.match(line.strip())
        if not match:
            if segments and line.strip():
                segments[-1]["text"] += " " + line.strip()
            continue
        hours, minutes, seconds, text = match.groups()
        start = int(hours or 0) * 3600 + int(minutes) * 60 + int(seconds)
        segments.append({"start": float(start), "text": text})
    return segments


# ---------------------------------------------------------------------------
# Path 1 — extractor.py
# ---------------------------------------------------------------------------

def try_extractor(url: str, result: Ingest, fetcher, out_root: str, window: int) -> bool:
    attempt = Attempt(name="Path 1", tool="extractor.py (yt-dlp + youtube-transcript-api)")
    result.attempts.append(attempt)

    path = find_extractor()
    if not path:
        attempt.status = "skipped"
        attempt.classification = MISSING_LIBRARIES
        attempt.detail = "extractor.py not found in cwd, repo root, or the script directory"
        return False

    present, missing = libraries_present()
    if not present:
        attempt.status = "skipped"
        attempt.classification = MISSING_LIBRARIES
        attempt.detail = missing
        return False

    try:
        extractor = _load_module("_yta_extractor", path)
    except Exception as exc:
        attempt.status = "failed"
        attempt.classification = classify(str(exc))
        attempt.detail = f"could not import {path} — {type(exc).__name__}: {exc}"
        return False

    try:
        video = extractor.extract_video(url)
    except Exception as exc:
        name = type(exc).__name__
        attempt.status = "failed"
        attempt.classification = INVALID_URL if "InvalidYouTube" in name else classify(str(exc))
        attempt.detail = f"{name}: {exc}"
        return False

    result.video_id = video.video_id

    if not video.transcript:
        attempt.status = "failed"
        problems = [p for p in (video.transcript_error, video.metadata_error) if p]
        attempt.detail = " | ".join(problems) or "no transcript returned"
        attempt.classification = classify(attempt.detail)
        return False

    segments = parse_timestamped_lines(video.transcript)
    if not segments:
        attempt.status = "failed"
        attempt.classification = UNKNOWN
        attempt.detail = "transcript returned but no timestamps could be parsed from it"
        return False

    payload = fetcher.Video(
        video_id=video.video_id,
        url=video.url,
        title=video.title or "",
        channel=video.author or "",
        description=video.description or "",
        duration_seconds=video.duration_seconds or 0,
        transcript_language=video.transcript_language or "",
        source_method="extractor.py",
        segments=segments,
    )
    _write_outputs(result, fetcher, payload, out_root, window)
    attempt.status = "ok"
    attempt.detail = f"{len(segments)} cues via youtube-transcript-api"
    if video.metadata_error:
        attempt.detail += f" (metadata degraded: {video.metadata_error[:120]})"
    return True


# ---------------------------------------------------------------------------
# Path 2 — fetch_transcript.py
# ---------------------------------------------------------------------------

def try_fetcher(url: str, result: Ingest, fetcher, out_root: str, window: int, lang: str) -> bool:
    attempt = Attempt(name="Path 2", tool="fetch_transcript.py (stdlib fallback)")
    result.attempts.append(attempt)

    video_id = fetcher.parse_video_id(url)
    if not video_id:
        attempt.status = "failed"
        attempt.classification = INVALID_URL
        attempt.detail = f"no video id in {url!r}"
        return False

    result.video_id = result.video_id or video_id
    payload = fetcher.Video(video_id=video_id, url=fetcher.canonical_url(video_id))

    try:
        got = fetcher.try_yt_dlp(payload, lang) or fetcher.try_innertube(payload, lang)
    except fetcher.Unreachable as exc:
        attempt.status = "failed"
        attempt.classification = NETWORK_BLOCKED
        attempt.detail = str(exc)
        return False
    except Exception as exc:
        attempt.status = "failed"
        attempt.classification = classify(str(exc))
        attempt.detail = f"{type(exc).__name__}: {exc}"
        return False

    if not got:
        fetcher.try_oembed(payload)
        attempt.status = "failed"
        attempt.detail = payload.source_method or "no caption track available"
        attempt.classification = classify(attempt.detail) if payload.source_method else NO_CAPTIONS
        return False

    _write_outputs(result, fetcher, payload, out_root, window)
    attempt.status = "ok"
    attempt.detail = f"{len(payload.segments)} cues via {payload.source_method}"
    return True


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

def _write_outputs(result: Ingest, fetcher, payload, out_root: str, window: int) -> None:
    from dataclasses import asdict

    out_dir = os.path.join(out_root, fetcher.slugify(payload.title, payload.video_id))
    os.makedirs(out_dir, exist_ok=True)

    transcript_path = os.path.join(out_dir, "transcript.md")
    source_path = os.path.join(out_dir, "source.json")

    with open(transcript_path, "w", encoding="utf-8") as handle:
        handle.write(fetcher.render_markdown(payload, window))
    with open(source_path, "w", encoding="utf-8") as handle:
        json.dump(asdict(payload), handle, indent=2, ensure_ascii=False)

    result.out_dir = out_dir
    result.transcript_path = transcript_path
    result.source_path = source_path
    result.method = payload.source_method
    result.title = payload.title
    result.channel = payload.channel
    result.description = payload.description
    result.segment_count = len(payload.segments)
    result.word_count = sum(len(s["text"].split()) for s in payload.segments)

    # Build the text handed to the analysis stage from the same blocks the
    # markdown uses, so a timestamp the model cites can be found in the file.
    result.transcript_text = "\n".join(
        f"[{fetcher.timestamp(block['start'])}] {block['text'].strip()}"
        for block in fetcher.to_blocks(payload.segments, window)
    )


def render_failure(result: Ingest) -> str:
    """The message handed to the agent when no transcript was obtained."""
    label = combine(result.attempts)
    lines = [
        "=" * 72,
        "TRANSCRIPT UNAVAILABLE — no analysis is possible for this video.",
        "=" * 72,
        "",
        f"URL:      {result.url}",
        f"Video id: {result.video_id or '(could not be determined)'}",
        f"Reason:   {label}",
        "",
        "What each ingest path tried:",
        "",
    ]
    for attempt in result.attempts:
        lines += [
            f"  {attempt.name} — {attempt.tool}",
            f"    status: {attempt.status}",
            f"    reason: {attempt.classification or 'n/a'}",
            f"    detail: {_condense(attempt.detail) or 'n/a'}",
            "",
        ]
    lines += ["What this means:", "", "  " + GUIDANCE[label].replace("\n", "\n  "), ""]
    lines += ["Required behavior:", "", "  " + NEVER_FABRICATE, "", "=" * 72]
    return "\n".join(lines)


def render_success(result: Ingest) -> str:
    lines = [
        "TRANSCRIPT OK",
        f"  title:      {result.title or '(unknown)'}",
        f"  channel:    {result.channel or '(unknown)'}",
        f"  method:     {result.method}",
        f"  transcript: {result.segment_count} cues / {result.word_count} words",
        f"  written to: {result.transcript_path}",
    ]
    degraded = [a for a in result.attempts if a.status in {"failed", "skipped"}]
    if degraded:
        lines.append("  note:       fell back after " + "; ".join(
            f"{a.name} {a.status} ({a.classification or 'n/a'})" for a in degraded
        ))
    return "\n".join(lines)


def run_ingest(
    url: str,
    out_dir: str = "youtube",
    lang: str = "en",
    window: int = 30,
    force_fallback: bool = False,
) -> Ingest:
    """Run the ingest pipeline: extractor.py first, stdlib fetcher as fallback.

    Always returns an Ingest — check `.ok`, and render_failure() it if not.
    """
    fetcher = _load_module("_yta_fetcher", os.path.join(SCRIPT_DIR, "fetch_transcript.py"))
    result = Ingest(url=url)

    got = False
    if not force_fallback:
        got = try_extractor(url, result, fetcher, out_dir, window)
    if not got:
        try_fetcher(url, result, fetcher, out_dir, window, lang)
    return result


def exit_code_for(result: Ingest) -> int:
    """Process exit code matching an ingest outcome."""
    if result.ok:
        return 0
    return EXIT_CODES.get(combine(result.attempts), 6)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("url", help="YouTube URL or 11-character video id")
    parser.add_argument("--out-dir", default="youtube", help="root output directory")
    parser.add_argument("--lang", default="en", help="preferred caption language")
    parser.add_argument("--window", type=int, default=30, help="seconds per transcript paragraph")
    parser.add_argument("--json", action="store_true", help="emit a machine-readable report")
    parser.add_argument("--force-fallback", action="store_true", help="skip path 1 (for testing)")
    args = parser.parse_args()

    result = run_ingest(args.url, args.out_dir, args.lang, args.window, args.force_fallback)

    if args.json:
        from dataclasses import asdict
        print(json.dumps(
            {**asdict(result), "ok": result.ok, "classification": "" if result.ok else combine(result.attempts)},
            indent=2, ensure_ascii=False,
        ))
    elif result.ok:
        print(render_success(result))
    else:
        print(render_failure(result), file=sys.stderr)

    return exit_code_for(result)


if __name__ == "__main__":
    sys.exit(main())
