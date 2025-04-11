import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../constants/icons";
import { useGame } from "../../dojo/queries/useGame";
import { useCurrentPageName } from "../../hooks/useCurrentPageName";
import { ControllerIcon } from "../../icons/ControllerIcon";
import { AnimatedText } from "../AnimatedText";
import { DiscordLink } from "../DiscordLink";
import { GameMenu } from "../GameMenu/GameMenu";
import { BarMenuBtn } from "./BarMenuBtn";
import { BarMenuComingSoonBtn } from "./BarMenuComingSoonBtn";
import { useSettingsModal } from "../../hooks/useSettingsModal";

export const SidebarMenu = () => {
  const { t } = useTranslation(["game"]);
  const game = useGame();
  const navigate = useNavigate();
  const page = useCurrentPageName();

  const iconWidth = "50%";

  const [animatedText, setAnimatedText] = useState(page?.name ?? "");
  const { openSettings, Modal } = useSettingsModal();

  useEffect(() => {
    setTimeout(() => {
      setAnimatedText(page?.name ?? "");
    }, 500);
  }, [page?.name]);

  return (
    <Flex
      width={12}
      p={1}
      py={12}
      height="100%"
      flexDirection={"column"}
      justifyContent={"space-around"}
      alignItems={"center"}
      alignContent={"center"}
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
        <ControllerIcon width={iconWidth} />

        <BarMenuComingSoonBtn
          width={iconWidth}
          icon={Icons.MAP}
          description={t("game.game-menu.map-btn")}
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
            navigate("/docs");
          }}
          width={iconWidth}
        />
        <BarMenuBtn
          icon={Icons.SETTINGS}
          description={t("game.game-menu.settings-btn")}
          onClick={openSettings}
          width={iconWidth}
        />
        {Modal}
      </Flex>
      <Flex
        gap={4}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        flex={1}
      >
        <Flex
          flexDirection={"column"}
          py={8}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => page?.url && navigate(page.url)}
          cursor={"pointer"}
          flex={1}
        >
          <AnimatedText duration={0.5} displayedText={page?.name ?? ""}>
            <Heading
              variant="italic"
              as="div"
              mb={4}
              size={"sm"}
              textTransform={"uppercase"}
              flex={1}
              sx={{
                writingMode: "vertical-lr",
                whiteSpace: "nowrap",
                transform: "rotate(-180deg)",
              }}
            >
              {animatedText}
            </Heading>
          </AnimatedText>
          <BarMenuBtn icon={Icons.CIRCLE} description={""} width={iconWidth} />
        </Flex>
        <GameMenu />
        <DiscordLink width={"100%"} />
      </Flex>
    </Flex>
  );
};
