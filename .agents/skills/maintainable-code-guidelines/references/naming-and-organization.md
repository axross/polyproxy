# Naming and Organization

Apply these rules to keep file and symbol names predictable across the codebase.

## File Naming

File names follow the same broad convention as `btnopen.com`: source files are kebab-case unless Next.js reserves the filename. Dynamic route folders keep bracket syntax, and route-specific prop contracts use co-located `page-props.ts`.

**Good Examples:**

> `app/obsidian/[query]/_components/open-actions.tsx`

> `app/obsidian/[query]/page-props.ts`

**Bad Examples:**

> `app/obsidian/[query]/OpenActions.tsx`

> `app/obsidian/[query]/pageProps.ts`

**Guidelines:**

- MUST follow Next.js conventions for App Router files, including `page.tsx`, `layout.tsx`, `route.ts`, and dynamic segment folders such as `[query]`.
- MUST use kebab-case for `.ts`, `.tsx`, and `.css` source files that are not framework-reserved filenames.
- MUST use kebab-case for React component files when they are not App Router convention files, e.g. `open-actions.tsx`.
- MUST use kebab-case for pure helper files in `app/_/helpers/` when the exported concept is a phrase, e.g. `bridge-url.ts`, `decode-link.ts`, and `obsidian-uri.ts`.
- MAY use generic names such as `types.ts` for shared type-only files when the containing directory is already specific.
- MUST end test files in `.test.ts` or `.test.tsx`.
- SHOULD mirror the helper being tested in the test filename.

## Folder Layout

The current layout is intentionally shallow. Adding familiar folders from larger apps should wait until the local code has a real domain split.

**Guidelines:**

- SHOULD keep route-specific UI and Tailwind class composition with the owning route under `app/obsidian/`.
- MUST keep route-local UI modules under the owning route's `_components/` directory.
- SHOULD keep pure helpers flat under `app/_/helpers/` until a real subdomain grows large enough to justify a folder.
- MUST keep unit tests next to the target file they verify.
- MUST NOT introduce a detached test directory without a reason.
- MUST NOT add `src/`, `features/`, `components/`, or `hooks/` folders just because another project uses them.

## Route Prop Files

Dynamic routes should name their page props the way `btnopen.com` does: a co-located `page-props.ts` exports `PageProps`, and `page.tsx` imports that type.

**Example:**

```ts
export interface PageProps {
  params: Promise<{ query: string }>;
}
```

**Guidelines:**

- MUST place dynamic route prop contracts in a co-located `page-props.ts` file.
- MUST name the exported route props interface `PageProps`.
- MUST type `params` and `searchParams` as `Promise<...>` to match the local Next.js 16 App Router contract.
- SHOULD keep route prop files type-only and free of runtime helpers.

## Export Conventions

Exports should make direct imports easy to trace. `btnopen.com` uses named exports for components and reserves default exports for framework-required page/layout entrypoints.

**Guidelines:**

- SHOULD use named exports from helper modules.
- MUST use named exports for non-page React components.
- MUST reserve default exports for App Router convention files such as `page.tsx` and `layout.tsx`.
- SHOULD NOT add `index.ts` barrel files unless they remove meaningful repetition; this repo currently reads more clearly without barrels.

## Symbol Naming

Symbol names should use normal TypeScript and React conventions while preserving this app's bridge-domain vocabulary. Match `btnopen.com` by using camelCase constants instead of shouty constants and `interface` for object-only shapes.

**Good Examples:**

> `const fieldLimits = { vault: 100, path: 500 } as const;`

> `export interface BridgePayload { vault: string; path: string; }`

**Bad Examples:**

> `const FIELD_LIMITS = { vault: 100, path: 500 } as const;`

> `export type BridgePayload = { vault: string; path: string; };`

**Guidelines:**

- MUST name components in PascalCase.
- MUST name types and interfaces in PascalCase.
- MUST use camelCase for constants, including module-level constants and exported constants.
- MUST NOT use UPPER_SNAKE_CASE for constants.
- MUST use `interface` instead of `type` for object-only shapes.
- MAY use `type` for unions, intersections, mapped types, and utility-type aliases.
- MAY use camelCase for local configuration.
- SHOULD start boolean values with `is`, `has`, `should`, or `can`.
- SHOULD start event handler props with `on`.
- SHOULD start local handlers with `handle`.
- SHOULD use bridge-domain vocabulary consistently: `bridge`, `payload`, `query`, `obsidianUri`, `sourceUrl`, `vault`, and `path`.

## File-to-Symbol Correspondence

When one file has one primary concept, the filename and export should point to the same idea so readers can navigate without searching.

**Guidelines:**

- SHOULD make the primary helper obvious from the filename when a file exports one main helper.
- MUST NOT export a differently named component from a component file when it would surprise a reader.
- SHOULD keep tests named after the target file or behavior surface they verify, such as `bridge-url.test.ts` for `bridge-url.ts` and `buildBridgeUrl()`.
