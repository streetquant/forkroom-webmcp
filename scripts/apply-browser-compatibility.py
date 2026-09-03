from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(path: str, old: str, new: str) -> None:
    target = ROOT / path
    text = target.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected exactly one anchor, found {count}: {old[:80]!r}")
    target.write_text(text.replace(old, new, 1), encoding="utf-8")


def replace_all(path: str, old: str, new: str, *, minimum: int = 1) -> None:
    target = ROOT / path
    text = target.read_text(encoding="utf-8")
    count = text.count(old)
    if count < minimum:
        raise RuntimeError(f"{path}: expected at least {minimum} matches, found {count}: {old[:80]!r}")
    target.write_text(text.replace(old, new), encoding="utf-8")


# Runtime: prefer the current API and retain the pre-Chromium-150 location.
replace_once(
    "src/webmcp/protocol.ts",
    "  const modelContext = document.modelContext\n",
    "  const modelContext = document.modelContext ?? navigator.modelContext\n",
)

# Browser contract typing.
replace_once(
    "src/webmcp/webmcp.d.ts",
    """  interface Document {
    readonly modelContext?: WebMcpModelContext
  }

  interface Window {
""",
    """  interface Document {
    readonly modelContext?: WebMcpModelContext
  }

  interface Navigator {
    /** Deprecated pre-Chromium-150 location retained for challenge-browser compatibility. */
    readonly modelContext?: WebMcpModelContext
  }

  interface Window {
""",
)

# Test cleanup must reset both locations.
replace_once(
    "src/webmcp/protocol.test.ts",
    """afterEach(() => {
  Object.defineProperty(document, 'modelContext', {
    configurable: true,
    value: undefined,
  })
  delete window.__FORKROOM_DEVTOOLS__
})
""",
    """afterEach(() => {
  Object.defineProperty(document, 'modelContext', {
    configurable: true,
    value: undefined,
  })
  Object.defineProperty(navigator, 'modelContext', {
    configurable: true,
    value: undefined,
  })
  delete window.__FORKROOM_DEVTOOLS__
})
""",
)

# Prove the entire tool surface registers through the legacy-only path.
replace_once(
    "src/webmcp/protocol.test.ts",
    """  it('keeps a development inspector available when the browser lacks WebMCP', () => {
""",
    """  it('falls back to the legacy navigator location when the current document API is absent', async () => {
    const registered: WebMcpToolDefinition[] = []
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(navigator, 'modelContext', {
      configurable: true,
      value: {
        registerTool: vi.fn(async (tool: WebMcpToolDefinition) => {
          registered.push(tool)
        }),
      },
    })
    const harness = createHarness()

    const cleanup = registerForkRoomTools(harness.bridge)
    await vi.waitFor(() => expect(registered).toHaveLength(FORKROOM_TOOL_COUNT))

    expect(harness.statuses.at(-1)).toMatchObject({
      supported: true,
      registered: FORKROOM_TOOL_COUNT,
      total: FORKROOM_TOOL_COUNT,
    })
    cleanup()
  })

  it('keeps a development inspector available when the browser lacks WebMCP', () => {
""",
)

replace_once(
    "src/App.test.tsx",
    """beforeEach(() => {
  Object.defineProperty(document, 'modelContext', {
    configurable: true,
    value: undefined,
  })
})
""",
    """beforeEach(() => {
  Object.defineProperty(document, 'modelContext', {
    configurable: true,
    value: undefined,
  })
  Object.defineProperty(navigator, 'modelContext', {
    configurable: true,
    value: undefined,
  })
})
""",
)

# Static gate: a future refactor cannot silently remove compatibility.
replace_once(
    "scripts/validate-webmcp.mjs",
    "invariant(protocol.includes('modelContext.registerTool(tool'), 'production code invokes the imperative registerTool API')\n",
    """invariant(protocol.includes('modelContext.registerTool(tool'), 'production code invokes the imperative registerTool API')
invariant(
  protocol.includes('document.modelContext ?? navigator.modelContext'),
  'current document API is preferred with a legacy navigator fallback',
)
""",
)

# Machine-readable discovery metadata.
replace_once(
    "public/.well-known/webmcp.json",
    '  "runtimeApi": "document.modelContext",\n',
    '  "runtimeApi": "document.modelContext",\n  "legacyRuntimeFallback": "navigator.modelContext",\n',
)

# Human-facing documentation.
replace_once(
    "PLAN.md",
    "- [x] Real `document.modelContext.registerTool(...)` implementation.\n",
    "- [x] Real `document.modelContext.registerTool(...)` implementation with a deprecated `navigator.modelContext` compatibility fallback.\n",
)
replace_once(
    "README.md",
    "In a WebMCP-capable browser, the page registers the same definitions through `document.modelContext.registerTool(...)`.\n",
    "In a WebMCP-capable browser, the page prefers `document.modelContext.registerTool(...)` and falls back to the deprecated `navigator.modelContext` location used by earlier challenge-browser builds.\n",
)
replace_once(
    "docs/SUBMISSION.md",
    "- imperative `document.modelContext.registerTool(...)` integration\n",
    "- imperative `document.modelContext.registerTool(...)` integration with legacy `navigator.modelContext` fallback\n",
)
replace_once(
    "docs/ARCHITECTURE.md",
    "  Agent[Browser agent] -->|document.modelContext| Bridge\n",
    "  Agent[Browser agent] -->|document.modelContext; legacy navigator fallback| Bridge\n",
)

# Release version metadata.
replace_once("package.json", '  "version": "1.0.0",\n', '  "version": "1.0.2",\n')
replace_all("package-lock.json", '"version": "0.0.0"', '"version": "1.0.2"', minimum=2)

# Package v1.0.2 from the final verified commit.
workflow = ROOT / ".github/workflows/package-submission.yml"
text = workflow.read_text(encoding="utf-8")
for old, new in (
    ("forkroom-release-v1.0.1", "forkroom-release-v1.0.2"),
    ("release v1.0.1", "release v1.0.2"),
    ("RELEASE_TAG: v1.0.1", "RELEASE_TAG: v1.0.2"),
    ("ForkRoom-WebMCP-Submission-v1.0.1", "ForkRoom-WebMCP-Submission-v1.0.2"),
    ("forkroom-submission-v1.0.1", "forkroom-submission-v1.0.2"),
    ("Deterministic tests: 25", "Deterministic tests: 26"),
    ("ForkRoom v1.0.1 — verified WebMCP Challenge package", "ForkRoom v1.0.2 — cross-version WebMCP compatibility"),
):
    if old not in text:
        raise RuntimeError(f"package workflow anchor missing: {old}")
    text = text.replace(old, new)
workflow.write_text(text, encoding="utf-8")

# Keep stated test evidence accurate.
for relative in (
    "README.md",
    "PLAN.md",
    "docs/ADVERSARIAL_REVIEW.md",
    "docs/DEMO_SCRIPT.md",
    "docs/JUDGE_CARD.md",
    "docs/SUBMISSION.md",
    "docs/VERIFICATION.md",
):
    target = ROOT / relative
    text = target.read_text(encoding="utf-8")
    replacements = (
        ("25 deterministic tests", "26 deterministic tests"),
        ("25 passing deterministic tests", "26 passing deterministic tests"),
        ("25 passing tests", "26 passing tests"),
        ("25 passed across 4 files", "26 passed across 4 files"),
        ("all 25 deterministic tests", "all 26 deterministic tests"),
        ("25 tests", "26 tests"),
    )
    for old, new in replacements:
        text = text.replace(old, new)
    target.write_text(text, encoding="utf-8")

# Add the verification and adversarial-review record.
replace_once(
    "docs/VERIFICATION.md",
    "### 2. Domain analysis tests\n",
    """### Cross-version API compatibility

ForkRoom resolves the browser endpoint as `document.modelContext ?? navigator.modelContext`. The current document-scoped API always wins when both exist. A focused protocol test removes the document endpoint, supplies only the legacy navigator endpoint, and requires all 16 tools plus a fully registered status. The static audit also checks the exact current-first fallback expression.

### 2. Domain analysis tests
""",
)
replace_once(
    "docs/ADVERSARIAL_REVIEW.md",
    "## Remaining model criticism\n",
    """### AR-21 · Browser API location drift

**Attack/failure:** A judge opens ForkRoom in an earlier Chromium origin-trial or challenge-browser build that still exposes `navigator.modelContext`; the UI works, but no native tools register because the app probes only the newer document-scoped API.

**Resolution:** Registration now resolves `document.modelContext ?? navigator.modelContext`, preserving the current API while supporting the deprecated location. A protocol test requires all 16 tools through the legacy-only path, and the static contract audit verifies the current-first ordering.

**Status:** Closed; tested.

## Remaining model criticism
""",
)

# Replace release notes with the final v1.0.2 statement.
(ROOT / "docs/RELEASE_NOTES.md").write_text(
    """# ForkRoom v1.0.2 — cross-version WebMCP compatibility

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
""",
    encoding="utf-8",
)

print("Applied current-first WebMCP compatibility and prepared v1.0.2.")
