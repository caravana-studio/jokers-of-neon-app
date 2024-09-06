import { DojoConfig, DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { getSyncEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { Account, ArraySignatureType, RpcProvider } from "starknet";
import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { setupWorld } from "./typescript/contracts.gen";
import { defineContractComponents } from "./typescript/models.gen";
import { world } from "./world";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
  // torii client
  const toriiClient = await torii.createClient({
    rpcUrl: config.rpcUrl,
    toriiUrl: config.toriiUrl,
    relayUrl: "",
    worldAddress: config.manifest.world.address || "",
  });

  // create contract components
  const contractComponents = defineContractComponents(world);

  // create client components
  const clientComponents = createClientComponents({ contractComponents });

  // create dojo provider
  const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

  const sync = await getSyncEntities(
    toriiClient,
    contractComponents as any,
    []
  );

  // setup world
  const client = await setupWorld(dojoProvider);

  const rpcProvider = new RpcProvider({
    nodeUrl: config.rpcUrl,
  });


  // create burner manager
  const burnerManager = new BurnerManager({
    masterAccount: new Account(
            rpcProvider,

      config.masterAddress,
      config.masterPrivateKey
    ),
    accountClassHash: config.accountClassHash,
    rpcProvider: rpcProvider,
    feeTokenAddress: config.feeTokenAddress,
  });

  try {
    await burnerManager.init();
  } catch (e) {
    console.error(e);
  }

  return {
    client,
    clientComponents,
    contractComponents,
    systemCalls: createSystemCalls({ client }, clientComponents, world),
    publish: (typedData: string, signature: ArraySignatureType) => {
      toriiClient.publishMessage(typedData, signature);
    },
    config,
    world,
    burnerManager,
    toriiClient,
    rpcProvider,
    sync,
  };
}
