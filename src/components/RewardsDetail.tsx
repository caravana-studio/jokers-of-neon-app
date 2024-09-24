import { Box, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { VIOLET } from "../theme/colors";
import { RoundRewards } from "../types/RoundRewards.ts";
import { CashSymbol } from "./CashSymbol.tsx";
import { PinkBox } from "./PinkBox.tsx";

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
  // const {play: playNextLevelSound, stop: stopNextLevelSound} = useAudio(nextLevelSfx, 0.4);

  // useEffect(() => {
  //   if (roundRewards) {
  //     playNextLevelSound();
  //   }
  // }, [roundRewards, playNextLevelSound]);

  const {
    level,
    round_defeat,
    level_bonus,
    hands_left,
    hands_left_cash,
    discard_left,
    discard_left_cash,
    total,
  } = roundRewards;

  const labels = [
    `base`,
    "Level bonus",
    `${hands_left} Hands left`,
    `${discard_left} Discards left`,
  ];

  const navigate = useNavigate();

  return (
    <PinkBox
      title={`Level ${level} defeated`}
      button="CONTINUE"
      onClick={() => {
        // stopNextLevelSound();
        navigate("/redirect/store");
      }}
    >
      <RewardItem label={labels[0]} value={round_defeat} />
      <RewardItem label={labels[1]} value={level_bonus} />
      <RewardItem label={labels[2]} value={hands_left_cash} />
      <RewardItem label={labels[3]} value={discard_left_cash} />

      <Flex
        color={VIOLET}
        pt={{ base: 4, sm: 8 }}
        pb={4}
        w="90%"
        justifyContent="space-between"
      >
        <Heading color="neonPink" variant="italic">
          Total:
        </Heading>
        <Heading color="neonPink" variant="italic">
          {total}
          <CashSymbol />
        </Heading>
      </Flex>
    </PinkBox>
  );
};
