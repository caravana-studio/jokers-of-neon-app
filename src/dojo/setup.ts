import { DojoConfig, DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { Component, Metadata, Schema } from "@dojoengine/recs";
import { setEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { Account, ArraySignatureType, RpcProvider } from "starknet";
import { usesCustomKatanaEndpoint } from "../config/cartridgeUrls";
import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { setupWorld } from "./typescript/contracts.gen";
import { defineContractComponents } from "./typescript/defineContractComponents";
import { withSlotNoFeeExecuteOptions } from "./slotNoFeeExecuteOptions";
import { world } from "./world";

import type { Message, ToriiClient } from "@dojoengine/torii-client";

export type SetupResult = Awaited<ReturnType<typeof setup>>;
const DOJO_NAMESPACE =
  import.meta.env.VITE_DOJO_NAMESPACE || "jokers_of_neon_core";
const shouldBootstrapFrontendBurner = () =>
  (import.meta.env.VITE_BLOCKCHAIN?.trim() || "starknet") === "starknet";

let sync: any;

type AccountNoFeePatchTarget = {
  execute: (...args: any[]) => Promise<unknown>;
  deployAccount: (...args: any[]) => Promise<unknown>;
};

let accountNoFeePatchDepth = 0;
let originalAccountExecute: AccountNoFeePatchTarget["execute"] | null = null;
let originalAccountDeploy: AccountNoFeePatchTarget["deployAccount"] | null =
  null;

const runWithNoFeeAccountDefaults = async <T,>(
  operation: () => Promise<T>
): Promise<T> => {
  if (!usesCustomKatanaEndpoint) {
    return operation();
  }

  const accountPrototype = Account.prototype as unknown as AccountNoFeePatchTarget;

  if (accountNoFeePatchDepth === 0) {
    originalAccountExecute = accountPrototype.execute;
    originalAccountDeploy = accountPrototype.deployAccount;

    accountPrototype.execute = function (
      this: Account,
      transactions: unknown,
      details: unknown = {},
      ...rest: unknown[]
    ) {
      return originalAccountExecute!.call(
        this,
        transactions,
        withSlotNoFeeExecuteOptions((details ?? {}) as any),
        ...rest
      );
    };

    accountPrototype.deployAccount = function (
      this: Account,
      contractPayload: unknown,
      details: unknown = {},
      ...rest: unknown[]
    ) {
      return originalAccountDeploy!.call(
        this,
        contractPayload,
        withSlotNoFeeExecuteOptions((details ?? {}) as any),
        ...rest
      );
    };
  }

  accountNoFeePatchDepth++;

  try {
    return await operation();
  } finally {
    accountNoFeePatchDepth--;

    if (accountNoFeePatchDepth === 0) {
      if (originalAccountExecute) {
        accountPrototype.execute = originalAccountExecute;
      }
      if (originalAccountDeploy) {
        accountPrototype.deployAccount = originalAccountDeploy;
      }

      originalAccountExecute = null;
      originalAccountDeploy = null;
    }
  }
};

const patchBurnerManagerNoFeeCreate = (burnerManager: BurnerManager) => {
  if (!usesCustomKatanaEndpoint) {
    return;
  }

  const manager = burnerManager as BurnerManager & {
    __jokersNoFeeCreatePatched?: boolean;
  };

  if (manager.__jokersNoFeeCreatePatched) {
    return;
  }

  const create = manager.create.bind(manager) as (...args: any[]) => ReturnType<
    BurnerManager["create"]
  >;
  (manager as any).create = (...args: any[]) =>
    runWithNoFeeAccountDefaults(() => create(...args));
  manager.__jokersNoFeeCreatePatched = true;
};

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
  const originalExecute = dojoProvider.execute.bind(dojoProvider);
  const executeWithSlotNoFeeTip: typeof dojoProvider.execute = (
    account,
    call,
    nameSpace,
    details = {}
  ) => originalExecute(
    account,
    call,
    nameSpace,
    withSlotNoFeeExecuteOptions(details)
  );
  dojoProvider.execute = executeWithSlotNoFeeTip;

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

  // create burner manager
  const burnerManager = new BurnerManager({
    masterAccount: new Account({
      provider: new RpcProvider({ nodeUrl: config.rpcUrl }),
      address: config.masterAddress,
      signer: config.masterPrivateKey,
    }),
    accountClassHash: config.accountClassHash,
    rpcProvider: dojoProvider.provider as any,
    feeTokenAddress: config.feeTokenAddress,
  });
  patchBurnerManagerNoFeeCreate(burnerManager);

  try {
    await burnerManager.init();
    if (shouldBootstrapFrontendBurner() && burnerManager.list().length === 0) {
      await burnerManager.create();
    }
  } catch (e) {
    console.log("error initializing burnerManager");
    console.error(e);
  }

  // await syncEntitiesForGameID();

  return {
    client,
    clientComponents,
    contractComponents,
    systemCalls: createSystemCalls({ client }, clientComponents, world),
    publish: (typedData: string, signature: ArraySignatureType) => {
      const msj: Message = {
        message: typedData,
        signature,
        world_address: config.manifest.world.address || "",
      };
      toriiClient.publishMessage(msj);
    },
    config,
    dojoProvider,
    burnerManager,
    toriiClient,
    sync,
  };
}
