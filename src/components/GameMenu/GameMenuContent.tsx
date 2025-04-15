import {
  Button,
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
import { ControllerIcon } from "../../icons/ControllerIcon";
import { BarMenuBtn } from "../BarMenu/BarMenuBtn";
import { Icons } from "../../constants/icons";
import { BarMenuComingSoonBtn } from "../BarMenu/BarMenuComingSoonBtn";
import { useSettingsModal } from "../../hooks/useSettingsModal";
import { DiscordLink } from "../DiscordLink";
import CachedImage from "../CachedImage";
import { useGame } from "../../dojo/queries/useGame";
import { useUsername } from "../../dojo/utils/useUsername";
import { useTranslation } from "react-i18next";

interface GameMenuContentProps {
  isOpen: boolean;
  onClose: Function;
}

export const GameMenuContent: React.FC<GameMenuContentProps> = ({
  isOpen,
  onClose,
}) => {
  const iconWidth = "50%";
  const fontSize = "22px";
  const { openSettings, Modal: SettingsModal } = useSettingsModal();
  const game = useGame();
  const username = useUsername();
  const { t } = useTranslation(["game"]);

  return (
    <Modal
      onClose={() => onClose()}
      size="full"
      isOpen={isOpen}
      variant={"fullscreen"}
    >
      <ModalOverlay />
      <ModalContent justifyContent={"center"} px={8} pb={8}>
        <ModalHeader>
          <Flex
            sx={{
              w: `${iconWidth}`,
              alignItems: "center",
              mt: 2,
              pl: 4,
            }}
          >
            <CachedImage src="/logos/jn.png" width={iconWidth} />
            <Text fontFamily="Orbitron" fontSize={fontSize} fontWeight="100">
              {" "}
              · {game?.id}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display={"flex"}
          flexDir={"column"}
          justifyContent={"space-around"}
          alignItems={"left"}
          py={12}
          fontSize={fontSize}
        >
          <Flex gap={4} alignItems={"center"}>
            <ControllerIcon width={iconWidth} />
            Controller
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <BarMenuBtn width={iconWidth} icon={Icons.JOKER} description={""} />
            {t("game.game-menu.my-games")}
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <BarMenuComingSoonBtn
              width={iconWidth}
              icon={Icons.MAP}
              description={""}
            />
            {t("game.game-menu.map-btn")}
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <BarMenuBtn
              width={iconWidth}
              icon={Icons.PODIUM}
              description={""}
            />
            {t("game.game-menu.leaderboard-btn")}
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <BarMenuBtn width={iconWidth} icon={Icons.FILES} description={""} />
            {t("game.game-menu.docs-btn")}
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <BarMenuBtn
              icon={Icons.SETTINGS}
              description={""}
              onClick={openSettings}
              width={iconWidth}
            />
            {SettingsModal}
            {t("game.game-menu.settings-btn")}
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <DiscordLink width="100%" />
            Discord
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent={"left"} fontSize={fontSize}>
          <Flex gap={4} alignItems={"center"}>
            <BarMenuBtn
              width={iconWidth}
              icon={Icons.LOGOUT}
              description={""}
            />
            {t("game.game-menu.logout-btn")} {username}{" "}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
