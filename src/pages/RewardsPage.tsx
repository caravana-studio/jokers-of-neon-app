import { BackgroundDecoration } from "../components/Background";
import { RewardsDetail } from "../components/RewardsDetail";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { useGameStore } from "../state/useGameStore";

export const RewardsPage = () => {
  const { roundRewards } = useGameStore();
  const navigate = useCustomNavigate();

  if (!roundRewards) {
    navigate(GameStateEnum.Map);
  }

  return (
    <BackgroundDecoration>
      <RewardsDetail roundRewards={roundRewards} />
    </BackgroundDecoration>
  );
};
