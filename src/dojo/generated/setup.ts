import { DojoConfig, DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { setEntities, syncEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { Account, WeierstrassSignatureType, RpcProvider } from "starknet";
import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { setupWorld } from "./generated";
import { world } from "./world";
import { Component, Metadata, Schema } from "@dojoengine/recs";
import { GAME_ID } from "../../constants/localStorage.ts";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

let sync: any;

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

  const getEntities = async <S extends Schema>(
    client: torii.ToriiClient,
    components: Component<S, Metadata, undefined>[], query: torii.Query,
    limit: number = 100, 
    ) => {
        let cursor = 0;
        let continueFetching = true;

        while (continueFetching) {
            query.offset = cursor;
            const fetchedEntities = await client.getEntities(query);

            setEntities(fetchedEntities, components);

            if (Object.keys(fetchedEntities).length < limit) {
                continueFetching = false;
            } else {
                cursor += limit;
            }
        }
    };

  // create dojo provider
  const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);
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

  type ClientComponentsKeys = keyof typeof clientComponents;
  const componentNames: string[] = [];

  (Object.keys(clientComponents) as ClientComponentsKeys[]).forEach((key) => {
      const component = clientComponents[key];
      const name = component.metadata.name;
      componentNames.push(name);
  });
  
  async function syncEntitiesForGameID() {
    let gameID = localStorage.getItem(GAME_ID) || undefined;
 
    const keysClause: torii.KeysClause = {
      keys: [gameID],
      pattern_matching: "VariableLen",
      models: componentNames
    };
  
    const query: torii.Query = {
      limit: 10000,
      offset: 0,
      clause: { Keys: keysClause }
    };  

    if(gameID){
      const startTime = performance.now();
      await getEntities(toriiClient, contractComponents as any, query);
      sync  = await syncEntities(toriiClient, contractComponents as any, []);
      
      const endTime = performance.now();
      const timeTaken = endTime - startTime;
      // Log for load time
      console.log(`getSyncEntities took ${timeTaken.toFixed(2)} milliseconds`);
    }
  }

  await syncEntitiesForGameID();

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
    world,
    burnerManager,
    rpcProvider,
    sync,
    toriiClient,
    syncCallback: async () => await syncEntitiesForGameID(),
  };
}
