import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../components/Loading";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useDojo } from "../dojo/useDojo";
import { useGameContext } from "../providers/GameProvider";
import { useGetMyGames } from "../queries/useGetMyGames";
import { useGameStore } from "../state/useGameStore";

export const BudokanEndpoint = () => {
  const { gameId } = useParams();
  const { data: games, isLoading, error } = useGetMyGames();

  const {
    setup: { client },
  } = useDojo();
  const { executeCreateGame } = useGameContext();
  const { setGameId } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) {
      console.log("No gameId provided, redirecting to my games");
      navigate("/my-games");
    } else if (error) {
      console.error("Error fetching games", error);
      navigate("/");
    } else if (!isLoading && games) {
      const game = games.find((game) => game.id === Number(gameId));
      if (game) {
        console.log("Found game", game);
        if (game.status === GameStateEnum.NotStarted) {
          navigate("/entering-tournament");
          executeCreateGame(game.id);
        } else {
          setGameId(client, game.id);
          navigate(`/redirect`);
        }
      } else {
        console.error(`Game ${gameId} not found`);
        navigate("/my-games");
      }
    }
  }, [games, error, gameId, isLoading]);
  return <Loading />;
};
