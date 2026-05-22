import type { RequestIdVariables } from "hono/request-id";

interface OptionalRuntimeBindings {
  SENTRY_DSN?: string;
}

export interface HonoEnv {
  Bindings: CloudflareBindings & OptionalRuntimeBindings;
  Variables: RequestIdVariables;
}
