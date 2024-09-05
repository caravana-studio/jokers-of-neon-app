import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { PLAYS } from "../constants/plays";
import { Plays } from "../enums/plays";
import { useGameContext } from "../providers/GameProvider";
import { useNavigate } from "react-router-dom";

export const CurrentPlay = () => {
  const { preSelectedPlay } = useGameContext();
  const navigate = useNavigate();

  return (
    <Flex gap={4} alignItems={"center"} justifyContent={'flex-start'}>
      <Tooltip label={"Show plays"} placement={"left"}>
        <InfoIcon
        color='white'
          sx={{ fontSize: "20px", cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            navigate("/plays");
          }}
          className="game-tutorial-step-5"
        />
      </Tooltip>
      <Text size="l">
        {preSelectedPlay === Plays.NONE
          ? "Select some cards to play"
          : `Current Play: ${PLAYS[preSelectedPlay]}`}
      </Text>
    </Flex>
  );
};
