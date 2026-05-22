const base64UrlPattern = /^[A-Za-z0-9_-]*$/;
const base64QuantumLength = 4;
const impossibleBase64Remainder = 1;

export class Base64UrlDecodeError extends Error {
  constructor() {
    super("Invalid Base64url value");
    this.name = "Base64UrlDecodeError";
  }
}

export function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

export function decodeBase64Url(value: string): string {
  if (
    !base64UrlPattern.test(value) ||
    value.length % base64QuantumLength === impossibleBase64Remainder
  ) {
    throw new Base64UrlDecodeError();
  }

  const decoded = Buffer.from(value, "base64url").toString("utf8");

  if (encodeBase64Url(decoded) !== value) {
    throw new Base64UrlDecodeError();
  }

  return decoded;
}
