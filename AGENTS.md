# AGENTS.md

## Project Overview

This repository is `polyproxy`, a small Hono URL proxy Cloudflare Worker for `open.axross.dev` designed to host multiple proxy route types over time. The currently implemented proxy is the Obsidian deeplink route: `/ob/:query` decodes a base64url-encoded JSON payload, emits Open Graph metadata for crawlers such as Discord, and gives human visitors a browser-mediated path into `obsidian://open`.

The app is intentionally stateless. Proxy routes do not store target metadata or host target content. The current Obsidian route treats base64url as obfuscation only.

## Requirement Level Keywords

Apply these keywords consistently in agent skills and the documents linked from agent skills.

| Keyword | Synonym | Meaning |
| ------- | ------- | ------- |
| "MUST" | "REQUIRED" | Non-negotiable requirement; no exceptions. |
| "MUST NOT" |  | Non-negotiable prohibition; no exceptions. |
| "SHOULD" | "RECOMMENDED" | Strongly preferred; deviation is allowed only after weighing the implications. |
| "SHOULD NOT" | "NOT RECOMMENDED" | Strongly discouraged; allowed only after weighing the implications. |
| "MAY" | "OPTIONAL" | Genuinely optional; no preference implied. |

## Skill Index

| Skill | When to apply |
| ----- | ------------- |
| [Agent Skills Best Practices](.agents/skills/agent-skills-best-practices/SKILL.md) | Creating, refining, splitting, or auditing agent skills |
| [Application Security Requirements](.agents/skills/application-security-requirements/SKILL.md) | Reviewing secrets, proxy payload validation, URL handling, privacy exposure, or npm dependency risk |
| [Code Review Guidelines](.agents/skills/code-review-guidelines/SKILL.md) | Reviewing a diff or pull request |
| [Development Guidelines](.agents/skills/development-guidelines/SKILL.md) | Implementing, refactoring, running commands, or preparing changes |
| [E2E Test Guidelines](.agents/skills/e2e-test-guidelines/SKILL.md) | Writing, running, reviewing, or maintaining Playwright E2E tests, route coverage, browser traces, or snapshots |
| [Maintainable Code Guidelines](.agents/skills/maintainable-code-guidelines/SKILL.md) | Evaluating readability, boundaries, naming, comments, or scope discipline |
| [Observability Guidelines](.agents/skills/observability-guidelines/SKILL.md) | Handling errors, expected invalid links, runtime diagnostics, structured Worker logging, Sentry error tracking, or telemetry |
| [Project Structure](.agents/skills/project-structure/SKILL.md) | Locating files, placing new code, or choosing import paths |
| [Quality Assurance Guidelines](.agents/skills/quality-assurance-guidelines/SKILL.md) | Writing tests, checking verification evidence, investigating flaky tests, or reviewing QA coverage |

## Response Approach

Use this workflow for single-agent work in this repository. The agent owns planning, implementation, investigation, verification, and reporting directly unless the user explicitly asks for delegation.

### Overall Strategy

Follow this ordered strategy for non-trivial work. Small answer-only requests may compress the sequence, but the same decision order still applies.

1. Classify the request and load the relevant project guidance.
2. Define success criteria, constraints, affected surface, dependencies, and verification expectations.
3. Inspect the smallest useful context and draft an ordered local workflow.
4. Implement, investigate, or review within the narrowest surface that satisfies the criteria.
5. Self-review the result against the applicable skills and fix blocking findings.
6. Run or report the relevant verification.
7. Update or propose skill guidance when the work exposes reusable project learning.
8. Summarize the outcome, verification status, trade-offs, and open follow-ups.

**Guidelines:**

- MUST follow the ordered strategy for non-trivial implementation, review, investigation, and skill-maintenance work.
- SHOULD compress the strategy for small, single-file, or answer-only requests without skipping relevant safety checks.
- MUST own source inspection, investigation, debugging, implementation, self-review, verification, and reporting locally unless the user explicitly asks for delegation.
- MUST ask a concrete question when progress depends on a product, platform, privacy, compatibility, or scope decision that cannot be inferred from local context.

### 1. Classify and Load Guidance

Classify the request before touching files so the right local rules are active. Most work falls into one or more of these classes: UI-bearing, implementation-only, review-only, skill-maintenance, exploratory, or mixed workflow.

**Guidelines:**

- MUST consult [Development Guidelines](.agents/skills/development-guidelines/SKILL.md) before non-trivial implementation, refactoring, command execution, or release-prep work.
- MUST identify whether the task is UI-bearing, implementation-only, review-only, skill-maintenance, exploratory, or a mixed workflow.
- MUST consult the relevant indexed skills when the request touches security, review, maintainability, observability, project structure, QA, or agent-skill rules.
- MUST consult current Hono documentation before changing routing, middleware, JSX rendering, static assets, or runtime adapter behavior.
- MUST consult current Sentry Hono/Cloudflare documentation before changing Sentry initialization, middleware, or source-map/error-capture configuration.
- SHOULD keep skill loading narrow by opening only the references needed for the classified task.

### 2. Define Success Criteria

Success criteria turn the request into a checkable target. They should name what changes, what must stay unchanged, and how completion will be verified.

**Guidelines:**

- MUST restate the user request as success criteria, constraints, affected surface, and verification expectations when the workflow is non-trivial.
- MUST identify behavior that must be preserved, especially proxy URL shape, validation behavior, metadata output, route paths, privacy posture, and configuration semantics.
- MUST mark dependencies between steps, including which findings, files, commands, or user decisions block the next step.
- SHOULD keep criteria lightweight for small, single-file, or answer-only requests.

### 3. Plan the Local Workflow

Plan the work as an ordered local workflow before making non-trivial edits. The plan should make dependencies visible and keep the change scoped to the smallest useful surface.

**Guidelines:**

- MUST draft an ordered workflow with inputs, dependencies, and acceptance criteria before making non-trivial edits.
- MUST establish UI intent before implementing UI-bearing changes, including hierarchy, interaction states, accessibility intent, responsive behavior, and copy constraints.
- MUST identify which files or directories are likely to be read or edited before starting broad source inspection.
- SHOULD inspect independent discovery targets in parallel when their outputs do not depend on each other.
- SHOULD revise the plan when new evidence changes the affected surface or acceptance criteria.

### 4. Execute the Work

Execution includes investigation, implementation, refactoring, review, and skill maintenance. Keep edits narrow, follow existing project patterns, and avoid speculative structure.

**Guidelines:**

- MUST implement within the smallest affected surface that satisfies the acceptance criteria.
- MUST follow existing `src/**`, `src/helpers/**`, `src/routes/**`, `src/views/**`, colocated `*.test.ts`, configuration, and skill-directory patterns before adding new structure.
- MUST preserve public behavior during refactors unless the requested change intentionally modifies it.
- MUST NOT combine unrelated app behavior, styling, dependency, documentation, and skill-maintenance changes unless the user explicitly asks for that scope.
- SHOULD keep implementation notes focused on decisions and blockers rather than every local inspection step.

### 5. Self-Review and Iterate

Quality gates define what "done" means for this project. The agent should calibrate the review lens before judging its own work, then treat unresolved high-risk findings as blockers.

**Guidelines:**

- MUST consult [Quality Assurance Guidelines](.agents/skills/quality-assurance-guidelines/SKILL.md) and [Code Review Guidelines](.agents/skills/code-review-guidelines/SKILL.md) before reviewing non-trivial code or test changes.
- MUST self-review changed files after implementation, using the relevant skills from the skill index.
- MUST evaluate the final diff against the stated acceptance criteria before reporting completion.
- MUST treat Critical or Major self-review findings, explicit failing verification, and unresolved public-behavior regressions as blockers.
- MUST fix design-level issues before implementation details when the issue affects hierarchy, spacing, interaction states, motion, copy, or accessibility intent.
- MUST fix implementation findings with concrete file paths, line references when useful, and expected behavior.
- MUST re-run relevant verification after blocking fixes when the verification signal can change.
- SHOULD ask the user for a concrete decision when product, platform, privacy, or compatibility trade-offs block safe progress.

### 6. Verify the Result

Verification should match the changed surface. Helper changes usually need tests; Hono routes, metadata, config, dependency, and UI changes usually need build or manual evidence as well.

**Guidelines:**

- MUST run the relevant verification commands after non-trivial code changes, or report why they could not run.
- MUST use `npm run lint` for TypeScript, Hono JSX, route, config, or style-adjacent changes.
- MUST use `npm test` when `src/helpers/**` logic or tests change.
- MUST use `npm run build` when Hono routes, metadata, middleware, environment use, config, dependencies, or TypeScript signatures change.
- SHOULD perform focused manual checks when browser, crawler, metadata, custom-protocol, or responsive behavior changes.
- MUST report unverified acceptance criteria and residual risk in the final summary.

### 7. Maintain Skills When Learning Generalizes

Skill maintenance keeps reusable workflow learning close to the agents that need it. It should happen when a change reveals durable guidance, not after every narrow bug fix.

**Guidelines:**

- SHOULD consider a final skill-maintenance pass after implementation and verification converge.
- MUST update or propose updates to `.agents/skills/**` when the workflow exposes a reusable convention, outdated guidance, recurring review issue, or missing project rule.
- MUST include concrete evidence for skill updates, including affected skill paths, the decision to encode, and why existing guidance was insufficient.
- MUST consult [Agent Skills Best Practices](.agents/skills/agent-skills-best-practices/SKILL.md) when adding, renaming, moving, removing, splitting, or cross-linking skills, changing reference files, or updating this index.
- SHOULD skip skill maintenance when the workflow produced no generalizable learning.
- MUST state in the final summary whether skill maintenance was performed, skipped, or blocked when the workflow involved agent-skill rules.

### 8. Communicate Outcome

User-facing communication should expose decisions, blockers, verification, and outcomes without narrating every local inspection step. Ask questions only when local context cannot safely answer them.

**Guidelines:**

- MUST keep progress updates concise and focused on decisions, blockers, and outcomes.
- MUST ask focused questions only when the answer blocks safe progress and cannot be inferred from local context.
- MUST summarize completed work with changed files, verification status, trade-offs, unresolved risks, and deferred follow-ups.
- SHOULD include detailed plans, prompts, command logs, or iteration logs only when the user asks for auditability or the outcome depends on them.

### Final Output Shape

Output should be proportional to the task. Small tasks can finish with a short summary and verification note; non-trivial workflows need enough structure for the user to judge what changed and what remains.

**Guidelines:**

- SHOULD include a workflow plan with ordered steps, local inputs, dependencies, and acceptance criteria when the workflow is non-trivial.
- MUST summarize investigation or self-review findings when they affected the implementation.
- MUST state whether each acceptance criterion passed, failed, or remains unverified when criteria were explicitly established.
- SHOULD record iteration notes when a blocker caused a meaningful rework loop.
- MUST state whether skill maintenance was performed, skipped, or blocked when skill guidance governed the work.
- MUST recap changed files, verification status, trade-offs, and open follow-ups in the final summary.
- SHOULD list deferred items, known risks, or future work separately from completed work when they remain relevant.
- MUST ask a concrete question when progress depends on a product, platform, privacy, or scope decision.
