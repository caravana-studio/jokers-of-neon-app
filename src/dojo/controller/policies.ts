import { getContractByName } from "@dojoengine/core";
import { getManifest } from "../getManifest";
import { setupWorld } from "../typescript/contracts.gen";
import { VRF_PROVIDER_ADDRESS } from "./constants";

const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

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

interface Policies {
  contracts: Record<string, ContractPolicy>;
}

const formatEntrypoint = (entrypoint: string): string => {
  return entrypoint
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
      policiesContracts[contractAddress] = {
        methods: methods.map((method) => ({
          name: formatEntrypoint(method),
          entrypoint: method,
        })),
      };
    }
  });

  // Add VRF policy
  policiesContracts[VRF_POLICY.vrf.contract_address] = {
    methods: VRF_POLICY.vrf.methods.map((method) => ({
      name: formatEntrypoint(method.entrypoint),
      entrypoint: method.entrypoint,
    })),
  };

  return { contracts: policiesContracts };
};

export const policies = generatePolicies();
