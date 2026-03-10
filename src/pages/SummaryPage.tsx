import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { StaggeredList } from "../components/animations/StaggeredList";
import { BackgroundDecoration } from "../components/Background";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { PinkBox } from "../components/PinkBox";
import { RewardItem } from "../components/RewardsDetail";
import { isMockGameApiMode } from "../config/gameMode";
import { BOSS_LEVEL } from "../constants/general";
import { PLAYS_DATA } from "../constants/plays";
import {
  DEFAULT_TRACKER_VIEW,
  getGameTracker,
} from "../dojo/queries/getGameTracker";
import { useDojo } from "../dojo/useDojo";
import { Plays } from "../enums/plays";
import { useMapNavigate } from "../hooks/useMapNavigate";
import { useGameStore } from "../state/useGameStore";
import { useProgressStore } from "../state/roguelike/useProgressStore";
import { useRoguelikeUiStore } from "../state/roguelike/useRoguelikeUiStore";
import { useRunStore } from "../state/roguelike/useRunStore";
import { useRoguelikeRuntimeStore } from "../state/roguelike/useRoguelikeRuntimeStore";
import { BLUE_LIGHT, VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { formatNumber } from "../utils/formatNumber";

const DELAY_START = 1.25;
const STAGGER = 0.5;

interface SummaryPageProps {
  win?: boolean;
}

export const SummaryPage = ({
  win = true,
}: SummaryPageProps) => {
  const { isSmallScreen } = useResponsiveValues();
  return (
    <DelayedLoading ms={0}>
      <BackgroundDecoration>
        {isSmallScreen && <MobileDecoration />}
        <SummaryDetail win={win} />
      </BackgroundDecoration>
    </DelayedLoading>
  );
};

const SummaryDetail = ({ win }: SummaryPageProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "rewards-details.labels",
  });
  const { t: tGame } = useTranslation("game");
  const { t: tPlays } = useTranslation("plays", { keyPrefix: "playsData" });

  const { navigateToMap } = useMapNavigate();
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const [skip, setSkip] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { totalScore, level, round, id: gameId } = useGameStore();
  const removeGameId = useGameStore((state) => state.removeGameId);
  const activeRun = useRunStore((state) => state.activeRun);
  const endRun = useRunStore((state) => state.endRun);
  const clearRun = useRunStore((state) => state.clearRun);
  const pendingUnlocksCount = useProgressStore(
    (state) => state.profile?.pendingUnlocks.length ?? 0
  );
  const unlockToShow = useRoguelikeUiStore((state) => state.unlockToShow);
  const runtimeRound = useRoguelikeRuntimeStore((state) => state.round);
  const resetRuntime = useRoguelikeRuntimeStore((state) => state.reset);
  const [gameTracker, setGameTracker] = useState(DEFAULT_TRACKER_VIEW);

  useEffect(() => {
    let active = true;

    const fetchTracker = async () => {
      if (!gameId) return;

      const tracker = await getGameTracker(gameId);
      if (active) {
        setGameTracker(tracker);
      }
    };

    fetchTracker();

    return () => {
      active = false;
    };
  }, [gameId]);

  const title = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
    >
      <Heading
        size={"lg"}
        variant="italic"
        textShadow={win ? `0 0 8px ${VIOLET_LIGHT}` : "none"}
        lineHeight={1.1}
        color={win ? VIOLET_LIGHT : BLUE_LIGHT}
        mt={isSmallScreen ? 2 : 6}
        mb={1}
      >
        {win ? t("title-win") : t("title-loose")}
      </Heading>
    </motion.div>
  );
  const compactRound = `${tGame("game.round-points.level", { level: win ? BOSS_LEVEL : level })} R${round}`;

  const mostPlayedHandName =
    PLAYS_DATA[gameTracker.mostPlayedHand]?.name ?? PLAYS_DATA[Plays.NONE].name;

  const labels = [
    t("round"),
    t("best-hand"),
    t("most-played-hand"),
    t("played-cards"),
    t("discarded-cards"),
    t("defeated-rages"),
  ];

  if (isNavigating) {
    return (
      <Flex
        position="fixed"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        justifyContent="center"
        alignItems="center"
        bg="blackAlpha.700"
        zIndex={1000}
      >
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      w="100%"
      maxW="900px"
      onClick={() => setSkip(true)}
      zIndex={10}
    >
      <PinkBox
        title={title}
        button={win ? t("endless-mode") : t("continue-btn")}
        onClick={async () => {
          if (win) {
            setIsNavigating(true);
            navigateToMap();
          } else {
            if (isMockGameApiMode) {
              if (activeRun) {
                await endRun({
                  result: "LOSS",
                  highestRoundReached: Math.max(
                    activeRun.highestRoundReached,
                    runtimeRound
                  ),
                });
              }

              const hasPendingUnlock =
                (useProgressStore.getState().profile?.pendingUnlocks.length ?? 0) > 0 ||
                useRoguelikeUiStore.getState().unlockToShow !== null ||
                pendingUnlocksCount > 0 ||
                unlockToShow !== null;

              clearRun();
              resetRuntime();
              removeGameId();
              navigate(
                hasPendingUnlock ? "/roguelike/post-run" : "/",
                hasPendingUnlock
                  ? { replace: true, state: { nextPath: "/" } }
                  : { replace: true }
              );
              return;
            }

            navigate(`/gameover/${gameId}`);
          }
        }}
        actionHidden={!animationEnded}
        glowIntensity={win ? 1.5 : 0}
        color={win ? "violet" : "blue"}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5, ease: "easeOut" }}
        >
          <Heading color={win ? "lightViolet" : "blueLight"} size="s">
            {t("final-score", { score: formatNumber(totalScore) })}{" "}
          </Heading>
        </motion.div>

        <StaggeredList
          stagger={STAGGER}
          onEnd={() => setAnimationEnded(true)}
          delayStart={DELAY_START}
          skip={skip}
          w="100%"
        >
          <RewardItem
            skip={skip}
            label={labels[0]}
            value={compactRound}
            showCashSymbol={false}
            coloredValue
          />
          <RewardItem
            skip={skip}
            label={labels[1]}
            value={gameTracker.highestHand}
            showCashSymbol={false}
            coloredValue
          />
          <RewardItem
            skip={skip}
            label={labels[2]}
            showCashSymbol={false}
            value={`${tPlays(`${mostPlayedHandName}.name`)} (${gameTracker.mostPlayedHandCount})`}
            coloredValue
          />

          <RewardItem
            skip={skip}
            label={labels[3]}
            showCashSymbol={false}
            value={gameTracker.cardsPlayedCount}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
            coloredValue
          />
          <RewardItem
            skip={skip}
            label={labels[4]}
            showCashSymbol={false}
            value={gameTracker.cardsDiscardedCount}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
            coloredValue
          />
          <RewardItem
            skip={skip}
            label={labels[5]}
            showCashSymbol={false}
            value={gameTracker.rageWins}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
            coloredValue
          />
          <Box h="20px" />
        </StaggeredList>
      </PinkBox>
    </Flex>
  );
};
