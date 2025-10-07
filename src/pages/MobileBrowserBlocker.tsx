import { Flex, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { APP_URL } from "../utils/capacitorUtils";
import { PreThemeLoadingPage } from "./PreThemeLoadingPage";

export const MobileBrowserBlocker = () => {
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
        MOBILE BROWSERS ARE NOT SUPPORTED <br /> Please download the app to
        continue
      </Text>
      <Flex onClick={() => {
            window.open(APP_URL, "_blank");
          }}flexDirection={"row"} mt="20px">
        <img
          
          src="/download/ios-black.svg"
          width="150px"
          alt="Download on the App Store"
        />
      </Flex>
    </PreThemeLoadingPage>
  );
};
