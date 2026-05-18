import { GameStateEnum } from "../dojo/typescript/custom";

type GameWithStatus = {
  status: string;
};

export const isGameInProgress = (game: GameWithStatus) =>
  game.status !== GameStateEnum.GameOver;

export const getInProgressGames = <T extends GameWithStatus>(
  games?: T[] | null
) => (games ?? []).filter(isGameInProgress);

export const hasInProgressGames = (games?: GameWithStatus[] | null) =>
  getInProgressGames(games).length > 0;
