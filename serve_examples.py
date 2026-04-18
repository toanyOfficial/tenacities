#!/usr/bin/env python3
"""Serve the exported `examples/` site as a multi-page experience.

Routes:
- /examples/home -> /examples/home.html
- /examples/home/ -> /examples/home.html
- /examples/<exported-file>.html and asset files are served directly.
"""

from __future__ import annotations

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
EXAMPLES_DIR = ROOT / "examples"


class ExamplesHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:  # noqa: D401
        """Map /examples/home to /examples/home.html and serve static files."""
        parsed_path = urlparse(path).path
        request_path = unquote(parsed_path)

        if request_path in {"/", ""}:
            request_path = "/examples/home"

        if request_path in {"/examples/home", "/examples/home/"}:
            request_path = "/examples/home.html"

        if request_path.startswith("/"):
            request_path = request_path[1:]

        full_path = ROOT / request_path

        if full_path.is_dir():
            index = full_path / "index.html"
            if index.exists():
                return str(index)

        return str(full_path)


def main() -> None:
    host = "127.0.0.1"
    port = 8000

    if not EXAMPLES_DIR.exists():
        raise SystemExit("examples/ directory not found")

    server = ThreadingHTTPServer((host, port), ExamplesHandler)
    print(f"Serving exported site at http://{host}:{port}/examples/home")
    server.serve_forever()


if __name__ == "__main__":
    main()
