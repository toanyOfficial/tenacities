#!/usr/bin/env python3
"""Serve the exported `examples/` site as a multi-page experience.

Routes:
- /examples/home -> /examples/home.html
- /examples/home/ -> /examples/home.html
- /examples/<exported-file>.html and asset files are served directly.

Design system:
- Injects a shared stylesheet for all exported HTML pages at response time.
- Source HTML content remains untouched.
"""

from __future__ import annotations

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
EXAMPLES_DIR = ROOT / "examples"
THEME_HREF = "/examples/premium-theme.css"


class ExamplesHandler(SimpleHTTPRequestHandler):
    def _normalized_request_path(self, request_path: str) -> str:
        parsed_path = urlparse(request_path).path
        normalized = unquote(parsed_path)

        if normalized in {"/", ""}:
            normalized = "/examples/home"

        if normalized in {"/examples/home", "/examples/home/"}:
            normalized = "/examples/home.html"

        return normalized

    def translate_path(self, path: str) -> str:  # noqa: D401
        """Map /examples/home to /examples/home.html and serve static files."""
        request_path = self._normalized_request_path(path)

        if request_path.startswith("/"):
            request_path = request_path[1:]

        full_path = ROOT / request_path

        if full_path.is_dir():
            index = full_path / "index.html"
            if index.exists():
                return str(index)

        return str(full_path)

    def _is_exported_html_request(self) -> bool:
        request_path = self._normalized_request_path(self.path)
        if not request_path.startswith("/examples/"):
            return False
        return request_path.endswith(".html")

    @staticmethod
    def _inject_theme(html: str) -> str:
        theme_tag = f'<link rel="stylesheet" href="{THEME_HREF}"/>'

        if THEME_HREF in html:
            return html

        if "</head>" in html:
            return html.replace("</head>", f"{theme_tag}</head>", 1)

        return f"{theme_tag}{html}"

    def do_GET(self) -> None:  # noqa: N802
        if self._is_exported_html_request():
            file_path = Path(self.translate_path(self.path))
            if not file_path.exists() or not file_path.is_file():
                self.send_error(404, "File not found")
                return

            html = file_path.read_text(encoding="utf-8")
            themed_html = self._inject_theme(html)
            payload = themed_html.encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        super().do_GET()


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
