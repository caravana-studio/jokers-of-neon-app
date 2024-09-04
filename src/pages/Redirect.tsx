import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Background } from "../components/Background";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";

export const Redirect = () => {
  const game = useGame();
  console.log("game", game);
  const state = game?.state;
  console.log("state", state);
  const navigate = useNavigate();

  const { page } = useParams();
  console.log("page", page);

  useEffect(() => {
    console.log("useEffect", state);
    if (state === "FINISHED") {
      navigate("/gameover");
    } else if (state === "IN_GAME" && page === "demo") {
      navigate("/demo");
    } else if (state === "AT_SHOP" && page === "store") {
      navigate("/store");
    }
  }, [state]);

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (page === "demo") {
        navigate("/demo");
      } else if (page === "store") {
        navigate("/store");
      }
    }, 5000);

    return () => clearTimeout(redirectTimeout);
  }, [page]);

  return (
    <Background type="game">
      <Loading />
    </Background>
  );
};
