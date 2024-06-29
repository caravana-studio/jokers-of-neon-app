import { Button, Flex } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { GameContent } from "./GameContent";

export const GamePage = () => {
  const handle = useFullScreenHandle();
  return isMobile && !handle.active ? (
    <Flex justifyContent="center" alignItems="center" height={"100%"}>
      <Button onClick={handle.enter}>FULLSCREEN</Button>
    </Flex>
  ) : isMobile ? (
    <FullScreen handle={handle}>
      <GameContent />
    </FullScreen>
  ) : (
    <GameContent />
  );
};
