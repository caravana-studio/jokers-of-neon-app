import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Joyride, { CallBackProps } from "react-joyride";
import { useNavigate } from "react-router-dom";
import {
  REWARDS_TUTORIAL_STEPS,
  TUTORIAL_STYLE,
} from "../constants/gameTutorial";
import { SKIP_TUTORIAL_REWARDS } from "../constants/localStorage.ts";
import { VIOLET } from "../theme/colors";
import { RoundRewards } from "../types/RoundRewards.ts";
import { PinkBox } from "./PinkBox.tsx";

interface RewardItemProps {
  id: string;
  label: string;
  value: number;
}

const RewardItem = ({ id, label, value }: RewardItemProps) => {
  return (
    <Box className={id} color="white" px={[2, 4, 8]} w="100%">
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

  const [run, setRun] = useState(false);

  useEffect(() => {
    const showTutorial = !localStorage.getItem(SKIP_TUTORIAL_REWARDS);
    if (showTutorial) setRun(true);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { type } = data;

    if (type === "tour:end") {
      window.localStorage.setItem(SKIP_TUTORIAL_REWARDS, "true");
      setRun(false);
    }
  };

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
      onClick={() => navigate("/redirect/store")}
    >
      <Joyride
        steps={REWARDS_TUTORIAL_STEPS}
        run={run}
        continuous
        showSkipButton
        styles={TUTORIAL_STYLE}
        showProgress
        callback={handleJoyrideCallback}
      />

      <RewardItem
        id={"game-tutorial-step-1"}
        label={labels[0]}
        value={round_defeat}
      />
      <RewardItem id={"element-bonus"} label={labels[1]} value={level_bonus} />
      <RewardItem
        id={"game-tutorial-step-2"}
        label={labels[2]}
        value={hands_left_cash}
      />
      <RewardItem
        id={"game-tutorial-step-3"}
        label={labels[3]}
        value={discard_left_cash}
      />

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
          {total}ȼ
        </Heading>
      </Flex>
    </PinkBox>
  );
};
