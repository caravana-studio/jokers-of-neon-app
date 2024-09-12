import { InfoIcon } from "@chakra-ui/icons";
import { Button, Flex, Text, Tooltip } from "@chakra-ui/react";
import { PLAYS } from "../constants/plays";
import { Plays } from "../enums/plays";
import { useGameContext } from "../providers/GameProvider";
import { useNavigate } from "react-router-dom";

export const CurrentPlay = () => {
  const { preSelectedPlay, playIsNeon } = useGameContext();
  const navigate = useNavigate();
  
  return (
    <Flex gap={{base: 2, md: 4}} alignItems={"center"} justifyContent={"flex-start"}>
      <Tooltip label={"Show plays"} placement={"left"}>
        <Button 
          backgroundColor={"transparent"}
          border={"none"}
          boxShadow={"none"}
          onClick={(e) => {
            e.stopPropagation();
            navigate("/plays");
          }}
          _hover={{
            backgroundColor: "transparent",
          }}
          >
          <InfoIcon
            color="white"
            fontSize={{ base: "14px", md: "20px" }}
            sx={{ cursor: "pointer" }}
            className="game-tutorial-step-5"
          />
        </Button>
      </Tooltip>
      <Text size="l">
        {preSelectedPlay === Plays.NONE
          ? "Select some cards to play"
          : `Current Play: ${playIsNeon ? "NEON " : ""} ${PLAYS[preSelectedPlay]}`}
      </Text>
    </Flex>
  );
};
