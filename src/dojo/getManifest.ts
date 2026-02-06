import manifestMainnet from "../manifest_mainnet.json";
import manifestSlot from "../manifest_slot.json";

const mainnetHybrid = import.meta.env.VITE_HYBRID_MAINNET === "true";

const normalizeManifest = (manifest: any) => {
  const abis = Array.isArray(manifest?.abis)
    ? manifest.abis
    : Array.isArray(manifest?.world?.abi)
      ? manifest.world.abi
      : [];

  if (!Array.isArray(manifest?.contracts)) {
    return { ...manifest, abis };
  }

  const contracts = manifest.contracts.map((contract: any) => {
    if (Array.isArray(contract?.abi) && contract.abi.length > 0) {
      return contract;
    }
    return { ...contract, abi: abis };
  });

  return { ...manifest, abis, contracts };
};

export const getManifest = () => {
  const manifest = mainnetHybrid ? manifestMainnet : manifestSlot;
  return normalizeManifest(manifest);
};
