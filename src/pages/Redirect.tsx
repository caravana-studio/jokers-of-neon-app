import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Background } from "../components/Background";
import { Loading } from "../components/Loading";
import { useGameContext } from "../providers/GameProvider";
import { useGetGame } from "../queries/useGetGame";

export const Redirect = () => {
  const { gameId } = useGameContext();
  const { data: game } = useGetGame(gameId, true);
  const state = game?.state;
  const navigate = useNavigate();

  const { page } = useParams();

  useEffect(() => {
    if (state === "FINISHED") {
      navigate("/gameover");
    } else if (state === "IN_GAME" && page === "demo") {
      navigate("/demo");
    } else if (state === "AT_SHOP" && page === "store") {
      navigate("/store");
    }
  }, [state]);

  return (
    <Background type="game">
      <Loading />;
    </Background>
  );
};
