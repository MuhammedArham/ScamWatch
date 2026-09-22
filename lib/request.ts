// Shared request handling for the scoring-style API routes. These mirror the
// helpers in app/api/score/route.ts exactly; that route is intentionally left
// untouched, so keep the two in step if either changes.
export const MAX_BODY_BYTES = 64_000;

// Do not forward accidental financial or personal numbers to the scoring provider.
export function redactNumbers(text: string) {
  return text.replace(/\b\d[\d\s-]{2,}\d\b/g, "[redacted number]");
}

export async function readBoundedBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let content = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      content += decoder.decode(value, { stream: true });
    }
    return content + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}
