import { getContractByName } from "@dojoengine/core";
import { useAccount } from "@starknet-react/core";
import { AccountInterface, CallData } from "starknet";
import { dojoConfig } from "../../dojoConfig";
import { VRF_PROVIDER_ADDRESS } from "./controller/constants";

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

export const getVrfTx = (contractName: string, account: AccountInterface) => {

    let contractAddress = getContractByName(
      dojoConfig.manifest,
      DOJO_NAMESPACE,
      contractName
    )?.address;

    return (
      {
        contractAddress: VRF_PROVIDER_ADDRESS,
        entrypoint: "request_random",
        calldata: CallData.compile({
          caller: contractAddress,
          source: { type: 0, address: account.address },
        }),
      }
    );
  };

