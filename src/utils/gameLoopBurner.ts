import { Account, RpcProvider } from "starknet";
import { getGameApiBaseUrl } from "../config/gameApiUrl";

export type GameLoopBurnerSession = {
  blockchain: string;
  userAddress: string;
  slotInstance: string;
  burnerAddress: string;
  burnerPrivateKey: string;
};

type BurnerApiResponse = {
  success?: boolean;
  data?: {
    blockchain?: string;
    user_address?: string;
    slot_instance?: string;
    burner_address?: string;
    burner_private_key?: string;
  };
};

export const GAME_LOOP_BURNER_SESSION_STORAGE_KEY =
  "GAME_LOOP_BURNER_SESSION";

const GAME_LOOP_BURNER_SESSION_EVENT = "game-loop-burner-session-updated";
const DEFAULT_BLOCKCHAIN = "starknet";

type InjectedEvmProvider = {
  isMiniPay?: boolean;
  request: (args: {
    method: string;
    params?: unknown[];
  }) => Promise<unknown>;
};

export function getGameLoopBlockchain() {
  return import.meta.env.VITE_BLOCKCHAIN?.trim() || DEFAULT_BLOCKCHAIN;
}

export function isGameLoopBurnerEnabled() {
  return getGameLoopBlockchain() !== DEFAULT_BLOCKCHAIN;
}

function getGameLoopUserAddress() {
  return import.meta.env.VITE_ETH_TEST_ADDRESS?.trim() || "";
}

function notifyGameLoopBurnerSessionUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(GAME_LOOP_BURNER_SESSION_EVENT));
}

function parseGameLoopBurnerSession(
  value: string | null
): GameLoopBurnerSession | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<GameLoopBurnerSession>;
    if (
      !parsed?.burnerAddress ||
      !parsed?.burnerPrivateKey ||
      !parsed?.userAddress
    ) {
      return null;
    }

    return {
      blockchain: parsed.blockchain ?? getGameLoopBlockchain(),
      userAddress: parsed.userAddress,
      slotInstance: parsed.slotInstance ?? "",
      burnerAddress: parsed.burnerAddress,
      burnerPrivateKey: parsed.burnerPrivateKey,
    };
  } catch (error) {
    console.error("Could not parse stored burner session", error);
    return null;
  }
}

export function getStoredGameLoopBurnerSession(): GameLoopBurnerSession | null {
  if (typeof window === "undefined" || !isGameLoopBurnerEnabled()) {
    return null;
  }

  return parseGameLoopBurnerSession(
    window.localStorage.getItem(GAME_LOOP_BURNER_SESSION_STORAGE_KEY)
  );
}

export function saveGameLoopBurnerSession(session: GameLoopBurnerSession) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    GAME_LOOP_BURNER_SESSION_STORAGE_KEY,
    JSON.stringify(session)
  );
  notifyGameLoopBurnerSessionUpdated();
}

export function clearGameLoopBurnerSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(GAME_LOOP_BURNER_SESSION_STORAGE_KEY);
  notifyGameLoopBurnerSessionUpdated();
}

export function subscribeToGameLoopBurnerSession(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(GAME_LOOP_BURNER_SESSION_EVENT, listener);
  return () => {
    window.removeEventListener(GAME_LOOP_BURNER_SESSION_EVENT, listener);
  };
}

export function createGameLoopBurnerAccount(
  session: GameLoopBurnerSession,
  provider: RpcProvider
) {
  return new Account({
    provider,
    address: session.burnerAddress,
    signer: session.burnerPrivateKey,
  });
}

export function getInjectedProvider(): InjectedEvmProvider | null {
  if (typeof window === "undefined") {
    return null;
  }

  const provider = (window as Window & { ethereum?: InjectedEvmProvider })
    .ethereum;
  return provider ?? null;
}

export function hasMiniPayWallet() {
  return Boolean(getInjectedProvider()?.isMiniPay);
}

export function hasMiniPayWalletOrFallbackAddress() {
  return hasMiniPayWallet() || Boolean(getGameLoopUserAddress());
}

async function requestInjectedAccounts(provider: InjectedEvmProvider) {
  const existingAccounts = await provider.request({
    method: "eth_accounts",
    params: [],
  });

  if (Array.isArray(existingAccounts) && typeof existingAccounts[0] === "string") {
    return existingAccounts as string[];
  }

  const requestedAccounts = await provider.request({
    method: "eth_requestAccounts",
    params: [],
  });

  if (Array.isArray(requestedAccounts) && typeof requestedAccounts[0] === "string") {
    return requestedAccounts as string[];
  }

  return [];
}

async function resolveGameLoopUserAddress() {
  const provider = getInjectedProvider();
  if (provider?.isMiniPay) {
    const accounts = await requestInjectedAccounts(provider);
    const address = accounts[0]?.trim();

    if (address) {
      return address;
    }
  }

  const fallbackAddress = getGameLoopUserAddress();
  if (fallbackAddress) {
    return fallbackAddress;
  }

  throw new Error(
    "ensureGameLoopBurnerSession: Could not resolve a MiniPay wallet address from window.ethereum or VITE_ETH_TEST_ADDRESS"
  );
}

export async function ensureGameLoopBurnerSession() {
  if (!isGameLoopBurnerEnabled()) {
    throw new Error(
      "ensureGameLoopBurnerSession: VITE_BLOCKCHAIN must be set to a non-starknet value"
    );
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ensureGameLoopBurnerSession: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const blockchain = getGameLoopBlockchain();
  const userAddress = await resolveGameLoopUserAddress();
  const existingSession = getStoredGameLoopBurnerSession();

  if (
    existingSession &&
    existingSession.blockchain === blockchain &&
    existingSession.userAddress.toLowerCase() === userAddress.toLowerCase()
  ) {
    return existingSession;
  }

  const requestUrl = `${getGameApiBaseUrl()}/api/game/burner/${blockchain}/${userAddress}`;
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `ensureGameLoopBurnerSession: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: BurnerApiResponse = await response.json();
  const data = json.data;

  if (
    !json.success ||
    !data?.burner_address ||
    !data?.burner_private_key ||
    !data?.user_address
  ) {
    throw new Error(
      "ensureGameLoopBurnerSession: API did not return a valid burner payload"
    );
  }

  const session: GameLoopBurnerSession = {
    blockchain: data.blockchain ?? blockchain,
    userAddress: data.user_address,
    slotInstance: data.slot_instance ?? "",
    burnerAddress: data.burner_address,
    burnerPrivateKey: data.burner_private_key,
  };

  saveGameLoopBurnerSession(session);
  return session;
}
