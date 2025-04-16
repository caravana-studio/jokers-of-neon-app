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
import { useNavigate } from "react-router-dom";
import { useDisconnect } from "@starknet-react/core";
import { useGameContext } from "../../providers/GameProvider";
import { GAME_ID, LOGGED_USER } from "../../constants/localStorage.ts";

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
  const { openSettings, Modal: SettingsModal } = useSettingsModal();
  const game = useGame();
  const username = useUsername();
  const { t } = useTranslation(["game"]);
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const { restartGame } = useGameContext();

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
          <Flex gap={4} alignItems={"center"}>
            <ControllerIcon width={iconWidth} />
            Controller
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <BarMenuBtn
              width={iconWidth}
              icon={Icons.JOKER}
              description={""}
              onClick={() => {
                navigate("/my-games");
              }}
            />
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
              onClick={() => {
                navigate("/leaderboard");
              }}
            />
            {t("game.game-menu.leaderboard-btn")}
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <BarMenuBtn width={iconWidth} icon={Icons.DOCS} description={""} />
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
            <DiscordLink width={iconWidth} />
            Discord
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent={"left"} fontSize={fontSize}>
          <Flex columnGap={4} alignItems={"center"}>
            <BarMenuBtn
              width={iconWidth}
              icon={Icons.LOGOUT}
              description={""}
              onClick={() => {
                localStorage.removeItem(GAME_ID);
                localStorage.removeItem(LOGGED_USER);
                disconnect();
                restartGame();
                navigate("/");
              }}
            />
            {t("game.game-menu.logout-btn")} {username}{" "}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
