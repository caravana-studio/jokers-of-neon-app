import { BackgroundDecoration } from "../components/Background";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { RewardsDetail } from "../components/RewardsDetail";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { useGameStore } from "../state/useGameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const RewardsPage = () => {
  const { roundRewards } = useGameStore();
  const navigate = useCustomNavigate();
  const { isSmallScreen } = useResponsiveValues();

  if (!roundRewards) {
    navigate(GameStateEnum.Map);
  }

  return (
    <DelayedLoading ms={0}>
      <BackgroundDecoration>
        {isSmallScreen && <MobileDecoration />}
        <RewardsDetail roundRewards={roundRewards} />
      </BackgroundDecoration>
    </DelayedLoading>
  );
};
