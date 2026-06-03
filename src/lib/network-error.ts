/**
 * Turns a thrown fetch/auth error into a user-facing message.
 *
 * Distinguishes a transport-level failure (backend unreachable, DNS blip,
 * CORS/preflight rejection — surfaced by the browser as a `TypeError`, e.g.
 * "Failed to fetch" in Chrome, "NetworkError" in Firefox, "Load failed" in
 * Safari) from a real API error that already carries a sensible message.
 *
 * @param err    The value caught in a try/catch around a fetch call.
 * @param action Short phrase for the fallback, e.g. "sign-up", "sign-in".
 */
export function humanizeNetworkError(err: unknown, action: string): string {
  const isNetworkError =
    err instanceof TypeError ||
    (err instanceof Error &&
      /failed to fetch|networkerror|load failed|fetch/i.test(err.message));

  if (isNetworkError) {
    return (
      "We can't reach our servers right now — please check your connection " +
      "and try again. If it keeps happening, it's on our end and we're on it."
    );
  }

  if (err instanceof Error && err.message) return err.message;

  return `Couldn't complete ${action}. Please try again.`;
}
