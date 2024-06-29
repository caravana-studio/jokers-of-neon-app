import { Button, Flex } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { GameContent } from "./GameContent";

export const GamePage = () => {
  return isMobile && !document.fullscreenElement ? (
    <Flex justifyContent="center" alignItems="center" height={"100%"}>
      <Button
        onClick={() => {
          document.documentElement.requestFullscreen();
        }}
      >
        FULLSCREEN
      </Button>
    </Flex>
  ) : (
    <GameContent />
  );
};
