# ForkRoom v1.0.1 — verified WebMCP Challenge package

**See the future before you choose it.**

ForkRoom is a live decision multiverse where humans own values and authority while agents inspect, compare, stress-test, navigate, and stage structured changes through 16 imperative WebMCP tools.

This release supersedes `v1.0.0`. The application capability is unchanged; `v1.0.1` makes the external ZIP checksum portable and preserves the literal `source/`, `build/`, and `standalone.html` paths in the downloaded manifest. Both defects were found by independently downloading and checking the first release outside GitHub Actions.

## Judge paths

- Live self-contained preview: https://htmlpreview.github.io/?https://github.com/streetquant/forkroom-webmcp/blob/live/standalone.html
- CDN fallback: https://raw.githack.com/streetquant/forkroom-webmcp/live/index.html
- 50-second narrated demo: https://drive.google.com/file/d/1SHYTAq-y0NPZjoi5L30PPboSveiUsm_2/view
- Fast judge card: https://github.com/streetquant/forkroom-webmcp/blob/main/docs/JUDGE_CARD.md
- Paste-ready submission: https://github.com/streetquant/forkroom-webmcp/blob/main/docs/SUBMISSION.md
- Verification evidence: https://github.com/streetquant/forkroom-webmcp/blob/main/docs/VERIFICATION.md

## Release properties

- 16 unique semantic WebMCP tools
- 8 read-only analytical tools
- 1 presentation-only navigation tool
- 7 human-reviewed proposal tools
- no agent self-approval or rejection capability
- closed JSON Schemas plus independent runtime validation
- invocation-time reads of current browser state
- explicit untrusted-content and uncertainty notices
- transparent robust score, downside, regret, fragility, and rank-reversal analysis
- responsive Map, Matrix, Futures, and Audit views
- local persistence, import/export, undo, attribution, and commitment guardrails
- Judge demo executed through the real registered tool handlers
- 25 deterministic tests
- zero-warning lint
- portable production build
- self-contained artifact that must parse and boot with all 16 tools before publication
- self-verifying release package with portable SHA-256 files

## Included release assets

`ForkRoom-WebMCP-Submission-v1.0.1.zip` contains:

- complete source at the tagged commit;
- the verified portable production build;
- `standalone.html`, the self-contained judge artifact;
- screenshots and public discovery metadata;
- architecture, security, adversarial-review, verification, demo, judge, and submission documents;
- a release manifest and per-file SHA-256 checksums.

The accompanying `.sha256` file can be checked from the download directory with:

```bash
sha256sum -c ForkRoom-WebMCP-Submission-v1.0.1.zip.sha256
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

The seeded scores and future probabilities are structured judgments, not causal estimates or guaranteed forecasts. The public challenge preview is not intended for confidential decision data. See `docs/SECURITY.md` and `docs/ADVERSARIAL_REVIEW.md` for the complete trust model and residual risks.
