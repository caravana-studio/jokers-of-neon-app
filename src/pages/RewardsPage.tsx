import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RewardsDetail } from "../components/RewardsDetail";
import { useGameContext } from "../providers/GameProvider";
import { runConfettiAnimation } from "../utils/runConfettiAnimation";
import { BackgroundDecoration } from "../components/Background";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { GameStateEnum } from "../dojo/typescript/custom";

export const RewardsPage = () => {
  const { roundRewards } = useGameContext();
  const navigate = useCustomNavigate();

  useEffect(() => {
    runConfettiAnimation();
  }, []);

  if (!roundRewards) {
    navigate(GameStateEnum.Map);
  }

  return (
    <BackgroundDecoration>
      <RewardsDetail roundRewards={roundRewards} />
    </BackgroundDecoration>
  );
};
