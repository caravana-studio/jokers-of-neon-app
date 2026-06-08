import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { claimSeasonReward } from "../../api/claimSeasonReward";
import { useDojo } from "../../dojo/useDojo";
import { RewardStatus } from "../../enums/rewardStatus";
import { VIOLET } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Packs } from "./Packs";
import { IReward } from "./types";

interface StepRewardProps {
  reward?: IReward;
  type: "free" | "premium";
  level: number;
  streakProtectorsAvailable: number | null;
  maxStreakProtectors: number;
  refetch: () => void;
}

export const StepReward = ({
  reward,
  type,
  level,
  streakProtectorsAvailable,
  maxStreakProtectors,
  refetch,
}: StepRewardProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-progression",
  });
  const {
    account: { account },
  } = useDojo();
  const { isSmallScreen } = useResponsiveValues();
  const pack = reward?.packs?.[0];
  const streakProtectorsRequested = reward?.streakProtectors ?? 0;
  const availableStreakProtectorSlots =
    streakProtectorsAvailable === null
      ? null
      : Math.max(0, maxStreakProtectors - streakProtectorsAvailable);
  const isStreakProtectorClaimBlocked =
    streakProtectorsRequested > 0 &&
    availableStreakProtectorSlots !== null &&
    streakProtectorsRequested > availableStreakProtectorSlots;
  const hasDirectClaimReward =
    (reward?.tournamentEntries ?? 0) > 0 ||
    streakProtectorsRequested > 0;
  const hasDisplayableReward = !!reward && (pack || hasDirectClaimReward);
  const claimButtonLabel = isStreakProtectorClaimBlocked
    ? t("streak-protector-full")
    : t("claim");
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (claimed && reward) {
      reward.status = RewardStatus.CLAIMED;
    }
  }, [claimed]);

  return (
    <Flex
      w="50%"
      justifyContent="center"
      alignItems="center"
      position="relative"
      opacity={reward?.status === RewardStatus.UNCLAIMED && !claimed ? 1 : 0.5}
    >
      {hasDisplayableReward && reward && (
        <>
          <Packs reward={reward} claiming={claiming} />

          {reward.status === RewardStatus.UNCLAIMED && !claimed && (
            <Flex position={"absolute"} bottom={2.5} zIndex={4}>
              <Button
                size="xs"
                h={isSmallScreen ? 5 : 8}
                fontSize={isSmallScreen ? 10 : 12}
                boxShadow={`0 0 5px 2px ${VIOLET}`}
                variant="secondarySolid"
                isDisabled={claiming || claimed || isStreakProtectorClaimBlocked}
                isLoading={claiming}
                onClick={async () => {
                  if (isStreakProtectorClaimBlocked) {
                    return;
                  }

                  if (hasDirectClaimReward) {
                    try {
                      setClaiming(true);
                      await claimSeasonReward({
                        address: account.address,
                        level,
                        isPremium: type === "premium",
                      });
                      setClaimed(true);
                      refetch();
                    } catch (error) {
                      console.warn("StepReward: season reward claim failed", error);
                      refetch();
                    } finally {
                      setClaiming(false);
                    }
                  } else {
                    navigate(`/claim-season-pack/${level}/${type}`);
                  }
                }}
              >
                {claimButtonLabel}
              </Button>
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
};
