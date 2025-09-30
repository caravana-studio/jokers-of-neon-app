import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { matchPath } from "react-router-dom";
import { needsPadding } from "../../utils/capacitorUtils";
import { ContextMenuItem } from "./ContextMenuItem";
import { GameMenuContent } from "./GameMenu/GameMenuContent";
import { mainMenuUrls, useContextMenuItems } from "./useContextMenuItems";
import { isTutorial } from "../../utils/isTutorial";

export const BottomMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mainMenuItems, inGameMenuItems } = useContextMenuItems({
    onMoreClick: () => setIsMenuOpen(true),
  });
  const inTutorial = isTutorial();

  return (
    <>
      {isMenuOpen && (
        <GameMenuContent
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
      <Flex
        h="50px"
        w="100%"
        backgroundColor="black"
        alignItems="center"
        zIndex={1000}
        position="absolute"
        bottom={needsPadding ? "30px" : "0px"}
      >
        {(mainMenuUrls.some((url) =>
          matchPath({ path: url, end: true }, window.location.pathname)
        )
          ? mainMenuItems
          : inGameMenuItems
        ).map((item) => (
          <ContextMenuItem {...item} nameKey={item.key} disabled={inTutorial} />
        ))}
      </Flex>

      <Flex
        position="absolute"
        zIndex={900}
        backgroundColor="black"
        bottom={0}
        w="100%"
        height="50px"
      />
    </>
  );
};
