import { useLocation, useNavigate } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { DailyStreakSheet } from "../components/DailyStreakSheet";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { useMapNavigate } from "../hooks/useMapNavigate";
import { useProfileStore } from "../state/useProfileStore";
import { useGameStore } from "../state/useGameStore";
import { StreakIncreasedLocationState } from "../utils/streakPresentation";

const MOCKED_DAILY_STREAK = 30;

export const StreakIncreasedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customNavigate = useCustomNavigate();
  const { navigateToMap } = useMapNavigate();
  const setRoundRewards = useGameStore((store) => store.setRoundRewards);
  const state = location.state as StreakIncreasedLocationState | null;
  const profileStreak = useProfileStore(
    (store) => store.profileData?.profile.streak ?? 0
  );
  const streak = state?.streak ?? profileStreak ?? MOCKED_DAILY_STREAK;

  const handleClose = async () => {
    if (state?.continuation?.type === "map-after-rewards") {
      try {
        setRoundRewards(undefined);
        await navigateToMap();
      } catch {
        setRoundRewards(undefined);
        customNavigate(GameStateEnum.Map);
      }
      return;
    }

    if (state?.continuation?.type === "map") {
      try {
        await navigateToMap();
      } catch {
        customNavigate(GameStateEnum.Map);
      }
      return;
    }

    if (state?.continuation?.type === "route") {
      navigate(state.continuation.to, {
        replace: state.continuation.replace,
        state: state.continuation.state ?? undefined,
      });
      return;
    }

    if (state?.from) {
      navigate(state.from, {
        replace: state.replaceOnClose,
        state: state.fromState ?? undefined,
      });
      return;
    }

    navigate(-1);
  };

  return (
    <DelayedLoading ms={0}>
      <DailyStreakSheet
        streak={streak}
        onClose={handleClose}
        showCelebrationIntroOnEntry={state?.from !== "/profile"}
      />
    </DelayedLoading>
  );
};
