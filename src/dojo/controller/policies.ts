import { getContractByName } from "@dojoengine/core";
import { getManifest } from "../getManifest";
import { setupWorld } from "../typescript/contracts.gen";
import { VRF_PROVIDER_ADDRESS } from "./constants";

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

const MARKETPLACE_CONTRACT_ADDRESS =
  import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS || "";
const NFT_CONTRACT_ADDRESS =
  import.meta.env.VITE_NFT_CONTRACT_ADDRESS || "";
const STRK_ADDRESS =
  "0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D";
const ETH_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

const VRF_POLICY = {
  vrf: {
    name: "VRF",
    description: "Cartridge VRF Provider",
    contract_address: VRF_PROVIDER_ADDRESS,
    methods: [
      {
        entrypoint: "request_random",
        description: "Request a random number",
      },
    ],
  },
};

const manifest = getManifest();

interface Method {
  name: string;
  entrypoint: string;
}

interface ContractPolicy {
  methods: Method[];
}

interface SignMessagePolicy {
  types: Record<string, { name: string; type: string }[]>;
  primaryType: string;
  domain: Record<string, string>;
}

interface Policies {
  contracts: Record<string, ContractPolicy>;
  messages?: SignMessagePolicy[];
}

const formatEntrypoint = (entrypoint: string): string => {
  return entrypoint
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const sortMethods = (methods: Method[]): Method[] => {
  return [...methods].sort((a, b) =>
    a.entrypoint.localeCompare(b.entrypoint)
  );
};

const sortContracts = (
  contracts: Record<string, ContractPolicy>
): Record<string, ContractPolicy> => {
  return Object.fromEntries(
    Object.entries(contracts)
      .sort(([addressA], [addressB]) =>
        addressA.toLowerCase().localeCompare(addressB.toLowerCase())
      )
      .map(([address, policy]) => [address, policy])
  );
};

const generatePolicies = (): Policies => {
  const mockProvider = {
    execute: () => Promise.resolve({}),
    call: () => Promise.resolve({}),
  };

  const world = setupWorld(mockProvider as any);

  const policiesContracts: Record<string, ContractPolicy> = {};

  Object.entries(world).forEach(([systemName, systemObj]) => {
    const contractAddress = getContractByName(
      manifest,
      DOJO_NAMESPACE,
      systemName
    )?.address;

    if (!contractAddress) {
      console.warn(`Contract address not found for ${systemName}`);
      return;
    }

    const methods: string[] = [];

    Object.entries(systemObj as Record<string, unknown>).forEach(
      ([methodName, methodValue]) => {
        if (
          !methodName.startsWith("build") &&
          typeof methodValue === "function"
        ) {
          if (!methodName.startsWith("get")) {
            let entrypoint = methodName;
            if (/[A-Z]/.test(entrypoint)) {
              entrypoint = entrypoint.replace(/([A-Z])/g, "_$1").toLowerCase();
              if (entrypoint.startsWith("_")) {
                entrypoint = entrypoint.substring(1);
              }
            }
            methods.push(entrypoint);
          }
        }
      }
    );

    if (methods.length > 0) {
      const formattedMethods = methods.map((method) => ({
        name: formatEntrypoint(method),
        entrypoint: method,
      }));

      policiesContracts[contractAddress] = {
        methods: sortMethods(formattedMethods),
      };
    }
  });

  // Add VRF policy
  policiesContracts[VRF_POLICY.vrf.contract_address] = {
    methods: sortMethods(
      VRF_POLICY.vrf.methods.map((method) => ({
        name: formatEntrypoint(method.entrypoint),
        entrypoint: method.entrypoint,
      }))
    ),
  };

  // Add marketplace policies when contract addresses are configured
  if (MARKETPLACE_CONTRACT_ADDRESS) {
    policiesContracts[MARKETPLACE_CONTRACT_ADDRESS] = {
      methods: [
        { name: "Fill Order", entrypoint: "fill_order" },
        { name: "Cancel Order", entrypoint: "cancel_order" },
        { name: "Cancel All Orders Below", entrypoint: "cancel_all_orders_below" },
      ],
    };
    policiesContracts[STRK_ADDRESS] = {
      methods: [{ name: "Approve", entrypoint: "approve" }],
    };
    policiesContracts[ETH_ADDRESS] = {
      methods: [{ name: "Approve", entrypoint: "approve" }],
    };
    if (NFT_CONTRACT_ADDRESS) {
      policiesContracts[NFT_CONTRACT_ADDRESS] = {
        methods: [{ name: "Approve", entrypoint: "approve" }],
      };
    }
  }

  const messages: SignMessagePolicy[] = MARKETPLACE_CONTRACT_ADDRESS
    ? [
        {
          types: {
            StarknetDomain: [
              { name: "name", type: "shortstring" },
              { name: "version", type: "shortstring" },
              { name: "chainId", type: "shortstring" },
              { name: "revision", type: "shortstring" },
            ],
            Order: [{ name: "orderHash", type: "felt" }],
          },
          primaryType: "Order",
          domain: {
            name: "JokersOfNeonMarketplace",
            version: "1",
            revision: "1",
          },
        },
      ]
    : [];

  return {
    contracts: sortContracts(policiesContracts),
    ...(messages.length > 0 ? { messages } : {}),
  };
};

export const policies = generatePolicies();
