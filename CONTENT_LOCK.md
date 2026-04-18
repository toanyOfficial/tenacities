# Content Preservation Lock

The exported source under `examples/` is treated as immutable content.

This repository now enforces preservation of:
- exact HTML bytes per page
- page boundaries (all exported HTML pages remain separate)
- internal page-to-page links
- traversal reachability from `examples/home.html`
- heading order (`h1`/`h2`/`h3`) inside each page

## Verification

Run:

```bash
python verify_content_lock.py
```

If any content, structure, or link relationship changes, verification fails.

This lock enables future visual/design improvements without altering source content or page structure.
