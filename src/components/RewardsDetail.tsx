import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { VIOLET } from "../theme/colors";
import { RoundRewards } from "../types/RoundRewards.ts";

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
        <Text>{label.toUpperCase()}</Text>
        <Text>{value}Ȼ</Text>
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
    `Round ${level} defeat`,
    "Level bonus",
    `${hands_left} Hands left`,
    `${discard_left} Discards left`,
  ];

  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      w="80%"
      maxW="550px"
      fontFamily="Orbitron"
    >
      <Heading size="lg" variant="italic" color={VIOLET}>
        CONGRATS!
      </Heading>
      <Box
        w="100%"
        px={[1, 2, 4]}
        py={2}
        mt={8}
        border="2px solid #DAA1E8FF"
        boxShadow={`0px 0px 20px 15px ${VIOLET}`}
        filter="blur(0.5px)"
        backgroundColor="rgba(0, 0, 0, 1)"
        borderRadius="10px"
        display="grid"
        justifyItems="center"
      >
        <RewardItem label={labels[0]} value={round_defeat} />
        <RewardItem label={labels[1]} value={level_bonus} />
        <RewardItem label={labels[2]} value={hands_left_cash} />
        <RewardItem label={labels[3]} value={discard_left_cash} />

        <Flex
          color={VIOLET}
          pt={4}
          pb={4}
          w="80%"
          justifyContent="space-between"
          fontWeight="bold"
          fontSize={["lg", "xl", "2xl"]}
        >
          <Text>Total:</Text>
          <Text>{total}ȼ</Text>
        </Flex>
      </Box>

      <Button
        mt={10}
        w="100%"
        size="md"
        variant="secondarySolid"
        onClick={() => navigate("/redirect/store")}
      >
        CONTINUE
      </Button>
    </Box>
  );
};
