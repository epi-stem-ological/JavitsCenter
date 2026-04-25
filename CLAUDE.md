# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

This repository is a fresh scaffold. As of this writing it contains only `README.md` (which notes "FF Working on JKJCC") and no source code, build tooling, tests, or configuration. There is no package manifest, no language toolchain pinned, and no CI.

When this repo is bootstrapped with actual code, update this file with:
- Build / lint / test / run commands (including how to run a single test)
- The high-level architecture once it spans more than one file
- Any project-specific conventions that aren't obvious from reading a single file

Until then, ask the user before assuming a stack, framework, or directory layout — there is nothing in-tree to infer them from.

## Branch convention

Development for AI-assisted changes happens on `claude/...` branches (e.g. `claude/add-claude-documentation-D9r1W`); `main` is the default branch. Push to the designated working branch, not directly to `main`.
