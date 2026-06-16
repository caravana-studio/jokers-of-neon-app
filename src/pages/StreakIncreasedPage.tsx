import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { fetchStreakStatus } from "../api/profile";
import { DelayedLoading } from "../components/DelayedLoading";
import { DailyStreakSheet } from "../components/DailyStreakSheet";
import { HIDE_STREAK } from "../config/featureFlags";
import { useDojo } from "../dojo/DojoContext";
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
  const { account } = useDojo();
  const customNavigate = useCustomNavigate();
  const { navigateToMap } = useMapNavigate();
  const setRoundRewards = useGameStore((store) => store.setRoundRewards);
  const state = location.state as StreakIncreasedLocationState | null;
  const profileStreak = useProfileStore(
    (store) => store.profileData?.profile.streak ?? 0
  );
  const streak = state?.streak ?? profileStreak ?? MOCKED_DAILY_STREAK;
  const [liveStreakProtectors, setLiveStreakProtectors] = useState<number | null>(
    null
  );
  const streakProtectors = liveStreakProtectors ?? 0;

  if (HIDE_STREAK) {
    return <Navigate to={state?.from ?? "/"} replace />;
  }

  useEffect(() => {
    const address = account?.account?.address;
    if (!address) {
      setLiveStreakProtectors(null);
      return;
    }

    let active = true;

    void (async () => {
      try {
        const streakStatus = await fetchStreakStatus(address, { refresh: true });
        if (active) {
          setLiveStreakProtectors(streakStatus.protectorsAvailable);
        }
      } catch (error) {
        console.warn("StreakIncreasedPage: failed to fetch streak status", error);
        if (active) {
          setLiveStreakProtectors(null);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [account?.account?.address]);

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
        streakProtectors={streakProtectors}
        onClose={handleClose}
        showCelebrationIntroOnEntry={state?.from !== "/profile"}
      />
    </DelayedLoading>
  );
};
