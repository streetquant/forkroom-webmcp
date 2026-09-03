# ForkRoom

> **See the future before you choose it.**

ForkRoom is a live decision multiverse where people and browser agents build, challenge, and stress-test consequential choices together. It is an entry for the [OpenAI WebMCP Challenge](https://openai.com/webmcp-challenge/).

The application is being built in public during the challenge window. The implementation plan and analytical contract are in [`PLAN.md`](./PLAN.md).

## Why WebMCP

A consequential decision is not a one-shot prompt. It is a shared, evolving state containing options, values, assumptions, scenarios, uncertainty, and commitments. WebMCP lets an agent operate on that exact browser-local state while the human sees every proposal in context and remains in control.

ForkRoom uses WebMCP for four distinct jobs:

1. **Observe** the current decision model without brittle DOM scraping.
2. **Analyze** option robustness, fragile assumptions, regret, and rank reversals.
3. **Propose** additions or changes through narrow structured schemas.
4. **Collaborate safely** by staging every substantive agent mutation for human approval, with audit history and undo.

## Status

Active implementation. A working deployment, full tool catalogue, screenshots, demo prompts, architecture notes, verification evidence, and submission materials will be added in subsequent milestone commits.

## Development

```bash
npm install
npm run dev
```

## License

MIT © 2026 Shayan Banerjee
