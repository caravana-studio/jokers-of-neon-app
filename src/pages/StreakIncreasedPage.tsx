import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  acknowledgeStreakPresentation,
  claimStreakRewards,
  fetchStreakStatus,
  type ClaimStreakRewardsResult,
  type StreakPresentationClaimApiData,
  type StreakPresentationRewardApiData,
} from "../api/profile";
import { getUserCards } from "../api/getUserCards";
import type { SeasonRewardPack } from "../api/claimSeasonReward";
import CachedImage from "../components/CachedImage";
import { DelayedLoading } from "../components/DelayedLoading";
import { DailyStreakSheet } from "../components/DailyStreakSheet";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { MobileDecoration } from "../components/MobileDecoration";
import { RollingNumber } from "../components/RollingNumber";
import { HIDE_STREAK } from "../config/featureFlags";
import { useDojo } from "../dojo/DojoContext";
import { GameStateEnum } from "../dojo/typescript/custom";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { useMapNavigate } from "../hooks/useMapNavigate";
import { useProfileStore } from "../state/useProfileStore";
import { useStreakPresentationStore } from "../state/useStreakPresentationStore";
import { useGameStore } from "../state/useGameStore";
import { BLUE_LIGHT } from "../theme/colors";
import { StreakIncreasedLocationState } from "../utils/streakPresentation";
import { ExternalPack } from "./ExternalPack/ExternalPack";

const MOCKED_DAILY_STREAK = 30;
const REWARD_CLAIM_ERROR_TOAST_ID = "streak-reward-claim-error";

type RewardPresentationStep =
  | {
      type: "xp";
      amount: number;
    }
  | {
      type: "streak_protector";
      quantity: number;
    }
  | {
      type: "pack";
      pack: SeasonRewardPack;
    };

function getRewardPreviewXpAmount(
  reward: StreakPresentationRewardApiData | null
): number {
  return (
    reward?.items.reduce(
      (total, item) => total + (item.type === "xp" ? item.amount : 0),
      0
    ) ?? 0
  );
}

function getRewardPreviewProtectorQuantity(
  reward: StreakPresentationRewardApiData | null
): number {
  return (
    reward?.items.reduce(
      (total, item) =>
        total + (item.type === "streak_protector" ? item.quantity : 0),
      0
    ) ?? 0
  );
}

function getClaimedXpAmount(result: ClaimStreakRewardsResult): number {
  return result.xp.queued > 0 ? result.xp.queued : result.xp.requested;
}

function getClaimedProtectorQuantity(result: ClaimStreakRewardsResult): number {
  if (result.streakProtectors.queued > 0) {
    return result.streakProtectors.queued;
  }

  return Math.max(
    0,
    result.streakProtectors.requested - result.streakProtectors.skipped
  );
}

function buildRewardPresentationSteps({
  xpAmount,
  protectorQuantity,
  packs,
}: {
  xpAmount: number;
  protectorQuantity: number;
  packs: SeasonRewardPack[];
}): RewardPresentationStep[] {
  const steps: RewardPresentationStep[] = [];

  if (xpAmount > 0) {
    steps.push({ type: "xp", amount: xpAmount });
  }

  if (protectorQuantity > 0) {
    steps.push({ type: "streak_protector", quantity: protectorQuantity });
  }

  packs.forEach((pack) => {
    steps.push({ type: "pack", pack });
  });

  return steps;
}

const rewardPulseAnimation = {
  scale: [1, 1.06, 1],
  filter: [
    `drop-shadow(0 0 8px ${BLUE_LIGHT})`,
    `drop-shadow(0 0 24px ${BLUE_LIGHT})`,
    `drop-shadow(0 0 8px ${BLUE_LIGHT})`,
  ],
};

const rewardPulseTransition = {
  duration: 1.8,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const StreakRewardPresentationScreen = ({
  step,
  onContinue,
}: {
  step: Extract<RewardPresentationStep, { type: "xp" | "streak_protector" }>;
  onContinue: () => void | Promise<void>;
}) => {
  const { t } = useTranslation("intermediate-screens");

  return (
    <DelayedLoading ms={0}>
      <Flex
        w="100%"
        h="100%"
        position="relative"
        overflow="hidden"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        bg="rgba(0, 0, 0, 0.18)"
      >
        <MobileDecoration />
        <Flex
          flex={1}
          minH={0}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={{ base: 5, sm: 7 }}
          textAlign="center"
        >
          <Text
            fontFamily="Orbitron"
            fontSize={{ base: "15px", sm: "18px" }}
            letterSpacing="0.18em"
            textTransform="uppercase"
            color="white"
          >
            {t("daily-streak.reward-received")}
          </Text>
          <Flex flexDirection="column" alignItems="center" gap={4}>
            <motion.div
              animate={rewardPulseAnimation}
              transition={rewardPulseTransition}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transformOrigin: "center center",
                willChange: "transform, filter",
              }}
            >
              {step.type === "xp" ? (
                <Box
                  fontFamily="Orbitron"
                  fontSize={{ base: "64px", sm: "88px" }}
                  lineHeight={1}
                  fontWeight={600}
                  color={BLUE_LIGHT}
                  sx={{
                    "& span": {
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      lineHeight: "inherit",
                      fontWeight: "inherit",
                      color: "inherit",
                    },
                  }}
                >
                  <Text as="span">+</Text>
                  <RollingNumber n={step.amount} className="" delay={260} />
                  <Text as="span"> XP</Text>
                </Box>
              ) : (
                <CachedImage
                  src="/streak-protector.png"
                  alt={t("daily-streak.protectors")}
                  h={{ base: "150px", sm: "210px" }}
                  w="auto"
                />
              )}
            </motion.div>
            {step.type === "streak_protector" && (
              <Text
                fontFamily="Orbitron"
                fontSize={{ base: "14px", sm: "17px" }}
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={BLUE_LIGHT}
                textShadow={`0 0 10px ${BLUE_LIGHT}`}
              >
                {t("daily-streak.streak-protector-reward")}
                {step.quantity > 1 ? ` x${step.quantity}` : ""}
              </Text>
            )}
          </Flex>
        </Flex>
        <MobileBottomBar
          secondButton={{
            onClick: onContinue,
            label: t("daily-streak.next"),
          }}
        />
      </Flex>
    </DelayedLoading>
  );
};

export const StreakIncreasedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens");
  const toast = useToast();
  const { account } = useDojo();
  const customNavigate = useCustomNavigate();
  const { navigateToMap } = useMapNavigate();
  const setRoundRewards = useGameStore((store) => store.setRoundRewards);
  const state = location.state as StreakIncreasedLocationState | null;
  const initialReward = state?.reward ?? null;
  const rewardPreviewPacks = state?.rewardPreviewPacks ?? [];
  const rewardPreviewOwnedCardIds = state?.rewardPreviewOwnedCardIds ?? [];
  const profileStreak = useProfileStore(
    (store) => store.profileData?.profile.streak ?? 0
  );
  const profileStreakCompletedToday = useProfileStore(
    (store) => store.profileData?.profile.streakCompletedToday ?? false
  );
  const streak = state?.streak ?? profileStreak ?? MOCKED_DAILY_STREAK;
  const [liveStreakProtectors, setLiveStreakProtectors] = useState<number | null>(
    null
  );
  const streakProtectors = liveStreakProtectors ?? 0;
  const [isRewardClaiming, setIsRewardClaiming] = useState(false);
  const [isAcknowledgingPresentation, setIsAcknowledgingPresentation] =
    useState(false);
  const [presentationAcknowledgement, setPresentationAcknowledgement] =
    useState<StreakPresentationClaimApiData | null>(null);
  const acknowledgementPromiseRef = useRef<Promise<
    StreakPresentationClaimApiData | null
  > | null>(null);
  const reward = presentationAcknowledgement?.reward ?? initialReward;
  const [rewardSteps, setRewardSteps] = useState<RewardPresentationStep[]>([]);
  const [currentRewardStepIndex, setCurrentRewardStepIndex] = useState(0);
  const [ownedCardIds, setOwnedCardIds] = useState<string[]>([]);
  const currentRewardStep = rewardSteps[currentRewardStepIndex];
  const requiresPresentationAcknowledgement =
    !HIDE_STREAK &&
    state?.from !== "/profile" &&
    Number(state?.periodId) > 0;
  const presentationAcknowledged =
    !requiresPresentationAcknowledgement ||
    presentationAcknowledgement?.acknowledged === true ||
    presentationAcknowledgement?.reason === "already_claimed";

  const ensurePresentationAcknowledged = useCallback(async () => {
    if (!requiresPresentationAcknowledgement) {
      return null;
    }

    if (presentationAcknowledged) {
      return presentationAcknowledgement;
    }

    const address = account?.account?.address;
    const periodId = state?.periodId;
    if (!address || !periodId) {
      return null;
    }

    if (acknowledgementPromiseRef.current) {
      return acknowledgementPromiseRef.current;
    }

    setIsAcknowledgingPresentation(true);
    const acknowledgementPromise = acknowledgeStreakPresentation(
      address,
      periodId
    )
      .then((result) => {
        if (result.acknowledged || result.reason === "already_claimed") {
          setPresentationAcknowledgement(result);
          useStreakPresentationStore
            .getState()
            .finishPresentation(address, periodId);
          return result;
        }

        console.warn(
          "StreakIncreasedPage: presentation acknowledgement was rejected",
          result.reason
        );
        return null;
      })
      .catch((error) => {
        console.warn(
          "StreakIncreasedPage: presentation acknowledgement failed",
          error
        );
        return null;
      })
      .finally(() => {
        acknowledgementPromiseRef.current = null;
        setIsAcknowledgingPresentation(false);
      });

    acknowledgementPromiseRef.current = acknowledgementPromise;
    return acknowledgementPromise;
  }, [
    account?.account?.address,
    presentationAcknowledged,
    presentationAcknowledgement,
    requiresPresentationAcknowledgement,
    state?.periodId,
  ]);

  useEffect(() => {
    if (requiresPresentationAcknowledgement && !presentationAcknowledged) {
      void ensurePresentationAcknowledged();
    }
  }, [
    ensurePresentationAcknowledged,
    presentationAcknowledged,
    requiresPresentationAcknowledgement,
  ]);

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

  if (HIDE_STREAK) {
    return <Navigate to={state?.from ?? "/"} replace />;
  }

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

  const handleRewardContinue = async (
    rewardToPresent: StreakPresentationRewardApiData | null = reward
  ) => {
    const isPreview =
      Boolean(rewardToPresent?.items.length) &&
      rewardToPresent?.claimIds.length === 0;

    if (isPreview) {
      setOwnedCardIds(rewardPreviewOwnedCardIds);
      const nextRewardSteps = buildRewardPresentationSteps({
        xpAmount: getRewardPreviewXpAmount(rewardToPresent),
        protectorQuantity: getRewardPreviewProtectorQuantity(rewardToPresent),
        packs: rewardPreviewPacks,
      });

      if (nextRewardSteps.length === 0) {
        await handleClose();
        return;
      }

      setRewardSteps(nextRewardSteps);
      setCurrentRewardStepIndex(0);
      return;
    }

    if (!rewardToPresent?.claimIds.length) {
      await handleClose();
      return;
    }

    const address = account?.account?.address;
    if (!address) {
      await handleClose();
      return;
    }

    setIsRewardClaiming(true);

    try {
      const includesPack = rewardToPresent.items.some(
        (item) => item.type === "pack"
      );
      if (includesPack) {
        try {
          const userCardsData = await getUserCards(address);
          setOwnedCardIds(userCardsData.ownedCardIds ?? []);
        } catch (error) {
          console.warn(
            "StreakIncreasedPage: failed to load user collection before reward claim",
            error
          );
          setOwnedCardIds([]);
        }
      } else {
        setOwnedCardIds([]);
      }

      const result = await claimStreakRewards(address, rewardToPresent.claimIds);

      if (import.meta.env.DEV) {
        console.info("[STREAK-REWARD] claimed", {
          packs: result.packs.length,
          xp: result.xp,
          streakProtectors: result.streakProtectors,
        });
      }

      const nextRewardSteps = buildRewardPresentationSteps({
        xpAmount: getClaimedXpAmount(result),
        protectorQuantity: getClaimedProtectorQuantity(result),
        packs: result.packs,
      });

      if (nextRewardSteps.length > 0) {
        setRewardSteps(nextRewardSteps);
        setCurrentRewardStepIndex(0);
        setIsRewardClaiming(false);
        return;
      }

      await handleClose();
    } catch (error) {
      console.error("StreakIncreasedPage: streak reward claim failed", error);
      if (!toast.isActive(REWARD_CLAIM_ERROR_TOAST_ID)) {
        toast({
          id: REWARD_CLAIM_ERROR_TOAST_ID,
          title: t("daily-streak.reward-claim-error"),
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      setIsRewardClaiming(false);
    }
  };

  const handleStreakContinue = async () => {
    let acknowledgedReward = reward;

    if (!presentationAcknowledged) {
      const acknowledgement = await ensurePresentationAcknowledged();
      if (!acknowledgement) {
        return;
      }
      acknowledgedReward = acknowledgement.reward ?? acknowledgedReward;
    }

    await handleRewardContinue(acknowledgedReward);
  };

  const handleRewardStepContinue = async () => {
    if (rewardSteps[currentRewardStepIndex + 1]) {
      setCurrentRewardStepIndex((current) => current + 1);
      return;
    }

    await handleClose();
  };

  if (currentRewardStep?.type === "xp" || currentRewardStep?.type === "streak_protector") {
    return (
      <StreakRewardPresentationScreen
        step={currentRewardStep}
        onContinue={handleRewardStepContinue}
      />
    );
  }

  if (currentRewardStep?.type === "pack") {
    return (
      <ExternalPack
        initialCards={currentRewardStep.pack.mintedCards}
        packId={currentRewardStep.pack.packId}
        ownedCardIds={ownedCardIds}
        onContinue={handleRewardStepContinue}
      />
    );
  }

  return (
    <DelayedLoading ms={0}>
      <DailyStreakSheet
        streak={streak}
        completedToday={
          state?.from === "/profile" ? profileStreakCompletedToday : true
        }
        streakProtectors={streakProtectors}
        onClose={handleClose}
        onContinue={
          reward || requiresPresentationAcknowledgement
            ? handleStreakContinue
            : handleClose
        }
        reward={reward}
        isRewardClaiming={
          isRewardClaiming || isAcknowledgingPresentation
        }
        showCelebrationIntroOnEntry={state?.from !== "/profile"}
      />
    </DelayedLoading>
  );
};
