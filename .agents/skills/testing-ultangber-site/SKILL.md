---
name: testing-ultangber-site
description: Test the ULTANGBER static landing page end-to-end. Use when verifying UI, i18n, download links, or asset changes in this repo.
---

# Testing the ULTANGBER Landing Page

## Setup
- Pure static site (index.html, style.css, main.js, assets/) — no build step, no dependencies.
- Serve locally: `python3 -m http.server 8080` from the repo root, then open http://localhost:8080/.
- No credentials or secrets are needed for local testing.

## Key behaviors to verify
- **Language toggle**: the flag button (top right, `#langToggleBtn`) switches between Malay (default) and English. All bilingual content uses `data-lang-show="ms"` / `"en"` spans — when adding content, always add both variants or one language will show the wrong text.
- **Download section (`#muat-turun`)**: buttons must point to files that actually exist under `assets/downloads/` (papan-cabaran.pdf, kad-kuasa.pdf, buku-panduan.pdf). Broken links might silently produce 404 downloads — verify downloaded files start with `%PDF` (`head -c 5 file | od -c`).
- **Images use `onerror` fallbacks** that hide themselves when the path is wrong, so a broken image path may fail *silently* (blank area instead of a broken-image icon). Cross-check `src` paths in index.html against `ls assets/` rather than trusting the visual.
- **Nav dropdowns / smooth scroll**: use the "Resources → Download" dropdown to reach sections; anchor scrolling is offset by the header height.

## Tips
- Chrome downloads land in `~/Downloads`; clear it before testing (`rm -f ~/Downloads/*.pdf`) so you can assert exactly which files were downloaded.
- HTML sanity check without a linter: parse index.html with Python's `html.parser` to catch unbalanced tags.
- The Tally feedback iframe and external links (ultangber.onrender.com, play-ultangber.vercel.app) depend on external services and may be slow/unavailable — don't treat that as a repo bug.

## Devin Secrets Needed
- None.
