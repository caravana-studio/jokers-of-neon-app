import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../marketplace/config/contracts", () => ({
  GAME_API_KEY: "test-api-key",
  getApiUrl: () => "https://api.example.test",
}));

import {
  type ActiveMigration,
  type MigrationStatus,
  retryAccountMigration,
} from "./accountMigration";

const migration: ActiveMigration = {
  id: "migration-1",
  resumeToken: "resume-token",
  controllerAddress: "0x1",
  cavosAddress: "0x2",
  executors: ["0x3"],
};

const inProgressStatus: MigrationStatus = {
  id: migration.id,
  status: "transferring",
  phase: "transfers",
  transfers: {
    total: 2,
    pending: 1,
    processing: 1,
    submitted: 0,
    completed: 0,
    failed: 0,
  },
  roguelike: { status: "pending", retries: 0 },
  xp: {
    total: 0,
    pending: 0,
    processing: 0,
    submitted: 0,
    completed: 0,
    failed: 0,
  },
  cleanupRequired: false,
  canRetry: false,
  updatedAt: "2026-07-20T00:00:00.000Z",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("retryAccountMigration", () => {
  it("returns the current status when another retry already requeued the failed intents", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: false,
            code: "NO_RETRYABLE_FAILURE",
            error: "Migration has no retryable failure",
          }),
          { status: 409 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, data: inProgressStatus }), {
          status: 200,
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(retryAccountMigration(migration)).resolves.toEqual(
      inProgressStatus,
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://api.example.test/v1/user/account-migrations/migration-1",
    );
  });
});
