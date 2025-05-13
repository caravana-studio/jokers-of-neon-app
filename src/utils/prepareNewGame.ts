export const prepareNewGame = ({
  setGameId,
  resetLevel,
  setHand,
  gameId,
}: {
  setGameId: (id: number) => void;
  resetLevel: () => void;
  setHand: (hand: any[]) => void;
  gameId?: number;
}) => {
  setGameId(gameId ?? 0);
  localStorage.removeItem("GAME_ID");
  resetLevel();
  setHand([]);
};
