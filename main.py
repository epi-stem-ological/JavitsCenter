"""End-to-end CLI: YouTube URL in, structured analysis out.

    python main.py "https://youtu.be/VIDEO_ID"

The pipeline is two stages:

  1. INGEST   extractor.py (yt-dlp + youtube-transcript-api) is preferred.
              scripts/fetch_transcript.py is the stdlib fallback, used only if
              the libraries are missing or the preferred path fails.
  2. ANALYZE  agent.py sends the transcript to Gemini and returns a structured
              VideoAnalysis.

Either stage can fail on its own. Whichever fails prints a formatted diagnostic
naming what was tried and why it stopped, and exits with a code identifying the
class of failure — never a bare traceback, and never a fabricated summary.

Setup:

    pip install yt-dlp youtube-transcript-api google-genai
    export GEMINI_API_KEY=...

Options:

    --no-analysis      ingest only; skip Gemini (no API key needed)
    --save             write analysis.md next to transcript.md
    --json             machine-readable output
    --model NAME       Gemini model id
    --out-dir DIR      output root (default: youtube)
    --force-fallback   skip extractor.py, exercise the stdlib path
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INGEST_PATH = os.path.join(
    SCRIPT_DIR, ".claude", "skills", "youtube-to-agent", "scripts", "ingest.py"
)

# Exit codes 0-6 are inherited from ingest.py so a caller can distinguish
# ingest failures. Analysis failures start at 10.
EXIT_MISSING_SDK = 10
EXIT_NO_API_KEY = 11
EXIT_ANALYSIS_FAILED = 12
EXIT_INTERNAL = 20

RULE = "=" * 72


def _load(name: str, path: str):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def format_stage_failure(stage: str, reason: str, detail: str, guidance: str) -> str:
    """The same diagnostic shape ingest.py uses, for analysis-stage failures."""
    return "\n".join(
        [
            RULE,
            f"{stage} FAILED — no analysis was produced.",
            RULE,
            "",
            f"Reason: {reason}",
            f"Detail: {detail}",
            "",
            "What to do:",
            "",
            "  " + guidance.replace("\n", "\n  "),
            "",
            "Required behavior:",
            "",
            "  DO NOT write a summary or analysis of this video from memory or",
            "  inference. The transcript was retrieved but never analyzed.",
            "",
            RULE,
        ]
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Turn a YouTube link into a structured analysis.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("url", help="YouTube URL or 11-character video id")
    parser.add_argument("--out-dir", default="youtube", help="output root directory")
    parser.add_argument("--lang", default="en", help="preferred caption language")
    parser.add_argument("--window", type=int, default=30, help="seconds per transcript block")
    parser.add_argument("--model", default=None, help="Gemini model id")
    parser.add_argument("--no-analysis", action="store_true", help="ingest only, skip Gemini")
    parser.add_argument("--save", action="store_true", help="write analysis.md beside transcript.md")
    parser.add_argument("--json", action="store_true", help="machine-readable output")
    parser.add_argument("--force-fallback", action="store_true", help="skip extractor.py")
    args = parser.parse_args(argv)

    # ---------------------------------------------------------------- ingest
    try:
        ingest = _load("_pipeline_ingest", INGEST_PATH)
    except Exception as exc:
        print(
            format_stage_failure(
                "PIPELINE SETUP",
                "could not load the ingest module",
                f"{type(exc).__name__}: {exc}",
                f"Expected ingest.py at:\n  {INGEST_PATH}\n"
                "Run this from the repository root, or restore the skill directory.",
            ),
            file=sys.stderr,
        )
        return EXIT_INTERNAL

    result = ingest.run_ingest(
        args.url,
        out_dir=args.out_dir,
        lang=args.lang,
        window=args.window,
        force_fallback=args.force_fallback,
    )

    if not result.ok:
        # ingest.py already formats this precisely; do not paraphrase it.
        print(ingest.render_failure(result), file=sys.stderr)
        if args.json:
            print(json.dumps({"ok": False, "stage": "ingest",
                              "classification": ingest.combine(result.attempts)}, indent=2))
        return ingest.exit_code_for(result)

    print(ingest.render_success(result), file=sys.stderr)

    if args.no_analysis:
        if args.json:
            print(json.dumps({"ok": True, "stage": "ingest", "analysis": None,
                              "transcript_path": result.transcript_path}, indent=2))
        else:
            print(f"\nTranscript written to {result.transcript_path}")
            print("Skipped analysis (--no-analysis).")
        return 0

    # --------------------------------------------------------------- analyze
    try:
        agent = _load("_pipeline_agent", os.path.join(SCRIPT_DIR, "agent.py"))
    except ImportError as exc:
        print(
            format_stage_failure(
                "ANALYSIS", "the Gemini SDK is not installed", f"{type(exc).__name__}: {exc}",
                "Install it with `pip install google-genai`.\n"
                f"The transcript was captured and is safe at:\n  {result.transcript_path}\n"
                "Re-run once the SDK is present, or pass --no-analysis.",
            ),
            file=sys.stderr,
        )
        return EXIT_MISSING_SDK
    except Exception as exc:
        print(
            format_stage_failure(
                "ANALYSIS", "could not load agent.py", f"{type(exc).__name__}: {exc}",
                "Check that agent.py is present and importable.",
            ),
            file=sys.stderr,
        )
        return EXIT_INTERNAL

    kwargs = {"model": args.model} if args.model else {}
    analysis_result = agent.analyze_transcript(
        result.transcript_text,
        title=result.title,
        author=result.channel,
        description=result.description,
        **kwargs,
    )

    if not analysis_result.ok:
        error = analysis_result.error or "unknown error"
        low = error.lower()
        if "no api key" in low:
            reason, code = "no Gemini API key is set", EXIT_NO_API_KEY
            guidance = (
                "Set one and re-run:\n"
                "  export GEMINI_API_KEY=...\n"
                f"The transcript is already captured at:\n  {result.transcript_path}\n"
                "Re-running will not re-fetch the video unnecessarily."
            )
        elif "not installed" in low:
            reason, code = "the Gemini SDK is not installed", EXIT_MISSING_SDK
            guidance = "Install it with `pip install google-genai`."
        else:
            reason, code = "the Gemini request failed", EXIT_ANALYSIS_FAILED
            guidance = (
                "This is an API-side failure, not a problem with the transcript.\n"
                f"The transcript is captured at:\n  {result.transcript_path}\n"
                "Check the key, the model id, quota, and network reachability of "
                "generativelanguage.googleapis.com, then re-run."
            )
        print(format_stage_failure("ANALYSIS", reason, error, guidance), file=sys.stderr)
        if args.json:
            print(json.dumps({"ok": False, "stage": "analysis", "error": error}, indent=2))
        return code

    analysis = analysis_result.analysis

    if analysis_result.tampering_detected:
        print(
            "\n⚠ WARNING: this video's content tried to issue instructions to the "
            "model.\n  Neutralized tags: "
            f"{analysis_result.neutralized_tags or 'none'}\n"
            f"  Reported attempts: {len(analysis.injection_attempts)}\n"
            "  The analysis below was produced without obeying them.\n",
            file=sys.stderr,
        )

    rendered = agent.format_analysis(analysis)

    if args.save:
        path = os.path.join(result.out_dir, "analysis.md")
        with open(path, "w", encoding="utf-8") as handle:
            handle.write(rendered)
        print(f"analysis written to {path}", file=sys.stderr)

    if args.json:
        print(json.dumps(
            {
                "ok": True,
                "stage": "complete",
                "video": {
                    "title": result.title,
                    "channel": result.channel,
                    "method": result.method,
                    "transcript_path": result.transcript_path,
                },
                "tampering_detected": analysis_result.tampering_detected,
                "analysis": analysis.model_dump(),
            },
            indent=2, ensure_ascii=False,
        ))
    else:
        print(rendered)

    return 0


if __name__ == "__main__":
    sys.exit(main())
