# Severity

Apply these rules to assign a severity level to every finding.

## Severity Levels

Severity describes merge impact. Use the lowest level that accurately captures the risk.

| Level | Meaning | Merge impact |
| ----- | ------- | ------------ |
| Critical | Security issue, data leak, crash, broken build, or production route unusable | MUST block merge |
| Major | User-visible bug, privacy regression, validation gap, or architectural issue | SHOULD block merge |
| Minor | Limited-impact guideline violation or maintainability issue | SHOULD be addressed but need not block |
| Nit | Small style or wording improvement | MAY be addressed |

**Guidelines:**

- MUST assign one severity to every finding.
- MUST treat Critical findings as merge blockers.
- SHOULD treat Major findings as blockers unless the caller explicitly accepts the risk.

## Severity Floors by Category

Some issue categories have a minimum severity because their impact is already known for this app.

**Guidelines:**

- MUST classify hardcoded secrets, committed private env files, public configuration secrets, raw decoded payload logging, invalid-route crashes, build errors, and manifest/lockfile drift as at least Critical.
- MUST classify unsafe Obsidian paths, unsafe `sourceUrl` protocols, and risky npm install scripts as at least Critical.
- MUST classify missing payload validation, Node-only code leaking into browser script snippets, production imports from `devDependencies`, bot paths that trigger redirects, public behavior changes without docs/tests, missing helper tests, and duplicative dependencies as at least Major.
- MUST classify committed `.only()` as Critical.
- MUST classify unexplained `.skip()`, sleep/retry-based flaky-test workarounds, missing required manual evidence, introduced `any`, unsafe casts, or unjustified `@ts-expect-error` as at least Major.
- SHOULD classify introduced lint warnings in changed files according to their correctness, maintainability, or review-signal impact.

## Severity Discipline

Severity loses value when it is used for pressure instead of risk. Keep levels consistent and explain uncertainty.

**Guidelines:**

- MUST NOT label style preference as Major.
- MUST NOT soften a floor issue because the app is small or personal.
- SHOULD pick the lower level and state the uncertainty when the impact is unclear.
