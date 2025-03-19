import { Box, Flex, Heading, Tooltip } from "@chakra-ui/react";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { BarMenuBtn } from "./BarMenuBtn";
import { Icons } from "../../constants/icons";
import { useState } from "react";
import { SettingsModal } from "../SettingsModal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../dojo/queries/useGame";
import { GameMenu } from "../GameMenu";

export const SidebarMenu = () => {
  const { isSmallScreen } = useResponsiveValues();
  const [isSettingsModalOpened, setSettingsModalOpened] = useState(false);
  const { t } = useTranslation(["game"]);
  const game = useGame();
  const navigate = useNavigate();

  // if (isSmallScreen) return null;

  const iconWidth = "50%";

  return (
    <>
      {isSettingsModalOpened && (
        <SettingsModal close={() => setSettingsModalOpened(false)} />
      )}
      <Flex
        position="fixed"
        width={12}
        p={1}
        height="100%"
        flexDirection={"column"}
        justifyContent={"space-around"}
        zIndex={1000}
        left={0}
        top={0}
        backgroundColor={"black"}
      >
        <Flex
          flexDirection={"column"}
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <BarMenuBtn
            icon={Icons.CARTRIDGE}
            description={"Controller account"}
            onClick={() => {}}
            width={iconWidth}
          />
          <BarMenuBtn
            icon={Icons.MAP}
            description={"Map"}
            onClick={() => {}}
            width={iconWidth}
          />
          <BarMenuBtn
            icon={Icons.PODIUM}
            description={t("game.game-menu.leaderboard-btn")}
            onClick={() => {
              navigate("/leaderboard");
            }}
            width={iconWidth}
          />
          <BarMenuBtn
            icon={Icons.FILES}
            description={t("game.game-menu.docs-btn")}
            onClick={() => {
              navigate("/docs", {
                state: { inStore: game?.state === "AT_SHOP" },
              });
            }}
            width={iconWidth}
          />
          <BarMenuBtn
            icon={Icons.SETTINGS}
            description={t("game.game-menu.settings-btn")}
            onClick={() => {
              if (setSettingsModalOpened) {
                setSettingsModalOpened(true);
              }
            }}
            width={iconWidth}
          />
        </Flex>
        <Flex
          gap={4}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Flex
            flexDirection={"column"}
            py={8}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Heading
              variant="italic"
              mb={4}
              size={"sm"}
              sx={{
                writingMode: "vertical-lr",
                whiteSpace: "nowrap",
                transform: "rotate(-180deg)",
              }}
            >
              REWARDS - GLOBALS
            </Heading>
            <BarMenuBtn
              icon={Icons.CIRCLE}
              description={""}
              width={iconWidth}
            />
          </Flex>
          <GameMenu />
        </Flex>
      </Flex>
    </>
  );
};
