import { Divider, Flex, Heading } from "@chakra-ui/react";
import RerollButton from "../../store/StoreElements/RerollButton";
import { PlayDiscardIndicators } from "../../Game/PlayDiscardIndicator";
import { DefaultInfo } from "../../../components/Info/DefaultInfo";
import { MobileCoins } from "../../store/Coins";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { BarMenuBtn } from "../../../components/BarMenu/BarMenuBtn";
import { Icons } from "../../../constants/icons";
import { useCurrentPageName } from "../../../hooks/useCurrentPageName";
import { useNavigate } from "react-router-dom";
import { BarMenuComingSoonBtn } from "../../../components/BarMenu/BarMenuComingSoonBtn";
import { ControllerIcon } from "../../../icons/ControllerIcon";
import { useState } from "react";
import { SettingsModal } from "../../../components/SettingsModal";
import { useTranslation } from "react-i18next";
import { useGame } from "../../../dojo/queries/useGame";

export const TopBarStore = () => {
  const { isSmallScreen } = useResponsiveValues();
  const page = useCurrentPageName();
  const navigate = useNavigate();
  const { t } = useTranslation(["game"]);
  const game = useGame();

  const iconWidth = "14px";

  const [isSettingsModalOpened, setSettingsModalOpened] = useState(false);

  return (
    <>
      {isSettingsModalOpened && (
        <SettingsModal close={() => setSettingsModalOpened(false)} />
      )}
      <Flex
        flexDirection="column"
        p={2}
        px={"16px"}
        width={"100%"}
        backgroundColor={"black"}
        justifyContent={"center"}
      >
        <Flex justifyContent="space-between" alignContent={"center"}>
          <Flex
            py={1}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            onClick={() => page?.url && navigate(page.url)}
            cursor={"pointer"}
            flex={1}
            gap={2}
          >
            <BarMenuBtn icon={Icons.CIRCLE} description={""} width={"12px"} />
            <Heading
              variant="italic"
              as="div"
              size={"xs"}
              textTransform={"uppercase"}
              flex={1}
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              {page?.name ?? ""}
            </Heading>
          </Flex>
          <Flex gap={4} justifyContent={"center"} alignItems={"center"}>
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
              icon={Icons.PODIUM}
              description={t("game.game-menu.leaderboard-btn")}
              onClick={() => {
                navigate("/leaderboard");
              }}
              width={iconWidth}
            />
            <BarMenuComingSoonBtn
              width={iconWidth}
              icon={Icons.MAP}
              description={t("game.game-menu.map-btn")}
              mtText={isSmallScreen ? "8px" : undefined}
              fontSizeText={isSmallScreen ? "6px" : undefined}
            />
            <ControllerIcon width={iconWidth} />
          </Flex>
        </Flex>
        <Divider orientation="horizontal" color="white" />
        <Flex justifyContent="space-between" alignItems={"center"}>
          <Flex gap={4} py={1}>
            <RerollButton />

            <PlayDiscardIndicators
              disabled={false}
              type={"play"}
              total={3}
              active={3}
            />
            <DefaultInfo title="reroll" />
          </Flex>
          <Flex>
            <MobileCoins />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
