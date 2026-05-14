import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDeckPreviewHoldStore } from "../../state/useDeckPreviewHoldStore";
import { isNative } from "../../utils/capacitorUtils";
import { ContextMenuItem } from "../../components/Menu/ContextMenuItem";
import { isInGamePath } from "../../components/Menu/useContextMenuItems";
import { useMiniAppMenuItems } from "./useMiniAppMenuItems";
import { MiniAppGameMenuContent } from "./MiniAppGameMenuContent";

export const MiniAppBottomMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { mainMenuItems, inGameMenuItems } = useMiniAppMenuItems({
    onMoreClick: () => setIsMenuOpen(true),
  });
  const setDeckPreviewVisible = useDeckPreviewHoldStore(
    (store) => store.setDeckPreviewVisible
  );

  useEffect(() => {
    setDeckPreviewVisible(false);
  }, [location.pathname, setDeckPreviewVisible]);

  return (
    <>
      {isMenuOpen && (
        <MiniAppGameMenuContent
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
          return (
            <ContextMenuItem
              key={key}
              {...menuItem}
              nameKey={key}
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
