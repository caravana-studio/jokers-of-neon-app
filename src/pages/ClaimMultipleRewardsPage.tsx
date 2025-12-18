import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  claimSeasonReward,
  claimUnclaimedRewards,
  SeasonRewardPack,
} from "../api/claimSeasonReward";
import { DelayedLoading } from "../components/DelayedLoading";
import { SimulatedLoadingBar } from "../components/LoadingProgressBar/SimulatedLoadingProgressBar";
import { MobileDecoration } from "../components/MobileDecoration";
import { useDojo } from "../dojo/useDojo";
import { LoadingProgress } from "../types/LoadingProgress";
import { ExternalPack } from "./ExternalPack/ExternalPack";

export const ClaimMultipleRewardsPage = () => {
  const {
    account: { account },
  } = useDojo();

  const { t } = useTranslation("home", {
    keyPrefix: "packs",
  });
  const navigate = useNavigate();

  const params = useParams();
  const level = Number(params.level ?? 0);
  const isPremium = params.premium === "premium";

  const [packs, setPacks] = useState<SeasonRewardPack[]>([]);
  const [currentPackIndex, setCurrentPackIndex] = useState<number>(0);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const hasClaimedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!account?.address || hasClaimedRef.current) return;
    hasClaimedRef.current = true;

    const claim = async () => {
      try {
        const result = params.premium
          ? await claimSeasonReward({ address: account.address, level, isPremium })
          : await claimUnclaimedRewards({
              address: account.address,
            });

        if (!Array.isArray(result)) {
          throw new Error("Unexpected claim response");
        }

        setPacks(result);
        setCurrentPackIndex(0);
      } catch (error) {
        console.error("Error claiming season reward:", error);
        navigate("/");
      }
    };

    claim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address]);

  const headingStages: LoadingProgress[] = [
    {
      text: t("open-pack-stages.stage-1"),
      showAt: 0,
    },
    {
      text: t("open-pack-stages.stage-2"),
      showAt: 3000,
    },
    {
      text: t("open-pack-stages.stage-3"),
      showAt: 5000,
    },
  ];

  const transitionTo = (index: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentPackIndex(index);
      setTransitioning(false);
    }, 1000);
  };

  return packs?.length > 0 && !transitioning ? (
    <ExternalPack
      initialCards={packs[currentPackIndex].mintedCards}
      packId={packs[currentPackIndex].packId}
      onContinue={
        packs[currentPackIndex + 1]
          ? () => transitionTo(currentPackIndex + 1)
          : () => navigate("/season")
      }
    />
  ) : (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
        <Flex
          w={{ base: "90%", sm: "80%", md: "70%" }}
          h="100%"
          justifyContent="center"
          alignItems="center"
          zIndex={2}
        >
          <SimulatedLoadingBar headingStages={headingStages} duration={3000} />
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
