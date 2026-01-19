import { Box, Flex, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BOSS_LEVEL } from "../constants/general.ts";
import { GameStateEnum } from "../dojo/typescript/custom.ts";
import { useCustomNavigate } from "../hooks/useCustomNavigate.tsx";
import { RerollIndicators } from "../pages/DynamicStore/storeComponents/TopBar/RerollIndicators.tsx";
import { useGameStore } from "../state/useGameStore.ts";
import { BLUE_LIGHT, VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { RoundRewards } from "../types/RoundRewards.ts";
import { StaggeredList } from "./animations/StaggeredList.tsx";
import { CashSymbol } from "./CashSymbol.tsx";
import { PinkBox } from "./PinkBox.tsx";
import { RollingNumber } from "./RollingNumber.tsx";

interface RewardItemProps {
  label: string;
  value: number | string;
  reroll?: boolean;
  rollingDelay?: number;
  skip?: boolean;
  showCashSymbol?: boolean;
  coloredValue?: boolean;
}

const DELAY_START = 1.25;
const STAGGER = 0.5;

export const RewardItem = ({
  label,
  value,
  reroll = false,
  rollingDelay = 0,
  skip = false,
  showCashSymbol = true,
  coloredValue = false,
}: RewardItemProps) => {
  return (
    <Box color="white" px={[2, 4, 8]} w="100%">
      <Flex
        mt={2}
        pt={1}
        pb={1}
        justifyContent="space-between"
        fontSize={["md", "md", "lg", "xl"]}
        sx={{
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "1px",
            background: "white",
            boxShadow:
              "0 0 1px 0px rgba(255, 255, 255), 0 0 8px 1px rgba(255, 255, 255)",
          },
        }}
      >
        <Heading size="s" textAlign={"left"}>
          {label.toUpperCase()}
        </Heading>
        {reroll ? (
          typeof value === "number" && (
            <RerollIndicators rerolls={value} justifyContent="flex-end" />
          )
        ) : (
          <Flex gap={1} alignItems="center" justifyContent={"center"}>
            {showCashSymbol && <CashSymbol />}
            <Heading
              size="s"
              textAlign={"right"}
              color={coloredValue ? "blueLight" : "white"}
              textShadow={coloredValue ? `0 0 10px ${BLUE_LIGHT}` : "none"}
            >
              {skip || typeof value === "string" ? (
                value
              ) : (
                <RollingNumber n={value} delay={rollingDelay} sound />
              )}
            </Heading>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

interface RewardsDetailProps {
  roundRewards?: RoundRewards;
}

export const RewardsDetail = ({ roundRewards }: RewardsDetailProps) => {
  if (!roundRewards) return null;

  const {
    roundNumber,
    round_defeat,
    level_passed,
    hands_left,
    hands_left_cash,
    discard_left,
    discard_left_cash,
    rage_card_defeated,
    rage_card_defeated_cash,
    rerolls,
    total,
  } = roundRewards;

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "rewards-details.labels",
  });

  const labels = [
    t("base"),
    t("level-bonus"),
    t("hands-left", { hands: hands_left }),
    t("discards-left", { discards: discard_left }),
  ];

  if (rerolls) {
    labels.push(t("rerolls", { rerolls: rerolls }));
  }

  if (rage_card_defeated && rage_card_defeated_cash) {
    labels.push(t("rage", { cards: rage_card_defeated }));
  }

  const navigate = useCustomNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const { currentScore } = useGameStore();
  const [animationEnded, setAnimationEnded] = useState(false);
  const [skip, setSkip] = useState(false);

  const playerWon = level_passed === BOSS_LEVEL;

  const title = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
    >
      <Heading
        size={level_passed || !isSmallScreen ? "lg" : "sm"}
        variant="italic"
        textShadow={level_passed ? `0 0 8px ${VIOLET_LIGHT}` : "none"}
        lineHeight={1.1}
        color={VIOLET_LIGHT}
        mt={isSmallScreen ? 2 : 6}
        mb={1}
      >
        {level_passed
          ? playerWon
            ? t("title-win")
            : t("title-level", { level: level_passed })
          : t("title", { round: roundNumber })}
      </Heading>
    </motion.div>
  );

  const rewardLines =
    3 + (rage_card_defeated_cash > 0 ? 1 : 0) + (rerolls > 0 ? 1 : 0);

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
        button={playerWon ? t("endless-mode") : t("continue-btn")}
        onClick={() => {
          navigate(GameStateEnum.Map);
        }}
        actionHidden={!animationEnded}
        glowIntensity={level_passed ? (playerWon ? 1.5 : 1) : 0}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5, ease: "easeOut" }}
        >
          <Heading color="lightViolet" size="s">
            {" "}
            {t("final-score", { score: currentScore })}{" "}
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
            value={round_defeat}
            rollingDelay={DELAY_START * 1000 + 500}
          />
          <RewardItem
            skip={skip}
            label={labels[2]}
            value={hands_left_cash}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
          />
          <RewardItem
            skip={skip}
            label={labels[3]}
            value={discard_left_cash}
            rollingDelay={(DELAY_START + STAGGER) * 1000}
          />
          {rage_card_defeated_cash > 0 && (
            <RewardItem
              skip={skip}
              label={labels[5]}
              value={rage_card_defeated_cash}
              rollingDelay={(DELAY_START + STAGGER) * 1000}
            />
          )}
          {rerolls > 0 && (
            <RewardItem skip={skip} label={labels[4]} value={rerolls} reroll />
          )}

          <Flex
            color={VIOLET_LIGHT}
            pt={{ base: 2, sm: 8 }}
            pb={isSmallScreen ? 2 : 6}
            px={isSmallScreen ? 2 : 8}
            w="100%"
            justifyContent="space-between"
          >
            <Heading color="DIAMONDS">{t("total")}</Heading>
            <Flex gap={1} alignItems="center" justifyContent={"center"}>
              <CashSymbol />
              <Heading color="DIAMONDS" variant="italic">
                {skip ? (
                  total
                ) : (
                  <RollingNumber
                    delay={(DELAY_START + rewardLines * STAGGER) * 1000}
                    n={total}
                    sound
                  />
                )}
              </Heading>
            </Flex>
          </Flex>
        </StaggeredList>
      </PinkBox>
    </Flex>
  );
};
