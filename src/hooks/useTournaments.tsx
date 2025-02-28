import { getContractByName } from "@dojoengine/core";
import { shortString } from "starknet";
import { useDojo } from "../dojo/DojoContext";
import manifest from "../manifest_tournaments.json";

const TOURNAMENT_NAMESPACE =
  import.meta.env.VITE_TOURNAMENT_NAMESPACE || "budokan";
const TOURNAMENT_CONTRACT_NAME =
  import.meta.env.VITE_TOURNAMENT_CONTRACT_NAME || "tournament_mock";

const TOURNAMENT_CONTRACT_ADDRESS = getContractByName(
  manifest,
  TOURNAMENT_NAMESPACE,
  TOURNAMENT_CONTRACT_NAME
)?.address;

const BLAST_URL =
  import.meta.env.VITE_BLAST_URL ||
  "https://starknet-mainnet.blastapi.io/f3cfa120-6cef-4856-8ef3-1fcaf1a438a9";

export const useTournaments = () => {
  const {
    account: { account },
  } = useDojo();

  const GET_GAMES_URL = `${BLAST_URL}/builder/getWalletNFTs?contractAddress=${TOURNAMENT_CONTRACT_ADDRESS}&walletAddress=${account.address}&pageSize=100`;

  console.log("GET_GAMES_URL", GET_GAMES_URL);
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
    return account.waitForTransaction(transaction_hash);
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
