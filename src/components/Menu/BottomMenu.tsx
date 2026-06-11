import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  GameQuickPreviewType,
  useGameQuickPreviewStore,
} from "../../state/useGameQuickPreviewStore";
import { isNative } from "../../utils/capacitorUtils";
import { ContextMenuItem } from "./ContextMenuItem";
import { GameMenuContent } from "./GameMenu/GameMenuContent";
import { isInGamePath, useContextMenuItems } from "./useContextMenuItems";

export const BottomMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { mainMenuItems, inGameMenuItems } = useContextMenuItems({
    onMoreClick: () => setIsMenuOpen(true),
  });
  const setPreviewType = useGameQuickPreviewStore(
    (store) => store.setPreviewType,
  );

  useEffect(() => {
    setPreviewType(null);
  }, [location.pathname, setPreviewType]);

  const previewTypeByKey: Partial<Record<string, GameQuickPreviewType>> = {
    deck: "deck",
    plays: "plays",
    missions: "missions",
  };

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
        {(isInGamePath(location.pathname)
          ? inGameMenuItems
          : mainMenuItems
        ).map((item) => {
          const { key, ...menuItem } = item;
          const previewType = previewTypeByKey[key];
          return (
            <ContextMenuItem
              key={key}
              {...menuItem}
              nameKey={key}
              pulse={item.pulse}
              onPreviewChange={
                previewType
                  ? (isVisible) =>
                      setPreviewType(isVisible ? previewType : null)
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
