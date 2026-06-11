import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { claimStreakRewards } from "../api/profile";
import { getUserCards } from "../api/getUserCards";
import type { SeasonRewardPack } from "../api/claimSeasonReward";
import { DelayedLoading } from "../components/DelayedLoading";
import { DailyStreakSheet } from "../components/DailyStreakSheet";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useDojo } from "../dojo/useDojo";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { useMapNavigate } from "../hooks/useMapNavigate";
import { useProfileStore } from "../state/useProfileStore";
import { useGameStore } from "../state/useGameStore";
import { StreakIncreasedLocationState } from "../utils/streakPresentation";
import { ExternalPack } from "./ExternalPack/ExternalPack";

const MOCKED_DAILY_STREAK = 30;

export const StreakIncreasedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customNavigate = useCustomNavigate();
  const { navigateToMap } = useMapNavigate();
  const {
    account: { account },
  } = useDojo();
  const setRoundRewards = useGameStore((store) => store.setRoundRewards);
  const state = location.state as StreakIncreasedLocationState | null;
  const reward = state?.reward ?? null;
  const profileStreak = useProfileStore(
    (store) => store.profileData?.profile.streak ?? 0
  );
  const streak = state?.streak ?? profileStreak ?? MOCKED_DAILY_STREAK;
  const [isRewardClaiming, setIsRewardClaiming] = useState(false);
  const [packs, setPacks] = useState<SeasonRewardPack[]>([]);
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [ownedCardIds, setOwnedCardIds] = useState<string[]>([]);

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

  const handleRewardContinue = async () => {
    if (!reward?.claimIds.length) {
      await handleClose();
      return;
    }

    const address = account?.address;
    if (!address) {
      await handleClose();
      return;
    }

    setIsRewardClaiming(true);

    try {
      const userCardsData = await getUserCards(address);
      setOwnedCardIds(userCardsData.ownedCardIds ?? []);

      const result = await claimStreakRewards(address, reward.claimIds);

      if (import.meta.env.DEV) {
        console.info("[STREAK-REWARD] claimed", {
          packs: result.packs.length,
          xp: result.xp,
          tickets: result.tickets,
          streakProtectors: result.streakProtectors,
        });
      }

      if (result.packs.length > 0) {
        setPacks(result.packs);
        setCurrentPackIndex(0);
        setIsRewardClaiming(false);
        return;
      }

      await handleClose();
    } catch (error) {
      console.error("StreakIncreasedPage: streak reward claim failed", error);
      setIsRewardClaiming(false);
    }
  };

  if (packs.length > 0) {
    const currentPack = packs[currentPackIndex];
    return (
      <ExternalPack
        initialCards={currentPack.mintedCards}
        packId={currentPack.packId}
        ownedCardIds={ownedCardIds}
        onContinue={
          packs[currentPackIndex + 1]
            ? () => setCurrentPackIndex((current) => current + 1)
            : handleClose
        }
      />
    );
  }

  return (
    <DelayedLoading ms={0}>
      <DailyStreakSheet
        streak={streak}
        onClose={handleClose}
        onContinue={reward ? handleRewardContinue : handleClose}
        reward={reward}
        isRewardClaiming={isRewardClaiming}
        showCelebrationIntroOnEntry={state?.from !== "/profile"}
      />
    </DelayedLoading>
  );
};
