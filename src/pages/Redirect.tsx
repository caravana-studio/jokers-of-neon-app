import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Background } from "../components/Background";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";
import { useDojo } from "../dojo/useDojo";

export const Redirect = () => {
  const game = useGame();
  const state = game?.state;
  const navigate = useNavigate();
  const { page } = useParams();
  const {
    syncCall,
  } = useDojo();

  // Ref to store the timeout ID
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutIdRef.current = setTimeout(async () => {
      await syncCall();
      console.log("default redirect to ", page);
      if (page === "demo") {
        navigate("/demo");
      } else if (page === "store") {
        navigate("/store");
      } else if (page === "open-pack") {
        navigate("/open-pack");
      }
    }, 6000);

    return () => {
      timeoutIdRef.current && clearTimeout(timeoutIdRef.current);
    };
  }, [page, navigate]);

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

    return () => {
      timeoutIdRef.current && clearTimeout(timeoutIdRef.current);
    };
  }, [state, page, navigate]);

  return (
    <Background type={page === "open-pack" ? "white" : "game"}>
      <Loading />
    </Background>
  );
};
