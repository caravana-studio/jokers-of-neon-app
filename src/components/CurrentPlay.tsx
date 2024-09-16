import { InfoIcon } from "@chakra-ui/icons";
import { Button, Flex, Text, Tooltip } from "@chakra-ui/react";
import { PLAYS } from "../constants/plays";
import { Plays } from "../enums/plays";
import { useGameContext } from "../providers/GameProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const CurrentPlay = () => {
  const { preSelectedPlay, playIsNeon } = useGameContext();
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(false);
  
  return (
    <Flex gap={{base: 2, md: 4}} alignItems={"center"} justifyContent={"flex-start"}
    >
      <Flex onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}>
        {hoveredButton && (
          <Button
            // height={8}
            // px={{ base: "3px", md: "10px" }}
            fontSize="8px"
            borderRadius={"10px"}
            variant={"solid"}
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
          // backgroundColor={"transparent"}
          // border={"none"}
          // boxShadow={"none"}
          _hover={{
            backgroundColor: "transparent",
          }}
          width={{ base: "10px", md: "15px" }}
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
