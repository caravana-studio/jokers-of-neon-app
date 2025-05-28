import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRound } from "../dojo/queries/useRound.tsx";
import { VIOLET_LIGHT } from "../theme/colors";
import { RoundRewards } from "../types/RoundRewards.ts";
import { CashSymbol } from "./CashSymbol.tsx";
import { PinkBox } from "./PinkBox.tsx";
import { useGame } from "../dojo/queries/useGame.tsx";
import { useDojo } from "../dojo/useDojo.tsx";
import { handeDailyGameAchievements } from "../utils/handleAchievements.ts";
import { useAudio } from "../hooks/useAudio.tsx";
import { achievementSfx } from "../constants/sfx.ts";
import { useSettings } from "../providers/SettingsProvider.tsx";
import { useEffect } from "react";

interface RewardItemProps {
  label: string;
  value: number;
}

const RewardItem = ({ label, value }: RewardItemProps) => {
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
        <Heading size="s">{value}</Heading>
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

  if (rage_card_defeated && rage_card_defeated_cash) {
    labels.push(t("rage", { cards: rage_card_defeated }));
  }

  const navigate = useNavigate();
  const round = useRound();
  const game = useGame();
  const {
    setup: {
      account: { account },
    },
  } = useDojo();
  const { sfxVolume } = useSettings();
  const { play: achievementSound } = useAudio(achievementSfx, sfxVolume);

  // TODO: POP UP SHOWING EVERY TIME in level 2, 3 and 5

  useEffect(() => {
    console.log(game?.current_node_id);
    handeDailyGameAchievements(
      game?.level ?? 0,
      game?.player_score ?? 0,
      achievementSound,
      account.address ?? ""
    );
  }, []);

  return (
    <PinkBox
      title={`${t("title", { round: roundNumber })}`}
      button={t("continue-btn")}
      onClick={() => {
        navigate("/redirect/map");
      }}
    >
      <Heading color="lightViolet" size="s">
        {" "}
        {t("final-score", { score: round?.current_score })}{" "}
      </Heading>

      <RewardItem label={labels[0]} value={round_defeat} />
      <RewardItem label={labels[2]} value={hands_left_cash} />
      <RewardItem label={labels[3]} value={discard_left_cash} />
      {rage_card_defeated_cash > 0 && (
        <RewardItem label={labels[4]} value={rage_card_defeated_cash} />
      )}

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
