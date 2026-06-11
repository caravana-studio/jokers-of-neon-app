import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { claimStreakPresentation } from "../api/profile";
import { StaggeredList } from "../components/animations/StaggeredList";
import { BackgroundDecoration } from "../components/Background";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { PinkBox } from "../components/PinkBox";
import { RewardItem } from "../components/RewardsDetail";
import { getGameApiBaseUrl } from "../config/gameApiUrl";
import { BOSS_LEVEL } from "../constants/general";
import { PLAYS_DATA } from "../constants/plays";
import { getShopTierUnlockConfig } from "../constants/shopTierUnlock";
import {
  DEFAULT_TRACKER_VIEW,
  getGameTracker,
} from "../dojo/queries/getGameTracker";
import { useDojo } from "../dojo/useDojo";
import { Plays } from "../enums/plays";
import { useMapNavigate } from "../hooks/useMapNavigate";
import { triggerHaptic } from "../haptics";
import { useGameStore } from "../state/useGameStore";
import { BLUE_LIGHT, VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { formatNumber } from "../utils/formatNumber";
import { shareOnX } from "../utils/shareOnX";
import {
  navigateToStreakIncreased,
  SKIP_STREAK_PRESENTATION_CHECK,
} from "../utils/streakPresentation";

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
  const location = useLocation();
  const {
    account: { account },
  } = useDojo();
  const { isSmallScreen } = useResponsiveValues();
  const [skip, setSkip] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isCheckingStreak, setIsCheckingStreak] = useState(true);
  const {
    totalScore,
    level,
    round,
    id: gameId,
    shopTierUnlockedEvents,
  } = useGameStore();
  const [gameTracker, setGameTracker] = useState(DEFAULT_TRACKER_VIEW);

  useEffect(() => {
    triggerHaptic(win ? "win" : "lose");
  }, [win]);

  useEffect(() => {
    if (
      (location.state as Record<string, unknown> | null)?.[
        SKIP_STREAK_PRESENTATION_CHECK
      ] === true
    ) {
      setIsCheckingStreak(false);
      return;
    }

    let active = true;

    void (async () => {
      try {
        const presentation = await claimStreakPresentation(account.address);

        if (
          active &&
          presentation.show &&
          presentation.streak !== null
        ) {
          navigateToStreakIncreased(navigate, {
            streak: presentation.streak,
            reward: presentation.reward,
            continuation: {
              type: "route",
              to: location.pathname,
              replace: true,
              state: {
                [SKIP_STREAK_PRESENTATION_CHECK]: true,
              },
            },
            replace: true,
          });
          return;
        }
      } catch (error) {
        console.warn("SummaryPage: streak presentation claim failed", error);
      }

      if (active) {
        setIsCheckingStreak(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [account.address, location.pathname, location.state, navigate]);

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

  if (isNavigating || isCheckingStreak) {
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

  const handleContinue = () => {
    if (win) {
      setIsNavigating(true);
      navigateToMap();
      return;
    }

    const resolvedShopTierUnlockedEvents = shopTierUnlockedEvents.filter(
      (event) => Boolean(getShopTierUnlockConfig(event.unlock_id))
    );
    const hasShopTierUnlockedEventForCurrentGame =
      resolvedShopTierUnlockedEvents.length > 0;

    console.log("[unlock-debug] loose continue navigation decision", {
      gameId,
      shopTierUnlockedEvents,
      hasShopTierUnlockedEventForCurrentGame,
      resolvedUnlockConfigs: resolvedShopTierUnlockedEvents.map((event) =>
        getShopTierUnlockConfig(event.unlock_id)
      ),
    });

    if (hasShopTierUnlockedEventForCurrentGame) {
      navigate(`/shop-tier-unlocked/${gameId}`);
    } else {
      navigate(`/gameover/${gameId}`);
    }
  };

  const handleShareClick = async () => {
    const shareVariant = Math.floor(Math.random() * 6) + 1;
    const shareMessage = t(`share.variants.${shareVariant}`);
    const shareUrl = gameId
      ? `${getGameApiBaseUrl()}/share/game-win/${gameId}`
      : undefined;

    await shareOnX({
      message: shareMessage,
      url: shareUrl,
    });
  };

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
        onClick={handleContinue}
        actionHidden={!animationEnded}
        glowIntensity={win ? 1.5 : 0}
        color={win ? "violet" : "blue"}
        firstButton={
          win
            ? {
                onClick: handleShareClick,
                label: t("share.button"),
                icon: <FontAwesomeIcon fontSize={12} icon={faXTwitter} />,
              }
            : undefined
        }
        secondButton={
          win
            ? {
                onClick: handleContinue,
                label: t("endless-mode"),
                isLoading: isNavigating,
                disabled: isNavigating,
              }
            : undefined
        }
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
            rollingSound={false}
            showCashSymbol={false}
            coloredValue
          />
          <RewardItem
            skip={skip}
            label={labels[1]}
            value={gameTracker.highestHand}
            rollingSound={false}
            showCashSymbol={false}
            coloredValue
          />
          <RewardItem
            skip={skip}
            label={labels[2]}
            showCashSymbol={false}
            value={`${tPlays(`${mostPlayedHandName}.name`)} (${gameTracker.mostPlayedHandCount})`}
            rollingSound={false}
            coloredValue
          />

          <RewardItem
            skip={skip}
            label={labels[3]}
            showCashSymbol={false}
            value={gameTracker.cardsPlayedCount}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
            rollingSound={false}
            coloredValue
          />
          <RewardItem
            skip={skip}
            label={labels[4]}
            showCashSymbol={false}
            value={gameTracker.cardsDiscardedCount}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
            rollingSound={false}
            coloredValue
          />
          <RewardItem
            skip={skip}
            label={labels[5]}
            showCashSymbol={false}
            value={gameTracker.rageWins}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
            rollingSound={false}
            coloredValue
          />
          <Box h="20px" />
        </StaggeredList>
      </PinkBox>
    </Flex>
  );
};
