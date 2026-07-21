import { RpcProvider, type Call } from "starknet";
import { NFT_CONTRACT_ADDRESS } from "../../marketplace/config/contracts";
import { migrateMainnetRpcUrl } from "../../utils/migrateMainnet";

export const ACCOUNT_MIGRATION_EXECUTORS = [
  "0x04e67200958b58c414c86d7caab796a2a4aa486ecfbdff1a0643dbbcc7f4fec8",
  "0x01497232727dc02ff1ad3d47a197a064debc6be97f658f4b302b5cbc8520be16",
  "0x04a549ce5e2f2b52cdcc49e8e9f53984768efe5d80873e8d0fb6e8e0c4146ca3",
  "0x07541c4c9fba3fd706cccaf2fef6ab3991df4d8014d0d558ad9cc9c93cfaf526",
] as const;

export const buildWorkerApprovalCalls = (
  executors: readonly string[],
  approved: boolean,
  contractAddress = NFT_CONTRACT_ADDRESS,
): Call[] => {
  if (!contractAddress) {
    throw new Error("NFT contract address is not configured");
  }
  return executors.map((executor) => ({
    contractAddress,
    entrypoint: "set_approval_for_all",
    calldata: [executor, approved ? "1" : "0"],
  }));
};

type ContractCaller = (request: {
  contractAddress: string;
  entrypoint: string;
  calldata: string[];
}) => Promise<readonly string[]>;

export const getWorkerExecutorsByApproval = async (
  owner: string,
  executors: readonly string[],
  approved: boolean,
  contractAddress = NFT_CONTRACT_ADDRESS,
  callContract?: ContractCaller,
): Promise<string[]> => {
  if (!contractAddress) {
    throw new Error("NFT contract address is not configured");
  }
  const provider = callContract
    ? null
    : new RpcProvider({ nodeUrl: migrateMainnetRpcUrl });
  const readContract =
    callContract ?? ((request) => provider!.callContract(request));
  const approvalStates = await Promise.all(
    executors.map(async (executor) => {
      const result = await readContract({
        contractAddress,
        entrypoint: "is_approved_for_all",
        calldata: [owner, executor],
      });
      return BigInt(result[0] ?? "0x0") !== 0n;
    }),
  );
  return executors.filter((_executor, index) => approvalStates[index] === approved);
};
