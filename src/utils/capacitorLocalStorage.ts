import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

/**
 * Persistent localStorage polyfill for Capacitor native apps.
 * - Activates ONLY on native (Capacitor.isNativePlatform()).
 * - Provides a synchronous Storage-like API by reading/writing an in-memory cache.
 * - Persists changes asynchronously to Capacitor Preferences (NSUserDefaults / SharedPreferences).
 * - Uses a key prefix to avoid clashes with other app preferences.
 */

const PREFIX = '__LS__:'; // namespace to avoid collisions
const cache = new Map<string, string>(); // in-memory mirror of all "localStorage" entries

// Helper: add prefix to a key used in Preferences
function prefKey(key: string) {
  return `${PREFIX}${key}`;
}

// Load all keys with our prefix from Preferences into the in-memory cache.
// This runs once at startup so getItem() can be synchronous afterwards.
async function loadCacheFromPreferences() {
  const { keys } = await Preferences.keys();
  const lsKeys = keys.filter((full) => full.startsWith(PREFIX));
  if (!lsKeys.length) return;

  await Promise.all(
    lsKeys.map(async (full) => {
      const { value } = await Preferences.get({ key: full });
      // Strip the prefix for the cache key
      const k = full.slice(PREFIX.length);
      if (value !== null && value !== undefined) {
        cache.set(k, value);
      }
    }),
  );
}

// A class that implements the DOM Storage interface but backed by our cache + Preferences.
// All reads are synchronous (from cache). Writes update cache synchronously and persist asynchronously.
class CapacitorLocalStorage implements Storage {
  get length() {
    return cache.size;
  }

  clear(): void {
    // Clear in-memory cache
    cache.clear();

    // Also remove all prefixed entries from Preferences asynchronously
    void (async () => {
      const { keys } = await Preferences.keys();
      const lsKeys = keys.filter((full) => full.startsWith(PREFIX));
      await Promise.all(lsKeys.map((full) => Preferences.remove({ key: full })));
    })();
  }

  getItem(key: string): string | null {
    return cache.has(key) ? cache.get(key)! : null;
  }

  key(index: number): string | null {
    const keys = Array.from(cache.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    cache.delete(key);
    // Persist removal (fire-and-forget)
    void Preferences.remove({ key: prefKey(key) });
  }

  setItem(key: string, value: string): void {
    const str = String(value); // Storage stores strings only
    cache.set(key, str);
    // Persist update (fire-and-forget)
    void Preferences.set({ key: prefKey(key), value: str });
  }
}

// Prevent multiple installs during hot reload
let installed = false;

/**
 * Call this ONCE before any library that might touch window.localStorage.
 * On web it does nothing; on native it replaces window.localStorage with our polyfill.
 */
export async function setupCapacitorLocalStorage() {
  if (installed) return;

  // Only polyfill on native (iOS/Android). On web, keep real localStorage.
  if (!Capacitor.isNativePlatform()) {
    installed = true;
    return;
  }

  // Warm up cache from Preferences so reads can be synchronous
  await loadCacheFromPreferences();

  // Create the Storage-compatible instance
  const polyfill = new CapacitorLocalStorage();

  // window.localStorage is not writable by default; redefine via defineProperty
  Object.defineProperty(window, 'localStorage', {
    value: polyfill,
    configurable: true,
    enumerable: false,
    writable: false,
  });

  installed = true;
}
