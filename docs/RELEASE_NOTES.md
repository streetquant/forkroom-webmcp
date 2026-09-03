# ForkRoom v1.0.2 — cross-version WebMCP compatibility

**See the future before you choose it.**

ForkRoom is a live decision multiverse where humans own values and authority while agents inspect, compare, stress-test, navigate, and stage structured changes through 16 imperative WebMCP tools.

This release supersedes `v1.0.1`. It preserves the current `document.modelContext` API as the preferred path and adds a narrow fallback to the deprecated `navigator.modelContext` location still present in older Chromium origin-trial and challenge-browser builds. A new protocol test proves all 16 tools register through the fallback, and the static contract audit now rejects a build that drops either the current-first ordering or compatibility path.

## Judge paths

- Live self-contained preview: https://htmlpreview.github.io/?https://github.com/streetquant/forkroom-webmcp/blob/live/standalone.html
- CDN fallback: https://raw.githack.com/streetquant/forkroom-webmcp/live/index.html
- 50-second narrated demo: https://drive.google.com/file/d/1SHYTAq-y0NPZjoi5L30PPboSveiUsm_2/view
- Fast judge card: https://github.com/streetquant/forkroom-webmcp/blob/main/docs/JUDGE_CARD.md
- Paste-ready submission: https://github.com/streetquant/forkroom-webmcp/blob/main/docs/SUBMISSION.md
- Verification evidence: https://github.com/streetquant/forkroom-webmcp/blob/main/docs/VERIFICATION.md

## Release properties

- 16 unique semantic WebMCP tools
- current `document.modelContext` API preferred
- legacy `navigator.modelContext` fallback for earlier browser builds
- 8 read-only analytical tools
- 1 presentation-only navigation tool
- 7 human-reviewed proposal tools
- no agent self-approval or rejection capability
- closed JSON Schemas plus independent runtime validation
- invocation-time reads of current browser state
- explicit untrusted-content and uncertainty notices
- Judge demo executed through the real registered tool handlers
- 26 deterministic tests
- zero-warning lint
- self-contained artifact that must parse and boot with all 16 tools before publication
- self-verifying release package with portable SHA-256 files

## Included release assets

`ForkRoom-WebMCP-Submission-v1.0.2.zip` contains the exact tagged source, verified portable build, self-contained `standalone.html`, screenshots, discovery metadata, all judge documentation, a release manifest, and per-file SHA-256 checksums.

Verify the accompanying checksum from the download directory:

```bash
sha256sum -c ForkRoom-WebMCP-Submission-v1.0.2.zip.sha256
```

## Reproduce

```bash
npm ci
node scripts/validate-webmcp.mjs
npm run lint
npm test -- --reporter=verbose
VITE_BASE_PATH=./ npm run build
node scripts/build-standalone.mjs
node scripts/smoke-standalone.mjs
```

## Scope boundary

The seeded scores and future probabilities are structured judgments, not causal estimates or guaranteed forecasts. The public challenge preview is not intended for confidential decision data.
