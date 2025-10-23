import { Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { isAndroid, isMobile } from "react-device-detect";
import { ANDROID_URL, IOS_URL } from "../utils/capacitorUtils";
import { PreThemeLoadingPage } from "./PreThemeLoadingPage";
import { useTranslation } from "react-i18next";

export const MobileBrowserBlocker = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "mobile-blocker",
  });
  useEffect(() => {
    window.open(isAndroid ? ANDROID_URL : IOS_URL, "_blank");
  }, []);
  return (
    <PreThemeLoadingPage>
      <img width={isMobile ? "90%" : "60%"} src="logos/logo.png" alt="logo" />
      <Text
        color="white"
        fontSize={14}
        lineHeight={1.4}
        textAlign={"center"}
        w="80%"
        letterSpacing={1}
      >
        {t("mobile-browsers-are-not-supported")} <br />
        {t("please-download-the-app-to-continue")}
      </Text>
      <Flex
        onClick={() => {
          window.open(isAndroid ? ANDROID_URL : IOS_URL, "_blank");
        }}
        flexDirection={"row"}
        mt="20px"
      >
        <img
          src={`/download/${isAndroid ? "android" : "ios-black"}.svg`}
          width="170px"
          alt="Download"
        />
      </Flex>
    </PreThemeLoadingPage>
  );
};
