# Product Requirements Document: Obsidian Link Bridge for Discord

## 1. Overview

### 1.1 Product Name

Obsidian Link Bridge

### 1.2 Purpose

Discord does not reliably render obsidian:// custom URI scheme links as clickable links, especially when they are embedded as Markdown links. This product provides an HTTPS bridge URL that Discord can render, preview, and make clickable. When a user opens the bridge URL, the page decodes the intended Obsidian target from Base64-encoded query parameters and helps the user open the corresponding note in the local Obsidian app.

The bridge also exposes Open Graph metadata so Discord can show a rich preview containing the article note title and summary.

### 1.3 Recommended Implementation

Build a small Next.js application using the App Router and deploy it to Vercel.

Example bridge URL shape:

    https://obsidian-link.example.com/open?v=UGVyc29uYWw&p=QXJ0aWNsZXMvR29vZ2xlIHdhbnRzIHRvIG1ha2UgdGhlIHdlYiBhZ2VudC1yZWFkeQ&t=R29vZ2xlIHdhbnRzIHRvIG1ha2UgdGhlIHdlYiBhZ2VudC1yZWFkeQ&s=QW4gYXJ0aWNsZSBhYm91dCBHb29nbGUncyBlZmZvcnQgdG8gbWFrZSB0aGUgd2ViIGVhc2llciBmb3IgYWdlbnRzIHRvIG5hdmlnYXRlLg

Decoded Obsidian URI:

    obsidian://open?vault=Personal&file=Articles%2FGoogle%20wants%20to%20make%20the%20web%20agent-ready

## 2. Problem Statement

### 2.1 Current Problem

Current notifications can include an Obsidian link such as:

    [mask](obsidian://open?vault=Personal&file=Articles%2F...)

Discord does not consistently treat that URI as a clickable link. Direct custom URI schemes also cannot provide Open Graph metadata, so the Discord preview cannot show the article title or summary.

### 2.2 User Impact

- Users cannot reliably click from Discord into Obsidian.
- Article notifications lose the fast path from feed item to local note.
- Raw Obsidian links are visually noisy and expose vault/path details.
- Discord previews are not useful for custom URI links.

### 2.3 Desired Outcome

Article notifications in Discord should contain a normal HTTPS URL that:

- Is clickable in Discord.
- Produces a useful Discord link preview.
- Displays the article note title and summary through Open Graph tags.
- Opens or helps open the local Obsidian note.
- Keeps the note path and metadata hidden from casual visual inspection by using Base64-encoded query parameters.
- Is simple enough to maintain as a small Next.js/Vercel app.

## 3. Goals and Non-Goals

### 3.1 Goals

1. Provide a stable HTTPS bridge URL for Obsidian note links.
2. Encode the Obsidian vault name, note path, article title, and article summary in Base64 query parameters.
3. Decode the query parameters server-side to generate Open Graph metadata.
4. Decode the query parameters to build an obsidian://open URI.
5. Render a lightweight landing page with article title, summary, an Open in Obsidian button, and a copy fallback.
6. Deploy on Vercel with minimal operational overhead.
7. Provide helper utilities for generating bridge URLs from the article ingestion and notification workflow.
8. Keep implementation small, typed, tested, and easy to modify.

### 3.2 Non-Goals

1. Do not build a full Obsidian Publish replacement.
2. Do not host note content.
3. Do not add authentication in the first version.
4. Do not encrypt or securely hide note paths. Base64 is only obfuscation.
5. Do not require server-side storage or a database in the first version.
6. Do not implement analytics by default.
7. Do not guarantee automatic Obsidian launch without a user gesture. Browser and OS custom protocol handling varies.

## 4. Target Users

### 4.1 Primary User

The primary user receives tech news article notifications in Discord and wants to open the related local Obsidian note quickly.

### 4.2 Secondary Users

- Automation agents generating article notes and notifications.
- Maintainers changing the notification format.
- Users previewing Discord messages on mobile or desktop.

## 5. Core User Stories

### 5.1 Discord Reader

As a Discord reader, I want a normal clickable HTTPS link so that I can open an article note without manually copying an obsidian:// URI.

Acceptance criteria:

- The message contains an HTTPS URL.
- Discord renders it as clickable.
- Opening the URL displays an article-specific page.
- The page includes an Open in Obsidian action.

### 5.2 Preview Consumer

As a Discord reader, I want the link preview to show the article note title and summary so that I can understand the notification at a glance.

Acceptance criteria:

- Discord shows an Open Graph title matching the article note title.
- Discord shows an Open Graph description matching the article summary.
- The preview is generated from query parameters, not stored server state.

### 5.3 Automation Producer

As an automation process, I want a deterministic helper function that produces bridge URLs so that notifications can be generated consistently.

Acceptance criteria:

- Helper accepts vault, file path, title, and summary.
- Helper returns a valid HTTPS bridge URL.
- Helper uses URL-safe Base64 encoding.
- Helper truncates or validates fields to keep URLs within practical limits.

### 5.4 Maintainer

As a maintainer, I want the app to be small and deployment-friendly so that I can update it without managing infrastructure.

Acceptance criteria:

- App uses Next.js and TypeScript.
- App deploys on Vercel.
- No database is required.
- Required configuration is environment-variable based.
- Tests cover encoding, decoding, validation, and Obsidian URI construction.

## 6. Functional Requirements

### 6.1 Bridge URL Format

The bridge must expose an /open route:

    GET /open?v=BASE64URL_VAULT&p=BASE64URL_FILE_PATH&t=BASE64URL_TITLE&s=BASE64URL_SUMMARY

Recommended query parameters:

| Parameter | Required | Meaning |
| --- | --- | --- |
| v | Yes | Obsidian vault name |
| p | Yes | Obsidian note path, relative to the vault |
| t | Yes | Article note title used for page title and Open Graph title |
| s | Yes | Article summary used for page copy and Open Graph description |
| src | No | Base64url source article URL, if future previews or debugging need it |
| utm | No | Plain non-sensitive campaign/source marker, if needed later |

All encoded parameters must use Base64url, not regular Base64.

Rationale:

- Regular Base64 can include plus, slash, and equals characters, which are awkward in URLs.
- Base64url replaces plus with hyphen, slash with underscore, and can omit padding.
- Base64url remains easy to decode in JavaScript while being less visually readable in Discord.

### 6.2 Encoding Rules

Encoding must be:

1. UTF-8 string to bytes.
2. Bytes to Base64.
3. Base64 to Base64url.

Base64url transformation:

- Replace plus with hyphen.
- Replace slash with underscore.
- Remove trailing equals padding.

Implementation recommendation for server-side TypeScript:

    export function encodeBase64Url(value: string): string {
      return Buffer.from(value, "utf8").toString("base64url");
    }

    export function decodeBase64Url(value: string): string {
      return Buffer.from(value, "base64url").toString("utf8");
    }

For browser-only code, use a UTF-8 safe implementation with TextEncoder and TextDecoder. Prefer server-side decoding in Next.js where Buffer is available.

### 6.3 Obsidian URI Construction

The decoded values must be converted into an Obsidian URI:

    obsidian://open?vault=ENCODED_VAULT&file=ENCODED_PATH

Rules:

- Use encodeURIComponent for the decoded vault name.
- Use encodeURIComponent for the decoded file path.
- Do not double-encode already encoded note paths.
- The source path passed into the bridge should be the human-readable vault-relative path.

Example source path:

    Articles/Google wants to make the web agent-ready

Expected encoded file parameter:

    Articles%2FGoogle%20wants%20to%20make%20the%20web%20agent-ready

### 6.4 Open Graph Metadata

The /open page must generate dynamic metadata from decoded query parameters.

Required metadata:

- og:title
- og:description
- og:type set to article
- og:url
- twitter:card set to summary
- twitter:title
- twitter:description

Recommended metadata:

- og:site_name set to Obsidian Link Bridge
- robots set to noindex,nofollow

Optional metadata:

- og:image generated dynamically with Next.js ImageResponse using decoded title and summary.
- Static fallback image for generic note previews.

Important crawler requirement:

Discord's crawler fetches HTML and reads Open Graph metadata. It does not execute client-side JavaScript. Therefore, metadata must be produced server-side through Next.js generateMetadata.

### 6.5 Page Behavior

When a human opens the bridge page, it should:

1. Decode and validate query parameters.
2. Render the title and summary.
3. Provide a prominent Open in Obsidian button.
4. Provide a copy button for the generated obsidian:// URI.
5. Optionally attempt to open Obsidian automatically after a short delay.

Recommended behavior:

- Do not rely only on automatic redirect.
- Show a visible button because browsers are more likely to permit custom protocol launches after a user gesture.
- Use automatic redirect only as progressive enhancement.
- Include a copy fallback for users whose browser blocks protocol handling.

### 6.6 Crawler Behavior

The app should avoid forcing Discord's crawler into a custom protocol redirect.

Recommended approach:

- Always serve an HTML page with OG metadata.
- Do not issue an HTTP 302 redirect to obsidian://.
- Use client-side user interaction for opening Obsidian.

Rationale:

- Crawlers need stable HTML metadata.
- HTTP redirects to custom schemes may be ignored, blocked, or fail previews.
- A landing page gives a better mobile fallback.

### 6.7 Error Handling

The /open route must handle invalid or missing parameters gracefully.

Cases:

- Missing v, p, t, or s.
- Invalid Base64url value.
- Decoded value is empty.
- Decoded value exceeds length limits.
- Decoded path appears unsafe or malformed.

Error page requirements:

- Return a valid page with no sensitive details.
- Use generic metadata:
  - Title: Invalid Obsidian Link
  - Description: This Obsidian bridge link could not be opened.
- Do not render raw undecoded query parameters.
- Do not attempt to open Obsidian.

### 6.8 Validation

Validation must be strict enough to prevent accidental bad links and page abuse.

Recommended decoded length limits:

| Field | Max decoded length |
| --- | ---: |
| Vault | 100 chars |
| Path | 500 chars |
| Title | 160 chars |
| Summary | 300 chars |
| Source URL | 1,000 chars |

Path validation:

- Must not start with slash.
- Must not contain dot-dot path segments.
- Must not contain null bytes.
- Should allow spaces and non-ASCII characters.
- Should allow slash as Obsidian path separator.

Title and summary validation:

- Trim whitespace.
- Collapse excessive whitespace for metadata.
- Escape all rendered output through React default escaping.
- Truncate metadata defensively if needed.

### 6.9 URL Length Management

Discord and browsers can handle fairly long URLs, but extremely long URLs are fragile.

Requirements:

- Keep summaries short before encoding.
- Enforce summary max length in the generator helper.
- Provide tests for realistic article note links.

Recommendation:

- Target bridge URLs under 1,500 characters.
- Hard reject or truncate generated URLs above 1,900 characters.

If future needs exceed this limit, consider a slug-based server-side mapping as a v2 architecture.

## 7. Non-Functional Requirements

### 7.1 Maintainability

- Use TypeScript.
- Keep encoding and decoding in a shared utility module.
- Keep validation logic centralized.
- Keep Open Graph metadata generation simple and deterministic.
- Avoid custom server infrastructure.
- Use Vercel's default Next.js deployment path.

### 7.2 Reliability

- The link page must render even if JavaScript is disabled.
- The Obsidian open action should work when clicked in modern desktop browsers with Obsidian installed.
- The copy fallback should work even if custom protocol launch fails.

### 7.3 Security and Privacy

Base64 is obfuscation, not security.

The product must explicitly treat Base64 as a way to avoid casual readability in Discord, not as protection against determined inspection.

Requirements:

- Do not include private note contents in the URL.
- Do not include sensitive personal data in title or summary.
- Add noindex,nofollow metadata.
- Avoid analytics by default.
- Avoid logging full request URLs in application logs where possible.
- Do not store decoded note metadata server-side.

Vercel and CDN logs may still contain URLs. Because the query string contains encoded note path, title, and summary, this is acceptable only for non-sensitive article notes.

### 7.4 Performance

- Page should be static-like and lightweight.
- Dynamic metadata decoding must be fast and dependency-free.
- No database request should be needed.
- Target Time to First Byte should be dominated by normal Vercel edge/network overhead.

### 7.5 Accessibility

- Main action must be a keyboard-accessible link or button.
- Copy action must expose success/failure state to assistive technology.
- Page title must match the article title.
- Text contrast must meet WCAG AA.
- Page should work on mobile widths.

## 8. UX Requirements

### 8.1 Page Content

The page should be practical, not a marketing landing page.

Required visible elements:

- Article title.
- Article summary.
- Primary action: Open in Obsidian.
- Secondary action: Copy Obsidian URL.
- Small note: If Obsidian does not open, copy the URL and open it manually.

Optional visible elements:

- Vault name, if useful.
- Note path, hidden behind a disclosure control.
- Source article URL, if src is included and safe to show.

### 8.2 Interaction Flow

1. User sees a Discord notification with an HTTPS bridge URL.
2. Discord renders title and summary preview.
3. User clicks the HTTPS link.
4. Browser opens the bridge page.
5. User clicks Open in Obsidian.
6. Browser prompts for permission to open Obsidian, or opens it directly depending on local settings.
7. If that fails, user clicks Copy Obsidian URL.

### 8.3 Mobile Behavior

Mobile handling depends on Obsidian app installation and OS-level URL scheme registration.

Requirements:

- Page must remain readable on mobile.
- Primary button should still use the obsidian:// URI.
- Copy fallback must remain available.

## 9. Technical Architecture

### 9.1 Stack

- Framework: Next.js, App Router.
- Language: TypeScript.
- Runtime: Vercel.
- Styling: CSS Modules, Tailwind CSS, or plain CSS. Keep the design minimal.
- Testing: Vitest for utility tests. Playwright optional for end-to-end smoke tests.
- Package manager: pnpm recommended, npm acceptable.

### 9.2 Routes

- /: optional minimal home page explaining that the service opens Obsidian bridge links.
- /open: main bridge route.

### 9.3 Suggested File Structure

    obsidian-link-bridge/
      app/
        open/
          page.tsx
          OpenActions.tsx
        layout.tsx
        page.tsx
        globals.css
      lib/
        base64url.ts
        bridge-url.ts
        decode-link.ts
        obsidian-uri.ts
        validation.ts
      test/
        base64url.test.ts
        bridge-url.test.ts
        decode-link.test.ts
        obsidian-uri.test.ts
      next.config.ts
      package.json
      README.md
      vercel.json

### 9.4 Data Model

Decoded bridge payload:

    export type BridgePayload = {
      vault: string;
      path: string;
      title: string;
      summary: string;
      sourceUrl?: string;
    };

Encoded query:

    export type BridgeQuery = {
      v: string;
      p: string;
      t: string;
      s: string;
      src?: string;
    };

### 9.5 Core Utility Contracts

    export function encodeBase64Url(value: string): string;
    export function decodeBase64Url(value: string): string;

    export function buildBridgeUrl(
      baseUrl: string,
      payload: BridgePayload
    ): string;

    export function decodeBridgeQuery(
      searchParams: URLSearchParams | Record<string, string | string[] | undefined>
    ): BridgePayload;

    export function buildObsidianUri(
      payload: Pick<BridgePayload, "vault" | "path">
    ): string;

### 9.6 Metadata Generation

In app/open/page.tsx, implement generateMetadata. It should:

1. Decode the query safely.
2. Return generic invalid-link metadata when decoding fails.
3. Return article metadata when decoding succeeds.
4. Set robots to noindex,nofollow.
5. Use Open Graph type article.

Pseudo-code:

    export function generateMetadata({ searchParams }) {
      const result = decodeBridgeQuerySafe(searchParams);

      if (!result.ok) {
        return invalidLinkMetadata;
      }

      return {
        title: result.payload.title,
        description: result.payload.summary,
        robots: { index: false, follow: false },
        openGraph: {
          title: result.payload.title,
          description: result.payload.summary,
          type: "article"
        },
        twitter: {
          card: "summary",
          title: result.payload.title,
          description: result.payload.summary
        }
      };
    }

### 9.7 Client Open Action

Use a client component for copy behavior and optional auto-open.

The primary open control should be an anchor with href set to the generated Obsidian URI. This gives the browser a standard user-initiated navigation path:

    <a href={obsidianUri}>Open in Obsidian</a>

The copy action should use navigator.clipboard.writeText when available and should show a success or failure state.

## 10. Notification Workflow Integration

### 10.1 Current Notification Shape

Current article notification concept:

    こんな記事を見つけてきたぜ！
    {title}
    {short summary}
    <obsidian://open?vault=Personal&file=Articles%2F...>

### 10.2 New Notification Shape

Recommended:

    こんな記事を見つけてきたぜ！
    {title}
    {short summary}
    {httpsBridgeUrl}

Important Discord formatting note:

- If the URL is wrapped in angle brackets, Discord usually suppresses embeds.
- If Open Graph preview is desired, do not wrap the bridge URL in angle brackets.
- For article notifications, the bridge URL should normally be posted without angle brackets.

### 10.3 URL Generation Example

Input:

    {
      "vault": "Personal",
      "path": "Articles/Google wants to make the web agent-ready",
      "title": "Google wants to make the web agent-ready",
      "summary": "An article about Google's effort to make the web easier for agents to navigate."
    }

Output:

    https://obsidian-link.example.com/open?v=UGVyc29uYWw&p=QXJ0aWNsZXMvR29vZ2xlIHdhbnRzIHRvIG1ha2UgdGhlIHdlYiBhZ2VudC1yZWFkeQ&t=R29vZ2xlIHdhbnRzIHRvIG1ha2UgdGhlIHdlYiBhZ2VudC1yZWFkeQ&s=QW4gYXJ0aWNsZSBhYm91dCBHb29nbGUncyBlZmZvcnQgdG8gbWFrZSB0aGUgd2ViIGVhc2llciBmb3IgYWdlbnRzIHRvIG5hdmlnYXRlLg

## 11. Implementation Plan

### Phase 1: Project Scaffold

Tasks:

1. Create a new Next.js app:

       pnpm create next-app obsidian-link-bridge --ts --app --eslint

2. Configure project basics:
   - Enable strict TypeScript.
   - Add Vitest.
   - Add formatting command if desired.
   - Add environment variable support.

3. Add environment variables:

       NEXT_PUBLIC_BASE_URL=https://obsidian-link.example.com
       DEFAULT_VAULT=Personal

Acceptance criteria:

- App runs locally.
- / route renders.
- Typecheck passes.

### Phase 2: Encoding and Decoding Utilities

Tasks:

1. Implement lib/base64url.ts.
2. Implement lib/validation.ts.
3. Implement lib/decode-link.ts.
4. Implement lib/obsidian-uri.ts.
5. Implement lib/bridge-url.ts.

Acceptance criteria:

- Utility tests pass.
- Unicode title/path values round-trip.
- Invalid Base64url input returns a safe error.
- Path traversal-like values are rejected.
- obsidian://open URI is correctly encoded.

### Phase 3: /open Page

Tasks:

1. Implement dynamic metadata through generateMetadata.
2. Decode query params in the server page.
3. Render invalid-link state.
4. Render valid-link state with title, summary, open button, and copy fallback.
5. Add noindex,nofollow.

Acceptance criteria:

- Missing params show invalid page.
- Valid params show title and summary.
- Page source includes expected OG tags.
- Open in Obsidian href equals the expected custom URI.

### Phase 4: Discord Preview Validation

Tasks:

1. Deploy preview build to Vercel.
2. Send a test bridge URL to a private Discord test channel.
3. Confirm the URL is clickable.
4. Confirm Discord preview shows title and summary.
5. Confirm clicking opens the landing page.
6. Confirm Open in Obsidian launches Obsidian on desktop.

Acceptance criteria:

- Discord preview appears within normal crawler refresh time.
- Preview title and summary match encoded query values.
- No raw Base64 query content appears in preview text.

### Phase 5: Notification Generator Integration

Tasks:

1. Add or port the URL generation helper to the article notification workflow.
2. Replace direct obsidian:// links with bridge URLs.
3. Keep source article URL omitted unless explicitly requested.
4. Add tests for the notification formatter.
5. Update local documentation describing how links are generated.

Acceptance criteria:

- New article notifications include bridge URLs.
- The title and summary in the Discord preview match the article note.
- The Obsidian note opens from the bridge page.

### Phase 6: Production Deployment

Tasks:

1. Create Vercel project.
2. Configure production domain.
3. Set environment variables.
4. Enable automatic deploys from the main branch.
5. Add an uptime check against the public bridge overview or another deployed page.

Acceptance criteria:

- Production URL is stable.
- Public bridge overview returns success.
- Test Discord notification works in #dev-daily.

## 12. Testing Strategy

### 12.1 Unit Tests

Required tests:

- Base64url encode/decode ASCII.
- Base64url encode/decode Unicode.
- Decode rejects malformed input.
- Decode rejects missing required params.
- Decode rejects empty decoded values.
- Validation rejects absolute paths.
- Validation rejects dot-dot path segments.
- Obsidian URI encodes vault and path exactly once.
- Bridge URL builder produces expected query keys.
- Bridge URL builder enforces length limits.

### 12.2 Integration Tests

Recommended tests:

- Render /open with valid params and assert title, summary, and action href.
- Render /open with invalid params and assert invalid state.
- Inspect generated metadata if practical.

### 12.3 Manual Tests

Manual Discord test checklist:

- Paste bridge URL into Discord.
- Confirm preview appears.
- Confirm preview title.
- Confirm preview summary.
- Confirm URL is clickable.
- Confirm page loads on desktop.
- Confirm page loads on mobile.
- Confirm Obsidian launch on desktop.
- Confirm copy fallback works.

## 13. Deployment Plan

### 13.1 Vercel Setup

1. Connect GitHub repository to Vercel.
2. Framework preset: Next.js.
3. Build command:

       pnpm build

4. Install command:

       pnpm install --frozen-lockfile

5. Output: default Next.js.

### 13.2 Environment Variables

    NEXT_PUBLIC_BASE_URL=https://obsidian-link.example.com
    DEFAULT_VAULT=Personal

NEXT_PUBLIC_BASE_URL is used by URL generation helpers and metadata canonical URLs.

### 13.3 Domain

Recommended domain patterns:

- notes.example.com
- obsidian.example.com
- go.example.com

Use a short domain if possible because query strings add length.

## 14. Risks and Mitigations

### 14.1 Base64 Misunderstood as Security

Risk:

Users may assume Base64 hides sensitive data.

Mitigation:

- Document clearly that Base64 is obfuscation only.
- Do not include sensitive note content.
- Add noindex,nofollow.

### 14.2 Discord Does Not Refresh Preview Immediately

Risk:

Discord may cache Open Graph previews.

Mitigation:

- Query-string URLs are unique per note, reducing cache collision.
- Use stable metadata at first send.
- Avoid editing metadata after posting.

### 14.3 URL Too Long

Risk:

Long titles/summaries produce fragile Discord messages.

Mitigation:

- Limit title and summary lengths.
- Keep summary concise.
- Add builder-side URL length checks.
- Consider slug-backed storage in v2 if needed.

### 14.4 Browser Blocks Custom Protocol Launch

Risk:

Some browsers require user confirmation or block automatic protocol opening.

Mitigation:

- Use explicit user-click action.
- Provide copy fallback.
- Avoid relying on automatic redirects.

### 14.5 Vercel Logs Contain Encoded Metadata

Risk:

Request URLs may be logged by hosting infrastructure.

Mitigation:

- Only include non-sensitive article note metadata.
- Avoid analytics.
- Consider slug mapping in v2 for stronger privacy.

## 15. Future Enhancements

### 15.1 Slug-Based Links

Replace query-encoded payloads with short opaque IDs:

    https://obsidian-link.example.com/o/abc123

This would require storage but would improve privacy, aesthetics, and URL length.

### 15.2 Signed Query Payload

Add an HMAC signature:

    /open?d=BASE64URL_JSON&sig=SIGNATURE

This would prevent tampering but still would not provide confidentiality.

### 15.3 Encrypted Payload

Encrypt the query payload so the URL does not expose decoded metadata to anyone without the key.

This is likely unnecessary for non-sensitive article notes and adds key management complexity.

### 15.4 Dynamic OG Images

Generate an Open Graph image with title and summary using Next.js ImageResponse.

### 15.5 Source Article Link

Allow the bridge page to show the original article URL when included in the payload.

## 16. Acceptance Criteria Summary

The product is ready when:

1. A generated HTTPS bridge URL is clickable in Discord.
2. Discord displays the article note title and summary through Open Graph.
3. The bridge page decodes Base64url query parameters safely.
4. The bridge page builds a correct obsidian://open URI.
5. The user can open the note in Obsidian from a visible action.
6. A copy fallback is available.
7. Invalid links fail safely.
8. The implementation is deployed to Vercel.
9. Unit tests cover encoding, decoding, validation, URL generation, and URI construction.
10. Documentation explains that Base64 is obfuscation, not security.

## 17. Recommended Initial MVP Scope

Build only:

- /open route.
- Base64url query decoding.
- Dynamic Open Graph metadata.
- Minimal landing page.
- Obsidian open button.
- Copy fallback.
- Bridge URL builder utility.
- Unit tests.
- Vercel deployment.

Defer:

- Authentication.
- Database-backed slugs.
- Encrypted payloads.
- Analytics.
- Dynamic OG images.
- Source article page rendering.

This keeps the first version small, useful, and maintainable while solving the Discord clickability and preview problem directly.
