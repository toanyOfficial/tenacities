# Multi-page routing for exported `examples/` site

Entry point:
- `http://127.0.0.1:8000/examples/home` → serves `examples/home.html`

Page routing:
- Every exported HTML file under `examples/` is served as its own page route at:
  - `http://127.0.0.1:8000/examples/<exact-exported-filename>.html`

Assets:
- All referenced assets under `examples/` are served directly using their original file names.

Theme application:
- `serve_examples.py` injects a shared stylesheet (`/examples/premium-theme.css`) into HTML responses at runtime.
- Source HTML files are not modified, so page boundaries/content structure remain intact.

This keeps the original export hierarchy and navigation intact without flattening pages.
