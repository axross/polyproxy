# Evidence

Apply these rules when presenting findings. Each finding must be backed by concrete evidence and phrased to be directly actionable.

## Citation Requirements

A finding without a concrete location forces the author to rediscover the issue. Quote the exact code that creates the risk.

**Example:**

```markdown
**Major - Unsafe source URL protocol reaches rendered link**

`src/helpers/validation.ts:42`

```ts
sourceUrl: z.string().optional(),
```

The bridge renders `sourceUrl` into an external link, so it must be restricted to `http:` and `https:`.
```

**Guidelines:**

- MUST include a repo-relative file path and line number for every finding.
- MUST include a one-to-five-line code quote for every finding.
- MUST include a relative link to the relevant guideline.
- MUST include one severity label for every finding.

## Fix Snippet Format

Fix snippets should show the shape of the correction without turning the review into a full patch unless the fix is tiny.

**Guidelines:**

- SHOULD use unified diff format for small fixes.
- SHOULD show standalone replacement code for larger fixes.
- MUST describe surrounding context when the snippet cannot be applied directly.

## Report Structure

A predictable findings-first structure helps the caller see blockers before context. Summary belongs after findings so it cannot bury merge risk.

**Recommended Order:**

1. Critical Findings
2. Major Findings
3. Minor / Nits
4. Pre-existing Observations
5. Summary
6. Recommended Actions

**Guidelines:**

- MUST lead review reports with findings, ordered by severity.
- SHOULD organize reports as Critical Findings, Major Findings, Minor / Nits, Pre-existing Observations, Summary, and Recommended Actions.
- SHOULD include Strengths only when there is a genuine review-relevant strength.
- MUST keep pre-existing observations separate from blocking findings.
- MUST list concrete verification commands in Recommended Actions when commands remain to be run.

## What Counts as Evidence

Evidence should be reproducible from files, guidelines, command output, or a concrete bridge scenario.

**Guidelines:**

- MAY cite direct code quotes from reviewed files.
- MAY cite direct guideline links.
- MAY cite deterministic command output.
- MAY cite a specific failing route, helper, or payload scenario.

## What Does Not Count as Evidence

Speculation is not enough for a finding. A review comment must name the behavior at risk and why it matters.

**Guidelines:**

- MUST NOT present vague improvement suggestions as findings.
- MUST NOT file a finding with no file and line citation.
- MUST NOT present personal style preference as a rule.
- MUST NOT rely on speculation that does not name the bridge behavior at risk.
