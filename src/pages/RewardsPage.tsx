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

  if (!roundRewards) {
    navigate("/redirect/store");
  }

  useEffect(() => {
    if (!roundRewards) {
     if (game?.state === "AT_SHOP") {
        navigate("/demo");
     }
    }
  }, [game?.state, roundRewards]);

  return (
    <Background type="game" dark rewardsDecoration>
      <RewardsDetail roundRewards={roundRewards} />
    </Background>
  );
};
