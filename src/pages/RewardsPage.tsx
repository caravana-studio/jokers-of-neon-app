import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { RewardsDetail } from "../components/RewardsDetail";
import { useGameContext } from "../providers/GameProvider";
import { useGame } from "../dojo/queries/useGame";
import { useEffect } from "react";

export const RewardsPage = () => {
  const { roundRewards } = useGameContext();
  const navigate = useNavigate();
  const game = useGame();
  console.log(game?.id);

  useEffect(() => {
    if (!game) return;
    console.log("state on rewards: ", game?.state);
    if (!roundRewards) {
     if (game?.state === "AT_SHOP") {
        navigate("/redirect/store");
     }
    }
  }, [game, game?.state, roundRewards]);

  if (!game) {
    return <div>Loading...</div>; 
  }

  return (
    <Background type="game" dark rewardsDecoration>
      <RewardsDetail roundRewards={roundRewards} />
    </Background>
  );
};
