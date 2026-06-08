/**
 * Link agli store dell'app mobile aircut.
 * TODO: sostituire con gli URL reali quando le app sono pubblicate.
 */
export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ?? "https://apps.apple.com/app/idXXXXXXXXX";

export const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ??
  "https://play.google.com/store/apps/details?id=app.aircut";

export type Platform = "ios" | "android" | "desktop";

/** Rileva la piattaforma dallo user-agent (best-effort, lato client). */
export function detectPlatform(ua: string): Platform {
  const s = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(s)) return "ios";
  // iPadOS recenti si presentano come "Macintosh" ma con touch: euristica.
  if (/macintosh/.test(s) && typeof navigator !== "undefined" && (navigator as any).maxTouchPoints > 1)
    return "ios";
  if (/android/.test(s)) return "android";
  return "desktop";
}

export function storeUrlFor(platform: Platform): string | null {
  if (platform === "ios") return APP_STORE_URL;
  if (platform === "android") return PLAY_STORE_URL;
  return null;
}
