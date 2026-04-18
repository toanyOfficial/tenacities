#!/usr/bin/env python3
"""Verify exported multi-page content is preserved exactly.

This lock enforces:
- exact bytes of every exported HTML page
- page boundaries (set of page files)
- internal link relationships and traversal from examples/home.html
- per-page heading order (h1/h2/h3 text sequence)
"""

from __future__ import annotations

import hashlib
import json
import re
from collections import deque
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent
EXAMPLES = ROOT / "examples"
MANIFEST = ROOT / "content_lock_manifest.json"

HREF_RE = re.compile(r'href="([^"]+)"')
HEADING_RE = re.compile(r"<h([1-3])[^>]*>(.*?)</h\\1>", re.IGNORECASE | re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


@dataclass
class PageData:
    sha256: str
    headings: list[str]
    internal_links: list[str]


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def normalize_text(text: str) -> str:
    text = TAG_RE.sub("", text)
    text = text.replace("&nbsp;", " ")
    text = WS_RE.sub(" ", text).strip()
    return text


def extract_page_data(path: Path, all_html_names: set[str]) -> PageData:
    raw = path.read_bytes()
    html = raw.decode("utf-8")

    headings = [normalize_text(m.group(2)) for m in HEADING_RE.finditer(html)]

    internal_links: list[str] = []
    for href in HREF_RE.findall(html):
        decoded = unquote(href)
        if decoded.startswith(("http://", "https://", "#")):
            continue
        if decoded in all_html_names:
            internal_links.append(decoded)

    return PageData(
        sha256=sha256_bytes(raw),
        headings=headings,
        internal_links=sorted(set(internal_links)),
    )


def compute_current_state() -> dict:
    html_files = sorted(p.name for p in EXAMPLES.glob("*.html"))
    html_set = set(html_files)
    pages: dict[str, dict] = {}

    for name in html_files:
        data = extract_page_data(EXAMPLES / name, html_set)
        pages[name] = {
            "sha256": data.sha256,
            "headings": data.headings,
            "internal_links": data.internal_links,
        }

    entry = "home.html"
    reachable = []
    seen = set()
    queue = deque([entry])
    while queue:
        cur = queue.popleft()
        if cur in seen or cur not in pages:
            continue
        seen.add(cur)
        reachable.append(cur)
        for nxt in pages[cur]["internal_links"]:
            if nxt not in seen:
                queue.append(nxt)

    return {
        "version": 1,
        "entry": entry,
        "html_pages": html_files,
        "reachable_from_entry": reachable,
        "pages": pages,
    }


def main() -> None:
    if not EXAMPLES.exists():
        raise SystemExit("examples/ directory not found")
    if not MANIFEST.exists():
        raise SystemExit("content_lock_manifest.json not found")

    expected = json.loads(MANIFEST.read_text(encoding="utf-8"))
    current = compute_current_state()

    if current != expected:
        expected_pages = set(expected.get("html_pages", []))
        current_pages = set(current["html_pages"])
        added = sorted(current_pages - expected_pages)
        removed = sorted(expected_pages - current_pages)
        changed = sorted(
            p for p in (current_pages & expected_pages)
            if current["pages"][p] != expected["pages"][p]
        )

        print("❌ Content lock verification failed")
        if added:
            print("Added pages:", added)
        if removed:
            print("Removed pages:", removed)
        if changed:
            print("Changed pages:", changed)

        if current.get("reachable_from_entry") != expected.get("reachable_from_entry"):
            print("Reachability from entry changed")

        raise SystemExit(1)

    print("✅ Content lock verified: exported content and structure are unchanged")


if __name__ == "__main__":
    main()
