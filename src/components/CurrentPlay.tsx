import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { PLAYS } from "../constants/plays";
import { Plays } from "../enums/plays";
import { useGameContext } from "../providers/GameProvider";
import { PlaysModal } from "./Plays/PlaysModal";

export const CurrentPlay = () => {
  const { preSelectedPlay, playIsNeon } = useGameContext();
  const { isOpen: isPlaysModalOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex gap={4} alignItems={"center"} justifyContent={'flex-start'}>
      <Tooltip label={"Show plays"} placement={"left"}>
        <InfoIcon
        color='white'
          sx={{ fontSize: "20px", cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="game-tutorial-step-5"
        />
      </Tooltip>
      <PlaysModal isOpen={isPlaysModalOpen} onClose={onClose} />
      <Text size="l">
        {preSelectedPlay === Plays.NONE
          ? "Select some cards to play"
          : `Current Play: ${playIsNeon ? "NEON " : ""} ${PLAYS[preSelectedPlay]}`}
      </Text>
    </Flex>
  );
};
