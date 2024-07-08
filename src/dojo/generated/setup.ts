import { DojoConfig, DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { getSyncEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { Account, WeierstrassSignatureType } from "starknet";
import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { setupWorld } from "./generated";
import { world } from "./world";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
  console.log("Setting up dojo...");
  // torii client
  const toriiClient = await torii.createClient([], {
    rpcUrl: config.rpcUrl,
    toriiUrl: config.toriiUrl,
    relayUrl: "",
    worldAddress: config.manifest.world.address || "",
  });
  console.log("Torii client created");
  // create contract components
  const contractComponents = defineContractComponents(world);
  console.log("Contract components created");
  // create client components
  const clientComponents = createClientComponents({ contractComponents });
  console.log("Client components created");
  // fetch all existing entities from torii
  const sync = await getSyncEntities(
    toriiClient,
    contractComponents as any,
    [],
    1000
  );
  console.log("Sync entities fetched");
  // create dojo provider
  const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);
  console.log("Dojo provider created");
  // setup world
  const client = await setupWorld(dojoProvider);
  console.log("Client created");
  // create burner manager
  const burnerManager = new BurnerManager({
    masterAccount: new Account(
      {
        nodeUrl: config.rpcUrl,
      },
      config.masterAddress,
      config.masterPrivateKey
    ),
    accountClassHash: config.accountClassHash,
    rpcProvider: dojoProvider.provider,
    feeTokenAddress: config.feeTokenAddress,
  });
  console.log("Burner manager created");
  try {
    await burnerManager.init();
    if (burnerManager.list().length === 0) {
      await burnerManager.create();
    }
  } catch (e) {
    console.error(e);
  }
  console.log("Burner manager initialized");
  return {
    client,
    clientComponents,
    contractComponents,
    systemCalls: createSystemCalls(
      { client },
      contractComponents,
      clientComponents
    ),
    publish: (typedData: string, signature: WeierstrassSignatureType) => {
      toriiClient.publishMessage(typedData, {
        r: signature.r.toString(),
        s: signature.s.toString(),
      });
    },
    config,
    dojoProvider,
    burnerManager,
    toriiClient,
    sync,
  };
}
