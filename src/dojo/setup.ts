import { DojoConfig, DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { Component, Metadata, Schema } from "@dojoengine/recs";
import { setEntities, syncEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { Account, ArraySignatureType } from "starknet";
import { GAME_ID } from "../constants/localStorage";
import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { setupWorld } from "./typescript/contracts.gen";
import { defineContractComponents } from "./typescript/defineContractComponents";
import { world } from "./world";

import type { Message, ToriiClient } from "@dojoengine/torii-client";
import { KeysClause } from "@dojoengine/sdk";

export type SetupResult = Awaited<ReturnType<typeof setup>>;
const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

let sync: any;

const hiddenRoutes = ["/", "/login", "/mods"];

const getEntities = async <S extends Schema>(
  client: ToriiClient,
  components: Component<S, Metadata, undefined>[],
  query: torii.Query,
  limit: number = 100,
  retry: boolean = true
) => {
  let cursor = undefined;
  let continueFetching = true;
  let attempts = 0;

  while (continueFetching) {
    query.pagination.cursor = cursor;

    const fetchedEntities = await client.getEntities(query);

    if (fetchedEntities.items.length === 0 && retry) {
      console.log("No entities found retrying...");

      if (attempts < 5) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      } else return;

      attempts++;

      continue;
    }

    setEntities(fetchedEntities.items, components);

    if (Object.keys(fetchedEntities).length < limit) {
      continueFetching = false;
    } else {
      cursor = fetchedEntities.next_cursor;
    }
  }
};

export async function setup({ ...config }: DojoConfig) {

  console.log('DOJO_NAMESPACE', DOJO_NAMESPACE)
  // torii client
  const toriiClient = await new torii.ToriiClient({
    toriiUrl: config.toriiUrl,
    // relayUrl: "",
    worldAddress: config.manifest.world.address || "",
  });

  // create contract components
  const contractComponents = defineContractComponents(world);

  // create client components
  const clientComponents = createClientComponents({ contractComponents });

  // create dojo provider
  const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

  type ClientComponentsKeys = keyof typeof clientComponents;
  const defaultNameSpace = `${DOJO_NAMESPACE}-`;
  const componentNames: string[] = [];

  (Object.keys(clientComponents) as ClientComponentsKeys[]).forEach((key) => {
    const component = clientComponents[key];
    const name = defaultNameSpace + component.metadata.name;
    componentNames.push(name);
  });

/*   async function syncEntitiesForGameID() {
    let gameID = localStorage.getItem(GAME_ID) || undefined;
    const canLoadEntities = !hiddenRoutes.includes(window.location.pathname);
    const parsedGameID = Number(gameID) || 0;

    if (!gameID || !canLoadEntities) return;

    const modelsToFetch = [
      "Game",
      "DeckCard",
      "CurrentSpecialCards",
      "BlisterPackResult",
    ];

    const modelsToNotRetry = ["CurrentSpecialCards", "BlisterPackResult"];

    const buildMemberClause = (model: string): torii.MemberClause => ({
      model: `${DOJO_NAMESPACE}-${model}`,
      member: model === "Game" ? "id" : "game_id",
      operator: "Eq",
      value: { Primitive: { U64: parsedGameID } },
    });

    const buildQuery = (model: string): torii.Query => ({
      pagination: {
        limit: 1000,
        direction: "Backward",
        order_by: [],
        cursor: undefined,
      },
      clause: { Member: buildMemberClause(model) },
      no_hashed_keys: false,
      models: [],
      historical: false,
    });

    const startTime = performance.now();

    for (const model of modelsToFetch) {
      const query = buildQuery(model);
      await getEntities(
        toriiClient,
        contractComponents as any,
        query,
        1000,
        !modelsToNotRetry.includes(model)
      );
    }

    sync = await syncEntities(
      toriiClient,
      contractComponents as any,
      KeysClause([], [], "VariableLen").build(),
      false
    );

    const endTime = performance.now();
    console.log(`getSyncEntities took ${(endTime - startTime).toFixed(2)} ms`);

    // TODO: Get the mod entities
  } */

  // setup world
  const client = await setupWorld(dojoProvider);

  console.log('config.rpcUrl', config.rpcUrl);
  console.log('config.masterAddress', config.masterAddress);
  console.log('config.masterPrivateKey', config.masterPrivateKey);
  console.log('config.accountClassHash', config.accountClassHash);
  console.log('config.feeTokenAddress', config.feeTokenAddress);
  console.log('rpcProvider', dojoProvider.provider)

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
    rpcProvider: dojoProvider.provider as any,
    feeTokenAddress: config.feeTokenAddress,
  });

  console.log('burnerManager', burnerManager);

  try {
    await burnerManager.init();
    console.log('burnerManager.list()', burnerManager.list());
    if (burnerManager.list().length === 0) {
      await burnerManager.create();
    }
  } catch (e) {
    console.log('error initializing burnerManager');
    console.error(e);
  }

  // await syncEntitiesForGameID();

  return {
    client,
    clientComponents,
    contractComponents,
    systemCalls: createSystemCalls({ client }, clientComponents, world),
    publish: (typedData: string, signature: ArraySignatureType) => {
      const msj: Message = { message: typedData, signature };
      toriiClient.publishMessage(msj);
    },
    config,
    dojoProvider,
    burnerManager,
    toriiClient,
    sync,
  };
}
