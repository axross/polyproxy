# Comment Style

Apply these rules when writing or reviewing inline comments and doc-comments.

## Casing

Comment casing should fit the comment form. Inline comments can be natural prose; doc-comments read like exported API documentation.

**Guidelines:**

- SHOULD start single-line `//` comments with lowercase natural-language prose.
- SHOULD start doc-comments (`/** ... */`) with sentence case.
- MAY keep code identifiers, protocol names, and acronyms such as `URL`, `JSON`, `HTTP`, `Open Graph`, and `Obsidian` capitalized when they start a comment.

## No Self-Mention Next to a Definition

The identifier already tells the reader what is being defined. A useful nearby comment explains why the definition exists or what non-obvious constraint it protects.

**Bad Example:**

> `// buildCanonicalUrl builds the canonical URL from the payload.`

**Good Example:**

> `// keep canonical URL generation isolated because metadata rendering must fail soft.`

**Guidelines:**

- SHOULD describe the role or reason when a `//` comment sits directly above a `const`, `function`, class, or component definition.
- MUST NOT repeat the identifier as the only content of a nearby explanatory comment.

## Punctuation

Prose comments should read like sentences, not labels or separators. Small helper files do not need banner lines.

**Guidelines:**

- SHOULD write `//` comments as complete, readable sentences when they explain behavior.
- SHOULD NOT use `:` or `;` as sentence delimiters in prose comments. Rewrite `// note: ...` as a normal sentence.
- MUST NOT add banner comments or separator lines for small helper sections.

## When to Comment

Comments are for local facts a reader cannot infer from the code alone, especially browser protocol behavior, crawler behavior, validation intent, and privacy constraints.

**Guidelines:**

- SHOULD comment non-obvious custom-protocol, bot/crawler, browser compatibility, validation, or privacy behavior.
- SHOULD NOT comment straightforward assignments, React markup, or one-line wrappers.
- MUST NOT leave commented-out code in the diff.
