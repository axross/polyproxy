---
name: code-review-guidelines
description: |
  Rules for reviewing diffs in this Next.js URL proxy. Use when reviewing a pull request or local diff: covers review scope, severity, evidence and citation format, tone, escalation boundaries, and routing to security, QA, maintainability, observability, development, and project-structure skills.
---

# Code Review Guidelines

Apply these rules at the start of every code review, regardless of the change type or domain.

## Review Scoping

Review scope starts with the diff, then expands only far enough to verify integration with callers, callees, tests, and public docs.

**Guidelines:**

- SHOULD read [scoping.md](./references/scoping.md) before reviewing a non-trivial diff.
- MUST review every changed file in full.
- SHOULD inspect callers, callees, tests, README, and config when the changed behavior depends on them.

## Severity

Severity communicates merge risk. Bridge-specific privacy, validation, build, and dependency issues have fixed minimum levels.

**Guidelines:**

- SHOULD read [severity.md](./references/severity.md) when classifying findings.
- MUST apply severity floors for security, data exposure, build, validation, test, and dependency issues.
- MUST NOT inflate stylistic preferences into blocking findings.

## Evidence

Findings should lead the report and be trivially actionable. Each one needs a location, quote, guideline, severity, and concrete consequence.

**Guidelines:**

- SHOULD read [evidence.md](./references/evidence.md) when composing a review report.
- MUST put findings before summary or background in review output.
- MUST cite file paths and line numbers for every finding.
- MUST include enough quoted code and context for the author to apply the fix without rediscovering the issue.

## Tone

Review language should be direct, specific, and focused on code behavior. Uncertain product intent should be phrased as a question.

**Guidelines:**

- SHOULD read [tone.md](./references/tone.md) when turning an observation into a review finding.
- MUST explain why each finding matters.
- MUST distinguish rules from preferences.

## Escalation

Review-only work reports findings; it does not modify files or make product decisions for the caller.

**Guidelines:**

- SHOULD read [escalation.md](./references/escalation.md) when a review reaches scope, product, verification, or command boundaries.
- MUST NOT mutate files during a review-only task.
- SHOULD recommend existing verification commands rather than nonexistent scripts.

## Topic-Specific Guidelines

Each review lens has a source skill. Link to that source instead of restating long rules in the review.

**Guidelines:**

- MUST consult [Application Security Requirements](../application-security-requirements/SKILL.md) for payload decoding, validation, Obsidian URI construction, source URLs, env vars, indexing, or dependencies.
- MUST consult [Quality Assurance Guidelines](../quality-assurance-guidelines/SKILL.md) for tests, snapshots, flaky behavior, manual verification, or QA evidence.
- SHOULD consult [Maintainable Code Guidelines](../maintainable-code-guidelines/SKILL.md) for readability, naming, complexity, boundaries, comments, or scope discipline.
- SHOULD consult [Observability Guidelines](../observability-guidelines/SKILL.md) for expected invalid links, thrown errors, diagnostics, logging, Sentry error tracking, or telemetry.
- SHOULD consult [Development Guidelines](../development-guidelines/SKILL.md) for App Router, command sequence, dependencies, or implementation workflow.
- SHOULD consult [Project Structure](../project-structure/SKILL.md) for new files, moved files, route structure, or import paths.
- MUST consult [Agent Skills Best Practices](../agent-skills-best-practices/SKILL.md) for agent skill changes, reference files, or `AGENTS.md` index sync.
