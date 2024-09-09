import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { RewardsDetail } from "../components/RewardsDetail";
import { useGameContext } from "../providers/GameProvider";

export const RewardsPage = () => {
  const { roundRewards } = useGameContext();
  const navigate = useNavigate();

  if (!roundRewards) {
    navigate("/redirect/store");
  }

  return (
    <Background type="game" dark rewardsDecoration>
      <RewardsDetail roundRewards={roundRewards} />
    </Background>
  );
};
