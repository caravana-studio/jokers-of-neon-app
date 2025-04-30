import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useGame } from "../../../dojo/queries/useGame";
import CachedImage from "../../CachedImage";
import { ControllerIcon } from "../../../icons/ControllerIcon";
import { DiscordLink } from "../../DiscordLink";
import { MyGamesMenuBtn } from "../Buttons/MyGamesMenuBtn";
import { MapMenuBtn } from "../Buttons/MapMenuBtn";
import { LeaderboardMenuBtn } from "../Buttons/LeaderboardMenuBtn";
import { DocsMenuBtn } from "../Buttons/DocsMenuBtn";
import { SettingsMenuBtn } from "../Buttons/SettingsMenuBtn";
import { LogoutMenuBtn } from "../Buttons/Logout/LogoutMenuBtn";
import { useRef } from "react";

interface GameMenuContentProps {
  isOpen: boolean;
  onClose: Function;
}

export const GameMenuContent: React.FC<GameMenuContentProps> = ({
  isOpen,
  onClose,
}) => {
  const iconWidth = "26px";
  const fontSize = "18px";
  const game = useGame();

  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;

    if (deltaX < -80) {
      onClose();
    }
  };

  return (
    <Drawer
      onClose={() => onClose()}
      isOpen={isOpen}
      placement="left"
      size="full"
      variant="fullscreen"
    >
      <DrawerOverlay />
      <DrawerContent
        justifyContent="center"
        p={8}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <DrawerHeader>
          <Flex alignItems="center">
            <CachedImage src="/logos/jn.png" width="58px" />
            <Text fontFamily="Orbitron" fontSize={fontSize} fontWeight="100">
              {" "}
              · {game?.id}
            </Text>
          </Flex>
          <DrawerCloseButton
            padding={4}
            m={8}
            fontSize="lg"
            top={4}
            right={4}
          />
        </DrawerHeader>

        <DrawerBody
          display="flex"
          flexDir="column"
          justifyContent="center"
          alignItems="flex-start"
          py={8}
          fontSize={fontSize}
          gap={5}
        >
          <ControllerIcon width={iconWidth} label />
          <MyGamesMenuBtn width={iconWidth} label />
          <MapMenuBtn width={iconWidth} useLabel />
          <LeaderboardMenuBtn width={iconWidth} label />
          <DocsMenuBtn width={iconWidth} label />
          <SettingsMenuBtn width={iconWidth} label />
          <DiscordLink width={iconWidth} label />
        </DrawerBody>

        <DrawerFooter justifyContent="flex-start" fontSize={fontSize}>
          <LogoutMenuBtn width={iconWidth} label />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
