import { DojoConfig, DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { Component, Metadata, Schema } from "@dojoengine/recs";
import { getSyncEntities, setEntities, syncEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { Account, ArraySignatureType } from "starknet";
import { GAME_ID } from "../constants/localStorage";
import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { setupWorld } from "./typescript/contracts.gen";
import { defineContractComponents } from "./typescript/defineContractComponents";
import { world } from "./world";

import type { ToriiClient } from "@dojoengine/torii-client";
import { KeysClause } from "@dojoengine/sdk";

export type SetupResult = Awaited<ReturnType<typeof setup>>;
const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";

let sync: any;

const getEntities = async <S extends Schema>(
  client: ToriiClient,
  components: Component<S, Metadata, undefined>[],
  query: torii.Query,
  limit: number = 100
) => {
  let cursor = undefined;
  let continueFetching = true;
  let attempts = 0;

  while (continueFetching) {
    query.pagination.cursor = cursor;

    const fetchedEntities = await client.getEntities(query);

    if (fetchedEntities.items.length === 0) {
      console.log("retry: ", fetchedEntities.items);
      if (attempts < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      }
      console.log("try: ", attempts);
      attempts++;

      continue;
    }

    setEntities(fetchedEntities.items, components);
    console.log(fetchedEntities.items);

    if (Object.keys(fetchedEntities).length < limit) {
      continueFetching = false;
    } else {
      cursor = fetchedEntities.next_cursor;
    }
  }
};

export async function setup({ ...config }: DojoConfig) {
  // torii client
  const toriiClient = await new torii.ToriiClient({
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

  type ClientComponentsKeys = keyof typeof clientComponents;
  const defaultNameSpace = `${DOJO_NAMESPACE}-`;
  const componentNames: string[] = [];

  (Object.keys(clientComponents) as ClientComponentsKeys[]).forEach((key) => {
    const component = clientComponents[key];
    const name = defaultNameSpace + component.metadata.name;
    componentNames.push(name);
  });

  async function syncEntitiesForGameID() {
    let gameID = localStorage.getItem(GAME_ID) || undefined;

    const memberGame: torii.MemberClause = {
      model: `${DOJO_NAMESPACE}-Game`,
      member: "id",
      operator: "Eq",
      value: { Primitive: { U64: Number(gameID) || 0 } },
    };

    const memberDeckCard: torii.MemberClause = {
      model: `${DOJO_NAMESPACE}-DeckCard`,
      member: "game_id",
      operator: "Eq",
      value: { Primitive: { U64: Number(gameID) || 0 } },
    };

    const keysMod: torii.KeysClause = {
      keys: [undefined],
      pattern_matching: "FixedLen",
      models: [`${DOJO_NAMESPACE}-GameMod`],
    };

    const clause: torii.Clause = {
      Composite: {
        operator: "Or",
        clauses: [
          {
            Member: memberGame,
          },
          { Member: memberDeckCard },
        ],
      },
    };

    const query: torii.Query = {
      pagination: {
        limit: 1000,
        direction: "Forward",
        order_by: [],
        cursor: undefined,
      },
      clause: clause,
      no_hashed_keys: false,
      models: [],
      historical: false,
    };

    if (gameID) {
      const startTime = performance.now();
      await getEntities(toriiClient, contractComponents as any, query, 1000);
      sync = await syncEntities(toriiClient, contractComponents as any, clause);

      const endTime = performance.now();
      const timeTaken = endTime - startTime;
      // Log for load time
      console.log(`getSyncEntities took ${timeTaken.toFixed(2)} milliseconds`);
    }
    // TODO: Get the mod entities
  }

  // setup world
  const client = await setupWorld(dojoProvider);

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

  try {
    await burnerManager.init();
    if (burnerManager.list().length === 0) {
      await burnerManager.create();
    }
  } catch (e) {
    console.error(e);
  }

  // const sync = await getSyncEntities(
  //   toriiClient,
  //   contractComponents as any,
  //   KeysClause([], [], "VariableLen").build(),
  //   [],
  //   [],
  //   3000,
  //   true
  // );
  await syncEntitiesForGameID();

  return {
    client,
    clientComponents,
    contractComponents,
    systemCalls: createSystemCalls({ client }, clientComponents, world),
    publish: (typedData: string, signature: ArraySignatureType) => {
      toriiClient.publishMessage(typedData, signature);
    },
    config,
    dojoProvider,
    burnerManager,
    toriiClient,
    sync,
    syncCallback: async () => await syncEntitiesForGameID(),
  };
}
