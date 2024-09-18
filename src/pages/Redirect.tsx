import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Background } from "../components/Background";
import { Loading } from "../components/Loading";
import { useGame } from "../dojo/queries/useGame";
import * as torii from "@dojoengine/torii-client";
import { getLSGameId } from "../dojo/utils/getLSGameId";
import { useDojo } from "../dojo/useDojo";
import { syncEntities } from "@dojoengine/state";

export const Redirect = () => {
  const game = useGame();
  const state = game?.state;
  const navigate = useNavigate();
  const { page } = useParams();
  const gameId= getLSGameId();

  const {
    contractComponents,
    torii
  } = useDojo();

  const gameKeyClause: torii.KeysClause = {
    keys: [gameId.toString()],
    pattern_matching: "VariableLen",
    models: ["jokers_of_neon-Game"]
  };

  const gameClause: torii.EntityKeysClause = 
  {
    Keys: gameKeyClause
  }

  const query: torii.Query = {
    limit: 10000,
    offset: 0,
    clause: { Keys: gameKeyClause }
  }; 

  const callBackDebug = async (e:any) => {
    console.log(e);
    await torii.getEntities(query);
    await syncEntities(torii, contractComponents as any, []);
    console.log("update on redirect");
  }

  torii.onEntityUpdated([gameClause], callBackDebug);


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
    <Background type={page === "open-pack" ? "white" : "game"}>
      <Loading />
    </Background>
  );
};
