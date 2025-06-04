import { Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../constants/icons";
import { useGame } from "../../../dojo/queries/useGame";
import { ControllerIcon } from "../../../icons/ControllerIcon";
import { AnimatedText } from "../../AnimatedText";
import CachedImage from "../../CachedImage";
import { DiscordLink } from "../../DiscordLink";
import { MenuBtn } from "../Buttons/MenuBtn";
import { MapMenuBtn } from "../Buttons/MapMenuBtn";
import { LeaderboardMenuBtn } from "../Buttons/LeaderboardMenuBtn";
import { DocsMenuBtn } from "../Buttons/DocsMenuBtn";
import { SettingsMenuBtn } from "../Buttons/SettingsMenuBtn";
import { MyGamesMenuBtn } from "../Buttons/MyGamesMenuBtn";
import { LogoutMenuListBtn } from "../Buttons/Logout/LogoutMenuListBtn";
import { TutorialBtn } from "../Buttons/TutorialBtn";
import { useFeatureFlagEnabled } from "../../../featureManagement/useFeatureFlagEnabled";
import { useCurrentPageInfo } from "../../../hooks/useCurrentPageInfo";

export const SidebarMenu = () => {
  const game = useGame();
  const navigate = useNavigate();
  const page = useCurrentPageInfo();
  const hideTutorialFF = useFeatureFlagEnabled("global", "hideTutorial");

  const iconWidth = "20px";

  const [animatedText, setAnimatedText] = useState(page?.name ?? "");

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
        <MapMenuBtn width={iconWidth} />
        <LeaderboardMenuBtn width={iconWidth} />
        <DocsMenuBtn width={iconWidth} />
        <MyGamesMenuBtn width={iconWidth} />
        <SettingsMenuBtn width={iconWidth} />
        <DiscordLink width={iconWidth} />
        {!hideTutorialFF && <TutorialBtn width={iconWidth} />}
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
          <MenuBtn
            icon={page?.icon ?? Icons.CIRCLE}
            description={""}
            width={iconWidth}
          />
          <Flex
            sx={{
              h: "30px",
              w: "80px",
              transform: "rotate(-90deg)",
              alignItems: "center",
              mt: 8,
            }}
          >
            <CachedImage src="/logos/jn.png" height="15px" />
            <Text fontFamily="Orbitron" fontSize="15px" fontWeight="500">
              {" "}
              · {game?.id}
            </Text>
          </Flex>
        </Flex>
        <LogoutMenuListBtn width={iconWidth} />
      </Flex>
    </Flex>
  );
};
