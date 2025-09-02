import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const PREFIX = '__LS__:';
const cache = new Map<string, string>();
let installed = false;

const hasPrefs = () => Capacitor.isPluginAvailable?.('Preferences') &&
  !!(window as any).Capacitor?.Plugins?.Preferences;

function prefKey(k: string) { return `${PREFIX}${k}`; }

async function waitForPreferencesReady(timeoutMs = 1500) {
  if (!Capacitor.isNativePlatform()) return true;
  if (hasPrefs()) return true;

  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (hasPrefs()) return true;
    await new Promise(r => setTimeout(r, 50));
  }
  return hasPrefs();
}

async function loadCacheFromPreferencesSafe() {
  try {
    const ok = await waitForPreferencesReady();
    if (!ok) return false;

    const { keys } = await Preferences.keys(); // <-- previously hung
    const lsKeys = keys.filter((full) => full.startsWith(PREFIX));
    if (!lsKeys.length) return true;

    const entries = await Promise.all(
      lsKeys.map(async (full) => {
        const { value } = await Preferences.get({ key: full });
        return [full.slice(PREFIX.length), value] as const;
      }),
    );
    for (const [k, v] of entries) {
      if (v != null) cache.set(k, v);
    }
    return true;
  } catch (e) {
    console.warn('loadCacheFromPreferencesSafe failed:', e);
    return false;
  }
}

class CapacitorLocalStorage implements Storage {
  get length() { return cache.size; }
  clear(): void {
    cache.clear();
    void (async () => {
      if (!hasPrefs()) return;
      const { keys } = await Preferences.keys();
      const lsKeys = keys.filter((full) => full.startsWith(PREFIX));
      await Promise.all(lsKeys.map((full) => Preferences.remove({ key: full })));
    })();
  }
  getItem(key: string) { return cache.has(key) ? cache.get(key)! : null; }
  key(index: number) { return Array.from(cache.keys())[index] ?? null; }
  removeItem(key: string) {
    cache.delete(key);
    void (hasPrefs() && Preferences.remove({ key: prefKey(key) }));
  }
  setItem(key: string, value: string) {
    const str = String(value);
    cache.set(key, str);
    void (hasPrefs() && Preferences.set({ key: prefKey(key), value: str }));
  }
}

export async function setupCapacitorLocalStorage() {
  console.log('installed', installed);
  if (installed) return;
  if (!Capacitor.isNativePlatform()) { installed = true; return; }

  // Try to hydrate; if not ready, we’ll hydrate later without blocking boot
  const hydrated = await loadCacheFromPreferencesSafe();

  const polyfill = new CapacitorLocalStorage();
  Object.defineProperty(window, 'localStorage', {
    value: polyfill,
    configurable: true,
    enumerable: false,
    writable: false,
  });
  console.log('localStorage polyfill installed; hydrated:', hydrated);

  // If hydration failed (bridge not ready yet), try once after load
  if (!hydrated) {
    const once = () => {
      window.removeEventListener('load', once);
      // Re-run hydration and merge into cache
      loadCacheFromPreferencesSafe().then((ok) => {
        console.log('post-load hydration ok:', ok);
      });
    };
    window.addEventListener('load', once, { once: true });
  }

  installed = true;
}
