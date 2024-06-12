import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Heading, Tooltip, useDisclosure } from "@chakra-ui/react";
import { PLAYS } from "../constants/plays";
import { Plays } from "../enums/plays";
import { useGameContext } from "../providers/GameProvider";
import { PlaysModal } from "./Plays/PlaysModal";

export const CurrentPlay = () => {
  const { preSelectedPlay } = useGameContext();
  const { isOpen: isPlaysModalOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex gap={4} alignItems={"center"}>
      <Tooltip fontFamily='Sys' label={"Show plays"} variant="outline" placement={"left"}>
        <InfoIcon
          sx={{ fontSize: "20px", cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        />
      </Tooltip>
      <PlaysModal isOpen={isPlaysModalOpen} onClose={onClose} />
      <Heading variant="neonGreen" size="m">
        {preSelectedPlay === Plays.NONE
          ? "plays information"
          : `CURRENT PLAY: ${PLAYS[preSelectedPlay]}`}
      </Heading>
    </Flex>
  );
};
