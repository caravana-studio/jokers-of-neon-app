import { Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { DiscordLink } from "../components/DiscordLink";
import { PositionedVersion } from "../components/version/PositionedVersion";
import { PreThemeLoadingPage } from "./PreThemeLoadingPage";

export const Maintenance = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "maintenance",
  });
  return (
    <PreThemeLoadingPage>
      <img width={isMobile ? "90%" : "60%"} src="logos/logo.png" alt="logo" />
      <Text
        color="white"
        fontSize={isMobile ? 15 : 26}
        lineHeight={1.4}
        textTransform={"uppercase"}
        textAlign={"center"}
        w={isMobile ? "80%" : "60%"}
        letterSpacing={1}
        fontWeight={"bold"}
      >
        {t("title")} <br />
      </Text>
      <Text
        color="white"
        fontSize={isMobile ? 12 : 16}
        lineHeight={1.4}
        textAlign={"center"}
        w={isMobile ? "80%" : "580px"}
        letterSpacing={1}
        mb={"24px"}
      >
        {t("description")}
      </Text>
      <DiscordLink width={isMobile ? "35px" : "40px"} />
      <PositionedVersion />
    </PreThemeLoadingPage>
  );
};
