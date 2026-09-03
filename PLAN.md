# ForkRoom execution plan

## Product thesis

ForkRoom is a live decision multiverse for choices that cannot fit in a chat. A human supplies values, constraints, and authority. An agent expands the option space, challenges assumptions, and stress-tests alternative futures through narrowly scoped WebMCP tools. Every agent-authored mutation is staged in the visible page, attributable, selectively approvable, rejectable, and reversible.

## Judging strategy

| Criterion | Product evidence |
| --- | --- |
| WebMCP leverage | A broad but narrow-scope tool surface spanning inspection, comparison, stress testing, navigation, proposals, challenges, branching, and commitments. Schemas are closed, runtime-validated, annotated, and mapped to the same application logic as the human UI. |
| Execution | A complete local-first application with a seeded scenario, editing, persistence, audit trail, export/import, responsive design, accessibility, tests, production deployment, and a guided demo. |
| Potential impact | Decision teams can expose hidden assumptions, value disagreements, rank reversals, and option robustness before committing money or policy. |
| Creativity & ambition | The browser page becomes a shared, branchable decision world. The agent does not merely fill a form or operate a CRUD interface; it helps construct and falsify a model while the human remains sovereign. |

## Analytical model

For option `i`, criterion `j`, scenario `s`, and assumption `a`:

- `w_j` is the normalized criterion weight.
- `x_ij` is the option score on the criterion, normalized to `[0, 100]`.
- `p_s` is the normalized scenario probability.
- `m_is` is the scenario impact on the option.
- `c_a` is confidence in an assumption.
- `e_ia` is the option's exposure to the assumption.
- `q_a` is the assumption's decision impact.

The base value is `B_i = Σ_j w_j x_ij`.
The expected scenario adjustment is `M_i = Σ_s p_s m_is`.
The assumption penalty is `A_i = Σ_a (1-c_a) q_a |e_ia|` after scale normalization.
The scenario dispersion `σ_i` measures downside uncertainty.

The displayed robust score is:

`R_i = clamp(B_i + M_i - ρ(A_i + σ_i), 0, 100)`

where `ρ ∈ [0, 1]` is controlled by the human's caution slider. ForkRoom also computes worst-case score, regret, sensitivity to criterion weights, and rank reversals. These are decision aids, not claims of causal truth.

## Delivery sequence

1. Domain model, deterministic analysis engine, and seeded climate-resilience decision.
2. Responsive visual workspace: map, matrix, futures, and audit views.
3. WebMCP protocol layer with secure schemas and visible proposal staging.
4. Persistence, undo, import/export, guided demo, keyboard support, and reduced-motion behavior.
5. Unit and integration tests, schema verification, lint, and production build.
6. Public milestone push and judge-accessible deployment.
7. Adversarial review for stale state, unsafe mutation, misleading output, prompt-injection surfaces, accessibility, and mobile regressions.
8. Submission package: README, architecture, test instructions, Devpost copy, screenshot, and under-three-minute video script.
9. Final acceptance run, release commit, and tag.

## Hard gates

- Public repository with a visible open-source license.
- Working live URL with no login requirement.
- Real `document.modelContext.registerTool(...)` implementation.
- All agent-authored substantive changes require explicit human approval.
- Tool inputs use closed JSON Schemas and independent runtime validation.
- Read-only tools declare `readOnlyHint`.
- All outputs identify uncertainty and avoid claiming causal or factual certainty.
- No external API key or paid service is required.
- Production build, tests, lint, and deployment smoke checks pass.
