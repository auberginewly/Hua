import { getCurrentWindow } from "@tauri-apps/api/window";

// Renderer-side platform detection for window-chrome decisions.
// Mirrors the navigator-based check already used in App.tsx.
export const isMacOS = navigator.userAgent.includes("Macintosh");

// Whether the current window uses the native macOS title bar (system traffic
// lights). True on macOS for every window except floating tile surfaces, which
// intentionally stay frameless with the custom chrome.
export function usesNativeTitleBar(): boolean {
  if (!isMacOS) return false;
  try {
    return !getCurrentWindow().label.startsWith("tile-");
  } catch {
    return true;
  }
}
