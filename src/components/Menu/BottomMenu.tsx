import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDeckPreviewHoldStore } from "../../state/useDeckPreviewHoldStore";
import { isNative } from "../../utils/capacitorUtils";
import { isTutorial } from "../../utils/isTutorial";
import { ContextMenuItem } from "./ContextMenuItem";
import { GameMenuContent } from "./GameMenu/GameMenuContent";
import { isInGamePath, useContextMenuItems } from "./useContextMenuItems";

export const BottomMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { mainMenuItems, inGameMenuItems } = useContextMenuItems({
    onMoreClick: () => setIsMenuOpen(true),
  });
  const inTutorial = isTutorial();
  const setDeckPreviewVisible = useDeckPreviewHoldStore(
    (store) => store.setDeckPreviewVisible
  );

  useEffect(() => {
    setDeckPreviewVisible(false);
  }, [location.pathname, setDeckPreviewVisible]);

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
        bottom={isNative ? "30px" : "0px"}
      >
        {(isInGamePath(location.pathname) ? inGameMenuItems : mainMenuItems).map((item) => {
          const { key, ...menuItem } = item;
          return (
            <ContextMenuItem
              key={key}
              {...menuItem}
              nameKey={key}
              disabled={inTutorial}
              pulse={item.pulse}
              onHoldChange={
                key === "deck"
                  ? (isHolding) => setDeckPreviewVisible(isHolding)
                  : undefined
              }
            />
          );
        })}
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
