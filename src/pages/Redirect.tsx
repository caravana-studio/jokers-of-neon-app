import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Background } from "../components/Background";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";

export const Redirect = () => {
  const game = useGame();
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
    } else if (state === "OPEN_BLISTER_PACK" && page === "open-pack") {
      navigate("/open-pack");
    }
  }, [state, page, navigate]);

  return (
    <Background type={"game"}>
      <Loading />
    </Background>
  );
};
