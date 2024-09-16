import { InfoIcon } from "@chakra-ui/icons";
import { Button, Flex, Text, Tooltip } from "@chakra-ui/react";
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
      <Flex onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
            gap={2}
            >
        {hoveredButton && (
          <Button
            height={isMobile ? 6 : 8}
            px={"12px"}
            textTransform="initial"
            size={isMobile ? "xs" :"md"}
            fontSize="10px"
            borderRadius={"8px"}
            variant={"solid"}
            _hover={{
              borderColor: "white !important"
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/plays");
            }}
          >
            Show plays
          </Button>
        )}
        
        <Button
          variant={hoveredButton ? "solid" : "defaultOutline"}
          borderRadius={"8px"}
          height={isMobile ? 6 : 8}
          px={"2px"}
          _hover={{
            borderColor: "white !important"
          }}
          size={isMobile ? "xs" :"md"}
          className="game-tutorial-step-5"
          >
            !
        </Button>
      </Flex>

      
      <Text size="l">
        {preSelectedPlay === Plays.NONE
          ? "Select some cards to play"
          : `Current Play: ${playIsNeon ? "NEON " : ""} ${PLAYS[preSelectedPlay]}`}
      </Text>
    </Flex>
  );
};
