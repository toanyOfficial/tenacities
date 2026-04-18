#!/usr/bin/env python3
"""Final QA checks for exported multi-page site."""

from __future__ import annotations

import os
import re
import sys
import urllib.request
from collections import deque
from pathlib import Path
from subprocess import Popen
from time import sleep
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent
EXAMPLES = ROOT / "examples"
HOME = EXAMPLES / "home.html"
SERVER_CMD = [sys.executable, str(ROOT / "serve_examples.py")]

HREF_RE = re.compile(r'href="([^"]+)"')
SRC_RE = re.compile(r'src="([^"]+)"')


def all_exported_html() -> set[str]:
    return {p.name for p in EXAMPLES.glob("*.html")}


def scan_refs(page_path: Path) -> tuple[list[str], list[str], list[str]]:
    text = page_path.read_text(encoding="utf-8")
    hrefs = [unquote(v) for v in HREF_RE.findall(text)]
    srcs = [unquote(v) for v in SRC_RE.findall(text)]

    internal_html = [h for h in hrefs if h in all_exported_html()]
    internal_assets = [s for s in srcs if not s.startswith(("http://", "https://", "data:"))]
    local_hrefs = [h for h in hrefs if not h.startswith(("http://", "https://", "#")) and h not in all_exported_html()]
    return internal_html, internal_assets, local_hrefs


def bfs_from_home() -> list[str]:
    html_files = all_exported_html()
    seen = set()
    queue = deque(["home.html"])
    order: list[str] = []

    while queue:
        cur = queue.popleft()
        if cur in seen:
            continue
        if cur not in html_files:
            continue
        seen.add(cur)
        order.append(cur)
        cur_links, _, _ = scan_refs(EXAMPLES / cur)
        for nxt in cur_links:
            if nxt not in seen:
                queue.append(nxt)

    return order


def check_local_refs_exist() -> list[str]:
    missing: list[str] = []
    for page in sorted(all_exported_html()):
        links, assets, local_hrefs = scan_refs(EXAMPLES / page)
        for ref in [*assets, *local_hrefs]:
            if ref.startswith(("http://", "https://", "#")):
                continue
            if not (EXAMPLES / ref).exists():
                missing.append(f"{page} -> {ref}")
    return missing


def check_server_routes() -> list[str]:
    urls = [
        "http://127.0.0.1:8000/examples/home",
        "http://127.0.0.1:8000/examples/2023%2006%20Kpop%20rhythm%20game%20Duet%20tae-bo%2034611511877d812cb5ead719e93355c4.html",
        "http://127.0.0.1:8000/examples/Metaverse%20Events%2034611511877d81269921e3abbd1856d2.html",
        "http://127.0.0.1:8000/examples/premium-theme.css",
    ]
    results = []
    for url in urls:
        with urllib.request.urlopen(url, timeout=5) as resp:
            results.append(f"{resp.status} {url}")
    return results


def check_responsive_css() -> dict[str, bool]:
    css = (EXAMPLES / "premium-theme.css").read_text(encoding="utf-8")
    checks = {
        "mobile breakpoint": "@media (max-width: 767px)" in css,
        "tablet breakpoint": "@media (min-width: 768px) and (max-width: 1024px)" in css,
        "desktop breakpoint": "@media (min-width: 1025px)" in css,
        "overflow guard": "overflow-x: clip;" in css,
        "fluid typography": "clamp(" in css,
    }
    return checks


def main() -> None:
    assert HOME.exists(), "home.html missing"

    exported = all_exported_html()
    reachable = bfs_from_home()
    unreachable = sorted(exported - set(reachable))
    missing_refs = check_local_refs_exist()
    css_checks = check_responsive_css()

    proc = Popen(SERVER_CMD, cwd=ROOT)
    sleep(1)
    try:
        routes = check_server_routes()
    finally:
        proc.terminate()
        proc.wait(timeout=5)

    print("ENTRY:", HOME.name)
    print("TOTAL_HTML:", len(exported))
    print("REACHABLE_FROM_HOME:", len(reachable))
    print("UNREACHABLE:", unreachable)
    print("MISSING_LOCAL_REFS:", missing_refs)
    print("ROUTES:")
    for r in routes:
        print(" ", r)
    print("RESPONSIVE_CHECKS:")
    for k, v in css_checks.items():
        print(f"  {k}: {v}")

    if unreachable or missing_refs or not all(css_checks.values()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
