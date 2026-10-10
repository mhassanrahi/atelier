const callbackBaseURL = new URL("https://atelier.local");

export function getSafeCallbackURL(
  value: string | string[] | undefined,
  fallback = "/account",
) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate?.startsWith("/")) {
    return fallback;
  }

  try {
    const url = new URL(candidate, callbackBaseURL);

    if (url.origin !== callbackBaseURL.origin) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
