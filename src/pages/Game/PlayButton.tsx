import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useGameContext } from "../../providers/GameProvider";
import { ButtonContainer } from "./ButtonContainer";
import { useEffect } from "react";

interface PlayButtonProps {
  highlight?: boolean;
}

export const PlayButton = ({ highlight = false }: PlayButtonProps) => {
  const { preSelectedCards, play, handsLeft, preSelectionLocked } =
    useGameContext();

    useEffect(() => {
    }, [highlight]);

  const cantPlay = !highlight && (preSelectionLocked || preSelectedCards?.length === 0 || !handsLeft || handsLeft === 0 );

  return (
    <ButtonContainer>
      <Button
        width={isMobile ? "48%" : "170px"}
        onClick={(e) => {
          e.stopPropagation();
          play();
        }}
        variant={cantPlay ? "defaultOutline" : "secondarySolid"}
        isDisabled={cantPlay}
        className="game-tutorial-step-4"
      >
        {isMobile ? (
          <Box>
            <Text fontFamily="Orbitron" fontSize={16} height={"16px"}>
              play
            </Text>
            <Heading mt={1} fontSize={9} color="black">
              {handsLeft} left
            </Heading>
          </Box>
        ) : (
          "PLAY HAND"
        )}
      </Button>
      {!isMobile && <Text size="l">{handsLeft} left</Text>}
    </ButtonContainer>
  );
};
