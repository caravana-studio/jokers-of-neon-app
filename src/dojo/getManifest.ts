import manifestMainnet from "../manifest_mainnet.json";
import manifestSlot from "../manifest_slot.json";

const mainnetHybrid = import.meta.env.VITE_HYBRID_MAINNET === "true";

export const getManifest = () => {
  return mainnetHybrid ? manifestMainnet : manifestSlot;
};
