import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Background } from "../components/Background";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";

export const Redirect = () => {
  const game = useGame();
  let state = game?.state;
  console.log(state);
  const navigate = useNavigate();

  const { page } = useParams();

  useEffect(() => {
    console.log("State change: ", state);
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
      <Loading />
    </Background>
  );
};
