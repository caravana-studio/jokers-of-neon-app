import { App } from "@capacitor/app";
import { isNative } from "../../utils/capacitorUtils";

const CAVOS_SESSION_STORAGE_KEYS = [
  "cavos_oauth_session",
  "cavos_oauth_pre_auth",
  "cavos_session_data",
] as const;

const MIRROR_PREFIX = "cavos_persisted_session:";
const PATCH_FLAG = "__cavosNativeSessionPersistenceInstalled";
const LISTENERS_FLAG = "__cavosNativeSessionPersistenceListenersInstalled";

const getMirrorKey = (key: string) => `${MIRROR_PREFIX}${key}`;

const isCavosSessionKey = (key: string) =>
  CAVOS_SESSION_STORAGE_KEYS.includes(
    key as (typeof CAVOS_SESSION_STORAGE_KEYS)[number]
  );

const restorePersistedSession = () => {
  for (const key of CAVOS_SESSION_STORAGE_KEYS) {
    if (sessionStorage.getItem(key) !== null) {
      continue;
    }

    const persistedValue = localStorage.getItem(getMirrorKey(key));
    if (persistedValue !== null) {
      sessionStorage.setItem(key, persistedValue);
    }
  }
};

const clearPersistedSession = () => {
  for (const key of CAVOS_SESSION_STORAGE_KEYS) {
    localStorage.removeItem(getMirrorKey(key));
  }
};

const persistSessionSnapshot = () => {
  for (const key of CAVOS_SESSION_STORAGE_KEYS) {
    const value = sessionStorage.getItem(key);
    if (value === null) {
      localStorage.removeItem(getMirrorKey(key));
      continue;
    }

    localStorage.setItem(getMirrorKey(key), value);
  }
};

const installNativeLifecycleSync = () => {
  const windowWithFlags = window as typeof window & {
    [LISTENERS_FLAG]?: boolean;
  };

  if (windowWithFlags[LISTENERS_FLAG]) {
    return;
  }

  App.addListener("pause", () => {
    persistSessionSnapshot();
  });

  App.addListener("resume", () => {
    restorePersistedSession();
  });

  window.addEventListener("pagehide", persistSessionSnapshot);
  windowWithFlags[LISTENERS_FLAG] = true;
};

export const installCavosNativeSessionPersistence = () => {
  if (
    !isNative ||
    typeof window === "undefined" ||
    (window as typeof window & { [PATCH_FLAG]?: boolean })[PATCH_FLAG]
  ) {
    return;
  }

  restorePersistedSession();
  installNativeLifecycleSync();

  const storageProto = Storage.prototype as Storage & {
    setItem: Storage["setItem"];
    removeItem: Storage["removeItem"];
    clear: Storage["clear"];
  };
  const originalSetItem = storageProto.setItem;
  const originalRemoveItem = storageProto.removeItem;
  const originalClear = storageProto.clear;

  storageProto.setItem = function (key: string, value: string) {
    originalSetItem.call(this, key, value);

    if (this === window.sessionStorage && isCavosSessionKey(key)) {
      localStorage.setItem(getMirrorKey(key), value);
    }
  };

  storageProto.removeItem = function (key: string) {
    originalRemoveItem.call(this, key);

    if (this === window.sessionStorage && isCavosSessionKey(key)) {
      localStorage.removeItem(getMirrorKey(key));
    }
  };

  storageProto.clear = function () {
    const isSessionStorage = this === window.sessionStorage;
    originalClear.call(this);

    if (isSessionStorage) {
      clearPersistedSession();
    }
  };

  (
    window as typeof window & {
      [PATCH_FLAG]?: boolean;
    }
  )[PATCH_FLAG] = true;
};

export const clearPersistedCavosNativeSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  clearPersistedSession();
};
