export const prepareNewGame = async ({
  setGameId,
  resetLevel,
  setHand,
  refetch,
  gameId,
}: {
  setGameId: (id: number) => void;
  resetLevel: () => void;
  setHand: (hand: any[]) => void;
  refetch: () => Promise<any>;
  gameId?: number;
}) => {
  setGameId(gameId ?? 0);
  localStorage.removeItem("GAME_ID");
  resetLevel();
  setHand([]);
  await refetch();
};
