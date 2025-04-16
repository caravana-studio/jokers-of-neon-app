import {
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
import { LeaderboardBtn } from "../Buttons/LeaderboardBtn";
import { DocsBtn } from "../Buttons/DocsBtn";
import { SettingsBtn } from "../Buttons/SettingsBtn";
import { LogoutMenuBtn } from "../Buttons/LogoutMenuBtn";

interface GameMenuContentProps {
  isOpen: boolean;
  onClose: Function;
}

export const GameMenuContent: React.FC<GameMenuContentProps> = ({
  isOpen,
  onClose,
}) => {
  const iconWidth = "36px";
  const fontSize = "22px";
  const game = useGame();

  return (
    <Modal
      onClose={() => onClose()}
      size="full"
      isOpen={isOpen}
      variant={"fullscreen"}
    >
      <ModalOverlay />
      <ModalContent justifyContent={"center"} p={8}>
        <ModalHeader>
          <Flex
            sx={{
              alignItems: "center",
            }}
          >
            <CachedImage src="/logos/jn.png" width="58px" />
            <Text fontFamily="Orbitron" fontSize={fontSize} fontWeight="100">
              {" "}
              · {game?.id}
            </Text>
          </Flex>
          <ModalCloseButton
            padding={4}
            m={8}
            fontSize={"xl"}
            top={4}
            right={4}
          />
        </ModalHeader>

        <ModalBody
          display={"flex"}
          flexDir={"column"}
          justifyContent={"space-around"}
          alignItems={"left"}
          py={8}
          fontSize={fontSize}
          gap={4}
        >
          <ControllerIcon width={iconWidth} label />
          <MyGamesMenuBtn width={iconWidth} label />
          <MapMenuBtn width={iconWidth} label />
          <LeaderboardBtn width={iconWidth} label />
          <DocsBtn width={iconWidth} label />
          <SettingsBtn width={iconWidth} label />
          <DiscordLink width={iconWidth} label />
        </ModalBody>
        <ModalFooter justifyContent={"left"} fontSize={fontSize}>
          <LogoutMenuBtn width={iconWidth} label />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
