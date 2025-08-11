import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { needsPadding } from "../../utils/capacitorUtils";
import { ContextMenuItem } from "./ContextMenuItem";
import { mainMenuUrls, useContextMenuItems } from "./useContextMenuItems";

interface BottomMenuProps {
  onLeaveGameClick: () => void;
}

export const BottomMenu = ({ onLeaveGameClick }: BottomMenuProps) => {
  const { mainMenuItems, inGameMenuItems } = useContextMenuItems({
    onLeaveGameClick,
  });

  return (
    <>
      <Flex
        h="50px"
        w="100%"
        backgroundColor="black"
        alignItems="center"
        zIndex={1000}
        position="absolute"
        bottom={needsPadding ? "30px" : "0px"}
      >
        {(mainMenuUrls.includes(window.location.pathname)
          ? mainMenuItems
          : inGameMenuItems
        ).map((item) => (
          <ContextMenuItem {...item} />
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
