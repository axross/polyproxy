# Server and Client Component Boundaries

Apply these rules when deciding whether a component should run on the server or in the browser.

## Boundary Decision

Server Components keep browser bundles small and can read server-only inputs. Client Components are reserved for hooks, event handlers, and browser APIs.

| Need | Component boundary |
| ---- | ------------------ |
| Read `params`, `headers()`, metadata inputs, or environment-derived helpers | Server Component |
| Decode proxy payloads, build metadata, or call pure helper modules | Server Component |
| Use `window`, `document`, `navigator`, `useEffect`, state, or DOM event handlers | Client Component |
| Attempt `obsidian://` custom-protocol launch in the browser | Client Component |

**Guidelines:**

- MUST keep route pages and metadata generation as Server Component work unless browser-only behavior is required.
- MUST keep browser APIs and React lifecycle hooks inside files that begin with `"use client";`.
- MUST place `"use client";` at the first statement in a Client Component file, before imports.
- MUST NOT import `next/headers`, `process.env` helpers, Node APIs, or async Server Components into a Client Component.
- SHOULD pass already-built strings and simple serializable props from Server Components to Client Components.

## Splitting at the Boundary

A component that needs both server-only data and browser effects should be split. The server side owns decoding, validation, and URI construction; the client side receives only the value it needs for the browser action.

**Example:**

```tsx
// page.tsx - Server Component
const obsidianUri = buildObsidianUri(payload);

return <OpenActions obsidianUri={obsidianUri} />;
```

```tsx
// _components/open-actions.tsx - Client Component
"use client";

export default function OpenActions({ obsidianUri }: { obsidianUri: string }) {
  useEffect(() => {
    window.location.assign(obsidianUri);
  }, [obsidianUri]);

  return <a href={obsidianUri}>Open in Obsidian</a>;
}
```

**Guidelines:**

- MUST split mixed server/client behavior at the smallest component boundary that keeps browser-only code isolated.
- MUST construct Obsidian URIs, bridge URLs, and decoded payload state before passing props into Client Components.
- MUST NOT pass promises to Client Components.
- SHOULD keep Client Components narrow enough that their behavior can be reviewed without also reviewing route metadata or validation logic.

## Suspense and Loading

Suspense is useful when an async Server Component can stream independently or has a meaningful loading state. This URL proxy app is small, so loading/loaded splits should be introduced only when they reduce user-visible waiting or clarify async behavior.

**Example:**

```tsx
<Suspense fallback={<NotePreviewLoading data-testid="preview-loading" />}>
  <NotePreview data-testid="preview" payload={payloadPromise} />
</Suspense>
```

**Guidelines:**

- SHOULD wrap independent async Server Components in `<Suspense>` when their work can stream separately from the surrounding route.
- SHOULD provide a meaningful fallback when the user would otherwise see an unexplained delay.
- MUST keep loading and loaded states structurally similar enough to avoid layout shift.
- MUST suffix loading-state test IDs with `-loading` when the loaded state has a `data-testid`.
- MAY omit Suspense for simple route pages whose required async work blocks the whole page by design.
