import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { RewardsDetail } from "../components/RewardsDetail";
import { useGameContext } from "../providers/GameProvider";
import { runConfettiAnimation } from "../utils/runConfettiAnimation";

export const RewardsPage = () => {
  const { roundRewards } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    runConfettiAnimation();
  }, []);

  if (!roundRewards) {
    navigate("/redirect/store");
  }

  return (
    <Background type="game" dark bgDecoration>
      <RewardsDetail roundRewards={roundRewards} />
    </Background>
  );
};
