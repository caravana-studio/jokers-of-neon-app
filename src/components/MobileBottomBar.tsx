import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import CachedImage from "./CachedImage";
import { GameMenu } from "./GameMenu";

interface MobileBottomBarProps {
  firstButton: ReactNode;
  secondButton: ReactNode;
  setRun?: (run: boolean) => void;
  hideDeckButton?: boolean;
  navigateState?: {};
}

export const MobileBottomBar = ({
  firstButton,
  secondButton,
  setRun,
  hideDeckButton,
  navigateState,
}: MobileBottomBarProps) => {
  const navigate = useNavigate();
  return (
    <Flex
      width="98%"
      mx={4}
      mb={8}
      mt={3}
      justifyContent={"space-between"}
      zIndex={1000}
    >
      <GameMenu
        showTutorial={() => {
          navigate("/tutorial");
        }}
      />
      <Box w="30%">{firstButton}</Box>
      <Box w="30%">{secondButton}</Box>
      <Flex
        height={["30px", "45px"]}
        justifyContent="center"
        alignItems="center"
        width={["30px", "45px"]}
        border={hideDeckButton ? "none" : "1px solid white"}
        borderRadius={["8px", "14px"]}
        className="game-tutorial-step-9"
        onClick={() => !hideDeckButton && navigate("/deck", navigateState)}
      >
        {hideDeckButton ? (
          <></>
        ) : (
          <CachedImage height="15px" src="deck-icon.png" alt="deck-icon" />
        )}
      </Flex>
    </Flex>
  );
};
