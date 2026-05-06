import { Account, RpcProvider } from "starknet";
import { wallet_evm } from "../constants/general";
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
const GAME_LOOP_BURNER_BLOCKCHAIN = "celo";

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
    if (!parsed?.burnerAddress || !parsed?.burnerPrivateKey) {
      return null;
    }

    return {
      blockchain: parsed.blockchain ?? GAME_LOOP_BURNER_BLOCKCHAIN,
      userAddress: parsed.userAddress ?? wallet_evm,
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
  if (typeof window === "undefined") return null;

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

export async function ensureGameLoopBurnerSession() {
  const existingSession = getStoredGameLoopBurnerSession();
  if (existingSession) {
    return existingSession;
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ensureGameLoopBurnerSession: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const requestUrl = `${getGameApiBaseUrl()}/api/game/burner/${GAME_LOOP_BURNER_BLOCKCHAIN}/${wallet_evm}`;
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
    blockchain: data.blockchain ?? GAME_LOOP_BURNER_BLOCKCHAIN,
    userAddress: data.user_address,
    slotInstance: data.slot_instance ?? "",
    burnerAddress: data.burner_address,
    burnerPrivateKey: data.burner_private_key,
  };

  saveGameLoopBurnerSession(session);
  return session;
}
