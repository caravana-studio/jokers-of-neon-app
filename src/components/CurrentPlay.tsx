import { InfoIcon } from "@chakra-ui/icons";
import { Button, Flex, Text } from "@chakra-ui/react";
import { PLAYS } from "../constants/plays";
import { Plays } from "../enums/plays";
import { useGameContext } from "../providers/GameProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { isMobile } from "react-device-detect";

export const CurrentPlay = () => {
  const { preSelectedPlay, playIsNeon } = useGameContext();
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(false);
  
  return (
    <Flex gap={{base: 2, md: 4}} alignItems={"center"} justifyContent={"flex-start"}
    >
        <Button
          position={"absolute"}
          variant={hoveredButton ? "solid" : "defaultOutline"}
          borderRadius={"8px"}
          height={isMobile ? 6 : 8}
          right={isMobile ? "50%" : "340px"}
          bottom={isMobile ? "4px" : "25px"}
          borderColor = "transparent !important"
          _hover={{
            borderColor: "white !important"
          }}
          size={"xs"}
          className="game-tutorial-step-5"
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
          onClick={(e) => {
            e.stopPropagation();
            navigate("/plays");
          }}
          >
            <Flex gap={2} alignItems={"center"} justifyContent={"space-between"}>
              <InfoIcon
                color="white"
                fontSize={{ base: "14px", md: "20px" }}
                sx={{ cursor: "pointer" }}
                className="game-tutorial-step-5"
              />
              <Text textTransform="initial">
                Show plays
              </Text>
            </Flex>
        </Button>

      <Text size="l">
        {preSelectedPlay === Plays.NONE
          ? "Select some cards to play"
          : `Current Play: ${playIsNeon ? "NEON " : ""} ${PLAYS[preSelectedPlay]}`}
      </Text>
    </Flex>
  );
};
