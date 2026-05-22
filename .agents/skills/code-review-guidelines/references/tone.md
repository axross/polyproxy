# Tone

Apply these rules to how review findings are phrased.

## Be Direct and Constructive

Review findings should make the code better without making the author defensive. State the code behavior and the consequence.

**Guidelines:**

- MUST phrase findings as observations about code and behavior, not the author.
- MUST NOT use pejorative wording.
- SHOULD state the consequence in the same paragraph as the finding.

## Be Specific

Specific findings name the rule, quote the code, and explain the failing scenario.

**Guidelines:**

- MUST name the exact behavior or rule at issue.
- MUST quote the offending code.
- MUST NOT write vague comments such as "clean this up" or "seems risky" without a concrete scenario.

## State the Why

The author should understand the impact, not just the requested edit.

**Guidelines:**

- MUST explain why each finding matters for this app.
- SHOULD name concrete consequences such as leaking note metadata, accepting an unsafe URI, breaking Discord previews, or failing the build.
- SHOULD link the relevant skill reference instead of restating long guidance.

## Flag Assumptions

When product intent is unclear, the review should ask a focused question rather than asserting a defect.

**Guidelines:**

- MUST phrase uncertain product behavior as a question.
- MUST NOT assert a bug when the code could be intentionally preserving current bridge behavior.
- SHOULD state what evidence would resolve the uncertainty.

## Keep Preferences Non-Blocking

Preferences can be useful, but they are not merge blockers unless backed by a rule or risk.

**Guidelines:**

- MUST mark personal or stylistic preferences as Nit.
- SHOULD present trade-offs when two valid approaches exist.
- MUST NOT use preference language to bypass severity rules.
