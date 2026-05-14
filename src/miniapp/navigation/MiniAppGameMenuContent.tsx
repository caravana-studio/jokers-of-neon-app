import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useGameStore } from "../../state/useGameStore";
import CachedImage from "../../components/CachedImage";
import { BackMenuBtn } from "../../components/Menu/Buttons/BackMenuBtn";
import { DocsMenuBtn } from "../../components/Menu/Buttons/DocsMenuBtn";
import { SettingsMenuBtn } from "../../components/Menu/Buttons/SettingsMenuBtn";

interface MiniAppGameMenuContentProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniAppGameMenuContent = ({
  isOpen,
  onClose,
}: MiniAppGameMenuContentProps) => {
  const iconWidth = "26px";
  const fontSize = "18px";
  const { id, isTournament } = useGameStore();
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
      onClose={onClose}
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
          <Flex alignItems="center" gap={2}>
            {isTournament ? (
              <CachedImage src="/tournament-entry.png" h="42px" />
            ) : (
              <CachedImage src="/logos/jn.png" width="58px" />
            )}
            <Text fontFamily="Orbitron" fontSize={fontSize} fontWeight="100">
              {" "}
              · {id}
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
          alignItems="center"
          py={4}
          fontSize={fontSize}
          overflow="hidden"
        >
          <Flex
            flexDir="column"
            gap={4}
            w="100%"
            maxW="500px"
            alignItems="flex-start"
            justifyContent="center"
            flex={1}
          >
            <BackMenuBtn width={iconWidth} label onClose={onClose} />
            <DocsMenuBtn width={iconWidth} label onClose={onClose} />
            <SettingsMenuBtn width={iconWidth} label onClose={onClose} />
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
