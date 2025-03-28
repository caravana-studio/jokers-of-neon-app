import { getContractByName } from "@dojoengine/core";
import { shortString } from "starknet";
import { useDojo } from "../dojo/DojoContext";
import manifest from "../manifest_tournaments.json";
import { getNumberValueFromEvent } from "../utils/getNumberValueFromEvent";

const TOURNAMENT_NAMESPACE =
  import.meta.env.VITE_TOURNAMENT_NAMESPACE || "budokan";
const TOURNAMENT_CONTRACT_NAME =
  import.meta.env.VITE_TOURNAMENT_CONTRACT_NAME || "tournament_mock";

const TOURNAMENT_CONTRACT_ADDRESS = getContractByName(
  manifest,
  TOURNAMENT_NAMESPACE,
  TOURNAMENT_CONTRACT_NAME
)?.address;

const REGISTRATION_EVENT_KEY =
  import.meta.env.VITE_REGISTRATION_EVENT_KEY ||
  "0x2f01dd863550300355e99ebfc08524ac0d60d424c59eda114a54140df28d8ac";

const BLAST_URL =
  import.meta.env.VITE_BLAST_URL ||
  "https://starknet-mainnet.blastapi.io/f3cfa120-6cef-4856-8ef3-1fcaf1a438a9";

export const useTournaments = () => {
  const {
    account: { account },
  } = useDojo();

  const GET_GAMES_URL = `${BLAST_URL}/builder/getWalletNFTs?contractAddress=${TOURNAMENT_CONTRACT_ADDRESS}&walletAddress=${account.address}&pageSize=100`;

  const enterTournament = async (tournamentId: number, username: string) => {
    const { transaction_hash } = await account.execute({
      contractAddress: TOURNAMENT_CONTRACT_ADDRESS,
      entrypoint: "enter_tournament",
      calldata: [
        BigInt(tournamentId),
        BigInt(shortString.encodeShortString(username)),
        BigInt(account.address),
        1,
      ],
    });
    const result = await account.waitForTransaction(transaction_hash);

    const registrationEvent = (result as any).events.find(
      (e: any) => e.keys[1] === REGISTRATION_EVENT_KEY
    );

    console.log("events", (result as any).events);

    if (!registrationEvent) {
      console.error(
        "No registration event found with key",
        REGISTRATION_EVENT_KEY
      );
      return 0;
    }
    return getNumberValueFromEvent(registrationEvent, 3) ?? 0;
  };

  const getPlayerGames = async () => {
    const response = await fetch(GET_GAMES_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("data", data);
    return data;
  };

  return {
    enterTournament,
    getPlayerGames,
  };
};
