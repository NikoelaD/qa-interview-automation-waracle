/**
 * Point the app at a running backend by setting EXPO_PUBLIC_API_URL
 * (e.g. http://localhost:4000). If unset, the app falls back to a bundled
 * sample catalogue so it still runs fully standalone.
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL || '';
