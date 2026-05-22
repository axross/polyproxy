export interface BridgePayload {
  vault: string;
  path: string;
  title: string;
  summary: string;
  sourceUrl?: string;
}

export type Result<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      reason: string;
    };
