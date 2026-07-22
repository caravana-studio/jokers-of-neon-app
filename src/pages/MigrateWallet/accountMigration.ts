import { GAME_API_KEY, getApiUrl } from "../../marketplace/config/contracts";

const ACTIVE_MIGRATION_KEY = "jon_account_migration_v2";

export type MigrationIntentCounts = {
  total: number;
  pending: number;
  processing: number;
  submitted: number;
  completed: number;
  failed: number;
};

export type MigrationStatus = {
  id: string;
  status: string;
  phase: "transfers" | "roguelike" | "xp" | "cleanup" | "completed";
  transfers: MigrationIntentCounts;
  roguelike: {
    status: string;
    retries: number;
    transactionHash?: string | null;
  };
  xp: MigrationIntentCounts;
  cleanupRequired: boolean;
  canRetry: boolean;
  error?: string;
  updatedAt: string;
};

export type ActiveMigration = {
  id: string;
  resumeToken: string;
  controllerAddress: string;
  cavosAddress: string;
  executors: string[];
};

const activeIntentCount = (counts: MigrationIntentCounts) =>
  counts.pending + counts.processing + counts.submitted;

export function getMigrationFailedItemCount(status: MigrationStatus): number {
  return (
    status.transfers.failed +
    status.xp.failed +
    (status.roguelike.status === "failed" ? 1 : 0)
  );
}

export function isAccountMigrationRetryReady(status: MigrationStatus): boolean {
  const isTerminalFailure =
    status.status === "failed" || status.status.endsWith("_failed");
  const currentPhaseHasActiveWork = (() => {
    if (status.phase === "transfers") {
      return activeIntentCount(status.transfers) > 0;
    }
    if (status.phase === "xp") {
      return activeIntentCount(status.xp) > 0;
    }
    if (status.phase === "roguelike") {
      return status.roguelike.status !== "completed" &&
        status.roguelike.status !== "failed";
    }
    return false;
  })();

  return (
    status.canRetry &&
    isTerminalFailure &&
    !currentPhaseHasActiveWork &&
    getMigrationFailedItemCount(status) > 0
  );
}

type ApiErrorResponse = { success?: false; code?: string; error?: string };

type AccountMigrationApiError = Error & { code?: string };

function apiHeaders(resumeToken?: string): HeadersInit {
  if (!GAME_API_KEY) {
    throw new Error("Account migration API key is not configured");
  }
  return {
    "Content-Type": "application/json",
    "X-API-Key": GAME_API_KEY,
    ...(resumeToken ? { Authorization: `Bearer ${resumeToken}` } : {}),
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const result = (await response.json()) as T | ApiErrorResponse;
  if (!response.ok || ("success" in (result as object) && (result as any).success === false)) {
    const apiError = result as ApiErrorResponse;
    const error = new Error(apiError.error || "Account migration request failed");
    (error as Error & { code?: string }).code = apiError.code;
    throw error;
  }
  return result as T;
}

export async function createAccountMigration(input: {
  controllerAddress: string;
  cavosAddress: string;
  approvalTransactionHash?: string;
  executors: string[];
}): Promise<ActiveMigration> {
  const response = await fetch(
    `${getApiUrl().replace(/\/$/, "")}/v1/user/account-migrations`,
    {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({
        controller_address: input.controllerAddress,
        cavos_address: input.cavosAddress,
        ...(input.approvalTransactionHash
          ? { approval_transaction_hash: input.approvalTransactionHash }
          : {}),
      }),
    },
  );
  const result = await parseResponse<{
    success: true;
    data: { id: string };
    resume_token: string;
  }>(response);
  const migration: ActiveMigration = {
    id: result.data.id,
    resumeToken: result.resume_token,
    controllerAddress: input.controllerAddress,
    cavosAddress: input.cavosAddress,
    executors: input.executors,
  };
  storeActiveMigration(migration);
  return migration;
}

export async function getAccountMigrationStatus(
  migration: ActiveMigration,
  signal?: AbortSignal,
): Promise<MigrationStatus> {
  const response = await fetch(
    `${getApiUrl().replace(/\/$/, "")}/v1/user/account-migrations/${migration.id}`,
    { headers: apiHeaders(migration.resumeToken), signal },
  );
  const result = await parseResponse<{ success: true; data: MigrationStatus }>(response);
  return result.data;
}

export async function retryAccountMigration(
  migration: ActiveMigration,
): Promise<MigrationStatus> {
  try {
    const response = await fetch(
      `${getApiUrl().replace(/\/$/, "")}/v1/user/account-migrations/${migration.id}/retry`,
      { method: "POST", headers: apiHeaders(migration.resumeToken) },
    );
    const result = await parseResponse<{
      success: true;
      data: MigrationStatus;
    }>(response);
    return result.data;
  } catch (error) {
    const apiError = error as AccountMigrationApiError;
    const retryWasAlreadyApplied =
      apiError.code === "NO_RETRYABLE_FAILURE" ||
      apiError.message === "Migration has no retryable failure";

    if (!retryWasAlreadyApplied) throw error;

    // Another request or the worker may have already moved the failed intents
    // back into the queue. Reconcile with the durable migration state so retry
    // remains idempotent from the user's perspective.
    return getAccountMigrationStatus(migration);
  }
}

export async function confirmAccountMigrationCleanup(
  migration: ActiveMigration,
  cleanupTransactionHash: string,
): Promise<MigrationStatus> {
  const response = await fetch(
    `${getApiUrl().replace(/\/$/, "")}/v1/user/account-migrations/${migration.id}/cleanup`,
    {
      method: "POST",
      headers: apiHeaders(migration.resumeToken),
      body: JSON.stringify({ cleanup_transaction_hash: cleanupTransactionHash }),
    },
  );
  const result = await parseResponse<{ success: true; data: MigrationStatus }>(response);
  return result.data;
}

export function storeActiveMigration(migration: ActiveMigration): void {
  localStorage.setItem(ACTIVE_MIGRATION_KEY, JSON.stringify(migration));
}

export function readActiveMigration(
  controllerAddress: string,
  cavosAddress: string,
): ActiveMigration | null {
  try {
    const raw = localStorage.getItem(ACTIVE_MIGRATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveMigration;
    if (
      parsed.controllerAddress.toLowerCase() !== controllerAddress.toLowerCase() ||
      parsed.cavosAddress.toLowerCase() !== cavosAddress.toLowerCase()
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearActiveMigration(): void {
  localStorage.removeItem(ACTIVE_MIGRATION_KEY);
}
