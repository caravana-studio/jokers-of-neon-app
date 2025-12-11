import { Box, Flex, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { StaggeredList } from "../components/animations/StaggeredList";
import { BackgroundDecoration } from "../components/Background";
import { GalaxyBackground } from "../components/backgrounds/galaxy/GalaxyBackground";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { PinkBox } from "../components/PinkBox";
import { RewardItem } from "../components/RewardsDetail";
import { PLAYS_DATA } from "../constants/plays";
import { GameStateEnum } from "../dojo/typescript/custom";
import { Plays } from "../enums/plays";
import { useCustomNavigate } from "../hooks/useCustomNavigate";
import { useGameStore } from "../state/useGameStore";
import { BLUE_LIGHT, VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Intensity } from "../types/intensity";

const DELAY_START = 1.25;
const STAGGER = 0.5;
export const SummaryPage = () => {
  const { isSmallScreen } = useResponsiveValues();

  const { win } = useParams();

  return (
    <DelayedLoading ms={0}>
      <BackgroundDecoration>
        {win && <GalaxyBackground intensity={Intensity.MAX} />}
        {isSmallScreen && <MobileDecoration />}
        <SummaryDetail />
      </BackgroundDecoration>
    </DelayedLoading>
  );
};

const SummaryDetail = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "rewards-details.labels",
  });
  const { t: tGame } = useTranslation("game");
  const { t: tPlays } = useTranslation("plays", { keyPrefix: "playsData" });

  const navigate = useCustomNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const [skip, setSkip] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(false);
  const { win } = useParams();
  const { totalScore, level, round } = useGameStore();

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
  const fakeSummary: any = {
    game_id: 3,
    highest_hand: 145697,
    most_played_hand: {
      hand: Plays.FIVE_OF_A_KIND,
      count: 35,
    },
    highest_cash: 20000,
    cards_played_count: 35,
    cards_discarded_count: 135,
    rage_wins: 27,
  };
  const compactRound = `${tGame("game.round-points.level", { level: level })} R${round}`;

  if (!fakeSummary) {
    navigate(GameStateEnum.Map);
  }

  const labels = [
    t("round"),
    t("best-hand"),
    t("most-played-hand"),
    t("played-cards"),
    t("discarded-cards"),
    t("defeated-rages"),
  ];

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
        onClick={() => {
          win ? navigate(GameStateEnum.Map) : navigate(GameStateEnum.GameOver);
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
            {" "}
            {t("final-score", { score: totalScore })}{" "}
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
          />
          <RewardItem
            skip={skip}
            label={labels[1]}
            value={fakeSummary.highest_hand}
            showCashSymbol={false}
          />
          <RewardItem
            skip={skip}
            label={labels[2]}
            showCashSymbol={false}
            value={`${tPlays(`${PLAYS_DATA[fakeSummary.most_played_hand.hand]?.name}.name`)} (${fakeSummary.most_played_hand.count})`}
          />

          <RewardItem
            skip={skip}
            label={labels[3]}
            showCashSymbol={false}
            value={fakeSummary.cards_played_count}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
          />
          <RewardItem
            skip={skip}
            label={labels[4]}
            showCashSymbol={false}
            value={fakeSummary.cards_discarded_count}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
          />
          <RewardItem
            skip={skip}
            label={labels[5]}
            showCashSymbol={false}
            value={fakeSummary.rage_wins}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
          />
          <Box h="20px" />
        </StaggeredList>
      </PinkBox>
    </Flex>
  );
};
