import { describe, expect, it } from "vitest";
import {
  ACCOUNT_MIGRATION_EXECUTORS,
  buildWorkerApprovalCalls,
  getWorkerExecutorsByApproval,
} from "./nftMigration";

describe("buildWorkerApprovalCalls", () => {
  const executors = ["0x1", "0x2", "0x3", "0x4", "0x5"];

  it("builds one approval call per worker", () => {
    const calls = buildWorkerApprovalCalls(executors, true, "0xabc");
    expect(calls).toHaveLength(5);
    expect(calls.map((call) => call.calldata)).toEqual(
      executors.map((executor) => [executor, "1"]),
    );
  });

  it("builds one revocation call per worker", () => {
    const calls = buildWorkerApprovalCalls(executors, false, "0xabc");
    expect(calls).toHaveLength(5);
    expect(calls.map((call) => call.calldata)).toEqual(
      executors.map((executor) => [executor, "0"]),
    );
  });
});

describe("getWorkerExecutorsByApproval", () => {
  it("returns only executors whose approval matches the requested state", async () => {
    const approvals = new Map([
      ["0x1", "0x1"],
      ["0x2", "0x0"],
      ["0x3", "0x1"],
    ]);
    const callContract = async ({ calldata }: { calldata: string[] }) => [
      approvals.get(calldata[1]) ?? "0x0",
    ];

    await expect(
      getWorkerExecutorsByApproval(
        "0xowner",
        ["0x1", "0x2", "0x3"],
        false,
        "0xnft",
        callContract,
      ),
    ).resolves.toEqual(["0x2"]);
    await expect(
      getWorkerExecutorsByApproval(
        "0xowner",
        ["0x1", "0x2", "0x3"],
        true,
        "0xnft",
        callContract,
      ),
    ).resolves.toEqual(["0x1", "0x3"]);
  });
});

describe("ACCOUNT_MIGRATION_EXECUTORS", () => {
  it("contains only the four approved worker wallets", () => {
    expect(ACCOUNT_MIGRATION_EXECUTORS).toEqual([
      "0x04e67200958b58c414c86d7caab796a2a4aa486ecfbdff1a0643dbbcc7f4fec8",
      "0x01497232727dc02ff1ad3d47a197a064debc6be97f658f4b302b5cbc8520be16",
      "0x04a549ce5e2f2b52cdcc49e8e9f53984768efe5d80873e8d0fb6e8e0c4146ca3",
      "0x07541c4c9fba3fd706cccaf2fef6ab3991df4d8014d0d558ad9cc9c93cfaf526",
    ]);
  });
});
