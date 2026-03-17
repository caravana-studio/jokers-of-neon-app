import { registerPlugin } from "@capacitor/core";
import { isNativeAndroid } from "./capacitorUtils";

const AGE_SIGNALS_STORAGE_KEY = "play_age_signals_snapshot_v1";

export type AgeSignalsUserStatus =
  | "VERIFIED"
  | "SUPERVISED"
  | "SUPERVISED_APPROVAL_PENDING"
  | "SUPERVISED_APPROVAL_DENIED"
  | "UNKNOWN"
  | "DECLARED"
  | "UNSPECIFIED";

interface AgeSignalsNativeResult {
  success: boolean;
  available: boolean;
  userStatus?: string;
  rawUserStatus?: number;
  ageLower?: number;
  ageUpper?: number;
  installId?: string;
  mostRecentApprovalDate?: string;
  mostRecentApprovalDateMs?: number;
  checkedAt?: string;
  errorCode?: number;
  errorName?: string;
  errorMessage?: string;
  retryable?: boolean;
}

interface AgeSignalsBridgePlugin {
  getAgeSignals(): Promise<AgeSignalsNativeResult>;
}

export interface AgeSignalsSnapshot {
  success: boolean;
  available: boolean;
  userStatus: AgeSignalsUserStatus | null;
  rawUserStatus: number | null;
  ageLower: number | null;
  ageUpper: number | null;
  installId: string | null;
  mostRecentApprovalDate: string | null;
  mostRecentApprovalDateMs: number | null;
  checkedAt: string;
  errorCode: number | null;
  errorName: string | null;
  errorMessage: string | null;
  retryable: boolean;
}

const knownStatuses: Set<AgeSignalsUserStatus> = new Set([
  "VERIFIED",
  "SUPERVISED",
  "SUPERVISED_APPROVAL_PENDING",
  "SUPERVISED_APPROVAL_DENIED",
  "UNKNOWN",
  "DECLARED",
  "UNSPECIFIED",
]);

const AgeSignalsBridge = registerPlugin<AgeSignalsBridgePlugin>("AgeSignalsBridge", {
  web: () =>
    Promise.resolve({
      getAgeSignals: async () => ({
        success: false,
        available: false,
        errorName: "UNSUPPORTED_PLATFORM",
        errorMessage:
          "Play Age Signals is only available on Android apps distributed by Google Play.",
        retryable: false,
        checkedAt: new Date().toISOString(),
      }),
    }),
});

const normalizeStatus = (value?: string): AgeSignalsUserStatus | null => {
  if (!value) return null;
  return knownStatuses.has(value as AgeSignalsUserStatus)
    ? (value as AgeSignalsUserStatus)
    : null;
};

const normalizeSnapshot = (
  nativeResult: Partial<AgeSignalsNativeResult>
): AgeSignalsSnapshot => ({
  success: nativeResult.success === true,
  available: nativeResult.available === true,
  userStatus: normalizeStatus(nativeResult.userStatus),
  rawUserStatus:
    typeof nativeResult.rawUserStatus === "number"
      ? nativeResult.rawUserStatus
      : null,
  ageLower: typeof nativeResult.ageLower === "number" ? nativeResult.ageLower : null,
  ageUpper: typeof nativeResult.ageUpper === "number" ? nativeResult.ageUpper : null,
  installId:
    typeof nativeResult.installId === "string" ? nativeResult.installId : null,
  mostRecentApprovalDate:
    typeof nativeResult.mostRecentApprovalDate === "string"
      ? nativeResult.mostRecentApprovalDate
      : null,
  mostRecentApprovalDateMs:
    typeof nativeResult.mostRecentApprovalDateMs === "number"
      ? nativeResult.mostRecentApprovalDateMs
      : null,
  checkedAt:
    typeof nativeResult.checkedAt === "string"
      ? nativeResult.checkedAt
      : new Date().toISOString(),
  errorCode:
    typeof nativeResult.errorCode === "number" ? nativeResult.errorCode : null,
  errorName:
    typeof nativeResult.errorName === "string" ? nativeResult.errorName : null,
  errorMessage:
    typeof nativeResult.errorMessage === "string" ? nativeResult.errorMessage : null,
  retryable: nativeResult.retryable === true,
});

const saveSnapshot = (snapshot: AgeSignalsSnapshot): void => {
  try {
    localStorage.setItem(AGE_SIGNALS_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore local storage failures.
  }
};

export const getCachedAgeSignals = (): AgeSignalsSnapshot | null => {
  try {
    const raw = localStorage.getItem(AGE_SIGNALS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AgeSignalsNativeResult>;
    return normalizeSnapshot(parsed);
  } catch {
    return null;
  }
};

export const fetchAndStoreAgeSignals = async (): Promise<AgeSignalsSnapshot | null> => {
  if (!isNativeAndroid) return null;

  try {
    const nativeResult = await AgeSignalsBridge.getAgeSignals();
    const snapshot = normalizeSnapshot(nativeResult);
    saveSnapshot(snapshot);
    return snapshot;
  } catch (error) {
    const snapshot = normalizeSnapshot({
      success: false,
      available: false,
      errorName: "BRIDGE_ERROR",
      errorMessage: error instanceof Error ? error.message : "Unknown bridge error",
      retryable: false,
      checkedAt: new Date().toISOString(),
    });
    saveSnapshot(snapshot);
    return snapshot;
  }
};

export const isAgeSignalsMinor = (snapshot: AgeSignalsSnapshot | null): boolean => {
  if (!snapshot || !snapshot.success || !snapshot.available) {
    return false;
  }

  if (
    snapshot.userStatus === "SUPERVISED" ||
    snapshot.userStatus === "SUPERVISED_APPROVAL_PENDING" ||
    snapshot.userStatus === "SUPERVISED_APPROVAL_DENIED"
  ) {
    return true;
  }

  if (snapshot.userStatus === "VERIFIED") {
    return false;
  }

  if (snapshot.ageUpper !== null) {
    return snapshot.ageUpper < 18;
  }

  if (snapshot.ageLower !== null) {
    return snapshot.ageLower < 18;
  }

  return false;
};

export const shouldBlockLootBoxPurchases = async (): Promise<boolean> => {
  if (!isNativeAndroid) return false;
  const cached = getCachedAgeSignals();
  if (cached) return isAgeSignalsMinor(cached);

  const fresh = await fetchAndStoreAgeSignals();
  return isAgeSignalsMinor(fresh);
};
