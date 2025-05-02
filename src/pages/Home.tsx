import { Button, Flex, Heading } from "@chakra-ui/react";
import { useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import { PositionedDiscordLink } from "../components/DiscordLink";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { PoweredBy } from "../components/PoweredBy";
import { useDojo } from "../dojo/useDojo";

import { RemoveScroll } from "react-remove-scroll";
import { MobileDecoration } from "../components/MobileDecoration";
import SpineAnimation from "../components/SpineAnimation";
import { CLASSIC_MOD_ID } from "../constants/general";
import { useFeatureFlagEnabled } from "../featureManagement/useFeatureFlagEnabled";
import { useGameContext } from "../providers/GameProvider";
import { useResponsiveValues } from "../theme/responsiveSettings";

const isDev = import.meta.env.VITE_DEV === "true";

export const Home = () => {
  const [playButtonClicked, setPlayButtonClicked] = useState(false);
  const { connect, connectors } = useConnect();
  const { account } = useDojo();

  const navigate = useNavigate();
  const { t } = useTranslation(["home"]);
  const { setModId } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();

  useEffect(() => {
    setModId(CLASSIC_MOD_ID);
  }, []);

  const enableMods = useFeatureFlagEnabled("global", "showMods");

  useEffect(() => {
    if (account?.account && playButtonClicked) {
      navigate(enableMods ? "/mods" : "/my-games");
    }
  }, [account, playButtonClicked]);

  return (
    <>
      <MobileDecoration />
      <RemoveScroll>
        <></>
      </RemoveScroll>
      <AudioPlayer />
      <LanguageSwitcher />
      <Flex
        height="100%"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          gap={{ base: 6, sm: 8, md: 6 }}
          w={"100%"}
          zIndex={1}
        >
          <Heading
            size="xl"
            color="white"
            fontSize={{ base: 10, sm: 20, md: 25, lg: 30 }}
          >
            {t("home.slogan")}
          </Heading>

          <Flex
            w={"100%"}
            justifyContent="center"
            minH={isSmallScreen ? "unset" : "40vh"}
            flexGrow={1}
            maxWidth={isMobile ? "70%" : "50%"}
          >
            <Flex h={"100%"} w="100%" justifyContent={"center"} pl={2}>
              <SpineAnimation
                jsonUrl={`/spine-animations/logo/JokerLogo.json`}
                atlasUrl={`/spine-animations/logo/JokerLogo.atlas`}
                initialAnimation={"animation"}
                loopAnimation={"animation"}
                scale={2.8}
                yOffset={-800}
              />
            </Flex>
          </Flex>

          <Flex
            gap={{ base: 4, sm: 6 }}
            flexWrap={{ base: "wrap", sm: "nowrap" }}
          >
            <Button
              variant="secondarySolid"
              onClick={() => {
                if (isDev) {
                  navigate(enableMods ? "/mods" : "/login");
                } else {
                  setPlayButtonClicked(true);
                  connect({ connector: connectors[0] });
                }
              }}
              minW={["150px", "300px"]}
            >
              {t("home.btn.start")}
            </Button>
          </Flex>
        </Flex>
        <PoweredBy />
      </Flex>
      <PositionedDiscordLink />
    </>
  );
};
