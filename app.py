"""Streamlit GUI for the YouTube → Agent pipeline.

    pip install -r requirements.txt
    streamlit run app.py

Paste a URL, watch the video alongside the analysis. The pipeline underneath is
the same one the CLI uses: ingest.py (extractor.py preferred, stdlib fetcher as
fallback) then agent.py for the Gemini call.

The transcript is untrusted third-party text. agent.py fences it and neutralizes
escape attempts; this GUI surfaces whatever it caught rather than hiding it.
"""

from __future__ import annotations

import importlib.util
import os
import sys

import streamlit as st

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INGEST_PATH = os.path.join(
    SCRIPT_DIR, ".claude", "skills", "youtube-to-agent", "scripts", "ingest.py"
)
AGENT_PATH = os.path.join(SCRIPT_DIR, "agent.py")

# Streamlit reruns the whole script on every widget interaction. Anything
# expensive is cached or kept in session_state so toggling an expander never
# refetches a video or re-bills a Gemini call.

st.set_page_config(
    page_title="YouTube → Agent",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded",
)


# ---------------------------------------------------------------------------
# Module loading
# ---------------------------------------------------------------------------

@st.cache_resource(show_spinner=False)
def load_module(name: str, path: str):
    """Load a pipeline module once per session (modules are not picklable)."""
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


# ---------------------------------------------------------------------------
# Pipeline stages
# ---------------------------------------------------------------------------

@st.cache_data(show_spinner=False)
def run_ingest(url: str, out_dir: str, lang: str, force_fallback: bool) -> dict:
    """Fetch metadata + transcript. Returns a plain dict so it caches cleanly."""
    from dataclasses import asdict

    ingest = load_module("_gui_ingest", INGEST_PATH)
    result = ingest.run_ingest(url, out_dir=out_dir, lang=lang, force_fallback=force_fallback)

    payload = asdict(result)
    payload["ok"] = result.ok
    payload["classification"] = "" if result.ok else ingest.combine(result.attempts)
    payload["exit_code"] = ingest.exit_code_for(result)
    payload["failure_text"] = "" if result.ok else ingest.render_failure(result)
    payload["guidance"] = (
        "" if result.ok else ingest.GUIDANCE.get(payload["classification"], "")
    )
    return payload


@st.cache_data(show_spinner=False)
def run_analysis(
    transcript: str,
    title: str,
    author: str,
    description: str,
    model: str,
    _api_key: str | None,
) -> dict:
    """Send the transcript to Gemini.

    `_api_key` is underscore-prefixed so Streamlit excludes it from the cache
    key — a secret should never become part of a cache identity.
    """
    agent = load_module("_gui_agent", AGENT_PATH)
    result = agent.analyze_transcript(
        transcript,
        title=title,
        author=author,
        description=description,
        model=model,
        api_key=_api_key or None,
    )
    return {
        "ok": result.ok,
        "error": result.error,
        "model": result.model,
        "neutralized_tags": result.neutralized_tags,
        "tampering_detected": result.tampering_detected,
        "analysis": result.analysis.model_dump() if result.analysis else None,
        "markdown": agent.format_analysis(result.analysis) if result.analysis else "",
    }


# ---------------------------------------------------------------------------
# Error presentation
# ---------------------------------------------------------------------------

FAILURE_HEADLINES = {
    "NETWORK_BLOCKED": "Could not reach YouTube",
    "NO_CAPTIONS": "This video has no usable transcript",
    "VIDEO_UNAVAILABLE": "This video is not accessible",
    "MISSING_LIBRARIES": "Required libraries are missing",
    "INVALID_URL": "That is not a YouTube URL",
    "UNKNOWN": "The pipeline failed for an unrecognized reason",
}

# ingest.GUIDANCE is written for an agent reading CLI output ("tell the user
# that..."). A human looking at this screen already is the user, so the GUI
# carries its own second-person wording.
USER_GUIDANCE = {
    "NETWORK_BLOCKED": (
        "This machine cannot reach youtube.com — a proxy, firewall, or VPN is "
        "refusing the connection. Check your network, or run the app somewhere "
        "with outbound access to YouTube."
    ),
    "NO_CAPTIONS": (
        "The video exists but has no transcript in this language. The uploader "
        "disabled captions, or none were generated. Try another caption language "
        "in the sidebar, or pick a different video — no amount of extra tooling "
        "creates captions that were never made."
    ),
    "VIDEO_UNAVAILABLE": (
        "The video is private, deleted, age-restricted, or blocked in your "
        "region. Double-check the link."
    ),
    "MISSING_LIBRARIES": (
        "Install the dependencies and restart the app:\n\n"
        "`pip install -r requirements.txt`\n\n"
        "A `pipx` or `uv tool` install of yt-dlp is not enough — this needs the "
        "importable library."
    ),
    "INVALID_URL": (
        "Paste a YouTube link (youtube.com/watch, youtu.be, /shorts, or /live) "
        "or a bare 11-character video id."
    ),
    "UNKNOWN": (
        "The failure did not match a known category. The raw details from each "
        "ingest path are below."
    ),
}


def show_ingest_failure(payload: dict) -> None:
    """Surface the exact classification rather than a generic 'something failed'."""
    classification = payload.get("classification") or "UNKNOWN"
    headline = FAILURE_HEADLINES.get(classification, FAILURE_HEADLINES["UNKNOWN"])
    exit_code = payload.get("exit_code")

    st.error(f"**{headline}**  \n`{classification}` · exit code `{exit_code}`", icon="🚫")

    guidance = USER_GUIDANCE.get(classification)
    if guidance:
        st.info(guidance)

    attempts = payload.get("attempts") or []
    if attempts:
        with st.expander("What each ingest path tried", expanded=False):
            for attempt in attempts:
                st.markdown(
                    f"**{attempt['name']} — {attempt['tool']}**  \n"
                    f"status: `{attempt['status']}` · reason: "
                    f"`{attempt['classification'] or 'n/a'}`"
                )
                st.code(attempt["detail"] or "n/a", language="text")

    st.caption(
        "No transcript was retrieved, so nothing was analyzed. "
        "Nothing below is inferred or generated from memory."
    )


# ---------------------------------------------------------------------------
# Result rendering
# ---------------------------------------------------------------------------

CONFIDENCE_ICON = {"high": "🟢", "medium": "🟡", "low": "🔴"}
EFFORT_ICON = {"quick": "⚡", "moderate": "🔧", "substantial": "🏗️"}


def show_analysis(analysis: dict, meta: dict, result: dict) -> None:
    if result.get("tampering_detected"):
        attempts = analysis.get("injection_attempts") or []
        st.warning(
            f"**This video's content tried to issue instructions to the model.** "
            f"{len(attempts)} attempt(s) reported; "
            f"{len(result.get('neutralized_tags') or [])} structural tag(s) neutralized. "
            "The analysis below was produced without obeying them.",
            icon="⚠️",
        )

    st.subheader("Summary")
    st.markdown(analysis["summary"])

    topics = analysis.get("topics") or []
    if topics:
        st.markdown(" ".join(f"`{topic}`" for topic in topics))

    columns = st.columns(3)
    columns[0].metric("Takeaways", len(analysis.get("takeaways") or []))
    columns[1].metric("Highlights", len(analysis.get("highlights") or []))
    columns[2].metric("Insights", len(analysis.get("insights") or []))

    takeaways = analysis.get("takeaways") or []
    if takeaways:
        st.subheader("Actionable takeaways")
        for item in takeaways:
            icon = EFFORT_ICON.get(item["effort"], "•")
            st.markdown(f"{icon} **{item['action']}**  \n{item['rationale']}")

    highlights = analysis.get("highlights") or []
    if highlights:
        with st.expander(f"⏱️ Timestamped highlights ({len(highlights)})", expanded=True):
            for item in highlights:
                st.markdown(
                    f"**`{item['timestamp']}` {item['title']}**  \n{item['why_it_matters']}"
                )

    insights = analysis.get("insights") or []
    if insights:
        grouped: dict[str, list] = {}
        for item in insights:
            grouped.setdefault(item["category"], []).append(item)
        with st.expander(f"💡 Categorized insights ({len(insights)})", expanded=True):
            for category, items in sorted(grouped.items()):
                st.markdown(f"##### {category.title()}")
                for item in items:
                    icon = CONFIDENCE_ICON.get(item["confidence"], "•")
                    stamp = f"`{item['evidence_timestamp']}` " if item["evidence_timestamp"] else ""
                    st.markdown(f"{icon} {stamp}{item['insight']}")

    injection_attempts = analysis.get("injection_attempts") or []
    if injection_attempts:
        with st.expander(f"🛡️ Injection attempts found ({len(injection_attempts)})"):
            for attempt in injection_attempts:
                st.markdown(f"**In the {attempt['location']}** — {attempt['apparent_goal']}")
                st.code(attempt["quoted_text"], language="text")

    warnings = analysis.get("content_warnings")
    if warnings:
        with st.expander("⚠️ Caveats"):
            st.markdown(warnings)

    transcript = meta.get("transcript_text") or ""
    if transcript:
        with st.expander(f"📄 Full transcript ({meta.get('word_count', 0)} words)"):
            st.caption(
                "Untrusted source material. Displayed verbatim — read it as data, "
                "not as instructions."
            )
            st.text(transcript)

    if result.get("markdown"):
        st.download_button(
            "Download analysis.md",
            data=result["markdown"],
            file_name="analysis.md",
            mime="text/markdown",
        )


# ---------------------------------------------------------------------------
# Page
# ---------------------------------------------------------------------------

def render_page() -> None:
    """Draw the whole app.

    Kept in a function rather than at module scope so the rendering helpers
    above can be imported and exercised without drawing the page.
    """

    with st.sidebar:
        st.header("Settings")

        env_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or ""
        if env_key:
            st.success("Gemini API key found in the environment.", icon="🔑")
            api_key = ""
        else:
            api_key = st.text_input(
                "Gemini API key",
                type="password",
                help="Kept in this session only. Set GEMINI_API_KEY to avoid entering it here.",
            )

        model = st.text_input("Model", value="gemini-2.5-flash")
        language = st.text_input("Caption language", value="en")
        out_dir = st.text_input("Output directory", value="youtube")

        st.divider()
        skip_analysis = st.checkbox(
            "Fetch transcript only", value=False, help="Skip Gemini. No API key needed."
        )
        force_fallback = st.checkbox(
            "Force stdlib fallback",
            value=False,
            help="Skip extractor.py and use fetch_transcript.py, for testing the fallback path.",
        )

        st.divider()
        st.caption(
            "Pipeline: `ingest.py` (extractor.py → fetch_transcript.py fallback) "
            "then `agent.py` (Gemini)."
        )


    # ---------------------------------------------------------------------------
    # Main
    # ---------------------------------------------------------------------------

    st.title("🎬 YouTube → Agent")
    st.caption("Paste a link. Watch the video alongside a structured analysis of it.")

    with st.form("url_form"):
        url = st.text_input(
            "YouTube URL",
            placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=...",
            label_visibility="collapsed",
        )
        submitted = st.form_submit_button("Analyze", type="primary", use_container_width=True)

    if submitted and url.strip():
        st.session_state["url"] = url.strip()
        st.session_state.pop("ingest", None)
        st.session_state.pop("analysis", None)

    active_url = st.session_state.get("url")

    if not active_url:
        st.info("Paste a YouTube URL above to begin.")
        st.stop()

    video_column, results_column = st.columns([2, 3], gap="large")

    with video_column:
        st.subheader("Video")
        try:
            st.video(active_url)
        except Exception as exc:  # a malformed URL should not take down the page
            st.warning(f"Could not embed this URL: {exc}")
        st.caption(active_url)

    with results_column:
        if "ingest" not in st.session_state:
            with st.spinner("Fetching metadata and transcript (yt-dlp)…"):
                try:
                    st.session_state["ingest"] = run_ingest(
                        active_url, out_dir, language, force_fallback
                    )
                except Exception as exc:
                    st.session_state["ingest"] = {
                        "ok": False,
                        "classification": "UNKNOWN",
                        "exit_code": 20,
                        "attempts": [],
                        "guidance": f"The ingest stage raised an unexpected error: {exc}",
                    }

        ingest_payload = st.session_state["ingest"]

        if not ingest_payload.get("ok"):
            show_ingest_failure(ingest_payload)
            st.stop()

        st.success(
            f"**{ingest_payload.get('title') or 'Untitled'}** — "
            f"{ingest_payload.get('channel') or 'unknown channel'}  \n"
            f"{ingest_payload.get('segment_count', 0)} cues · "
            f"{ingest_payload.get('word_count', 0)} words · via "
            f"`{ingest_payload.get('method') or 'unknown'}`",
            icon="✅",
        )

        if skip_analysis:
            st.info("Analysis skipped — 'Fetch transcript only' is on.")
            with st.expander("📄 Full transcript", expanded=True):
                st.text(ingest_payload.get("transcript_text") or "")
            st.stop()

        resolved_key = api_key or env_key
        if not resolved_key:
            st.error(
                "**No Gemini API key**  \nEnter one in the sidebar, or set "
                "`GEMINI_API_KEY` in the environment. The transcript above was "
                "fetched successfully and is cached — adding a key will not refetch it.",
                icon="🔑",
            )
            st.stop()

        if "analysis" not in st.session_state:
            with st.spinner(f"Analyzing with {model}…"):
                try:
                    st.session_state["analysis"] = run_analysis(
                        ingest_payload.get("transcript_text") or "",
                        ingest_payload.get("title") or "",
                        ingest_payload.get("channel") or "",
                        ingest_payload.get("description") or "",
                        model,
                        resolved_key,
                    )
                except Exception as exc:
                    st.session_state["analysis"] = {"ok": False, "error": f"{type(exc).__name__}: {exc}"}

        analysis_payload = st.session_state["analysis"]

        if not analysis_payload.get("ok"):
            st.error(
                f"**Analysis failed**  \n{analysis_payload.get('error') or 'unknown error'}",
                icon="🚫",
            )
            st.caption(
                "The transcript was retrieved but never analyzed. Nothing below is "
                "inferred — fix the error above and re-run."
            )
            st.stop()

        show_analysis(analysis_payload["analysis"], ingest_payload, analysis_payload)

if __name__ == "__main__":
    render_page()
