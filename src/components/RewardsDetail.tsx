import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { GameStateEnum } from "../dojo/typescript/custom.ts";
import { useCustomNavigate } from "../hooks/useCustomNavigate.tsx";
import { RerollIndicators } from "../pages/DynamicStore/storeComponents/TopBar/RerollIndicators.tsx";
import { useGameStore } from "../state/useGameStore.ts";
import { VIOLET_LIGHT } from "../theme/colors";
import { RoundRewards } from "../types/RoundRewards.ts";
import { CashSymbol } from "./CashSymbol.tsx";
import { PinkBox } from "./PinkBox.tsx";

interface RewardItemProps {
  label: string;
  value: number;
  reroll?: boolean;
}

const RewardItem = ({ label, value, reroll = false }: RewardItemProps) => {
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
        <Heading size="s">{label.toUpperCase()}</Heading>
        {reroll ? (
          <RerollIndicators rerolls={value} justifyContent="flex-end" />
        ) : (
          <Heading size="s">{value}</Heading>
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
    level_bonus,
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
  const { currentScore } = useGameStore();

  return (
    <PinkBox
      title={`${t("title", { round: roundNumber })}`}
      button={t("continue-btn")}
      onClick={() => {
        navigate(GameStateEnum.Map);
      }}
    >
      <Heading color="lightViolet" size="s">
        {" "}
        {t("final-score", { score: currentScore })}{" "}
      </Heading>

      <RewardItem label={labels[0]} value={round_defeat} />
      <RewardItem label={labels[2]} value={hands_left_cash} />
      <RewardItem label={labels[3]} value={discard_left_cash} />
      {rage_card_defeated_cash > 0 && (
        <RewardItem label={labels[5]} value={rage_card_defeated_cash} />
      )}
      {rerolls > 0 && <RewardItem label={labels[4]} value={rerolls} reroll />}

      <Flex
        color={VIOLET_LIGHT}
        pt={{ base: 4, sm: 8 }}
        pb={4}
        w="90%"
        justifyContent="space-between"
      >
        <Heading color="lightViolet" variant="italic">
          {t("total")}
        </Heading>
        <Heading color="lightViolet" variant="italic">
          {total}
          <CashSymbol />
        </Heading>
      </Flex>
    </PinkBox>
  );
};
