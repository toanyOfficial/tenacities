# Multi-page routing for exported `examples/` site

Entry point:
- `http://127.0.0.1:8000/examples/home` → serves `examples/home.html`

Page routing:
- Every exported HTML file under `examples/` is served as its own page route at:
  - `http://127.0.0.1:8000/examples/<exact-exported-filename>.html`

Assets:
- All referenced assets under `examples/` are served directly using their original file names.

This keeps the original export hierarchy and navigation intact without flattening pages.
