import { Flex, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { PositionedVersion } from "../components/version/PositionedVersion";
import { APP_URL } from "../utils/capacitorUtils";
import { PreThemeLoadingPage } from "./PreThemeLoadingPage";

export const VersionMismatch = () => {
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
        NEW VERSION AVAILABLE <br /> Please update to continue
      </Text>
      <Flex flexDirection={"row"} gap={"30px"}>
        <button
          style={{ color: "white" }}
          className="login-button"
          onClick={() => {
            window.open(APP_URL, "_blank");
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 0,
            }}
          >
            <div>UPDATE</div>
          </div>
        </button>
      </Flex>
      <PositionedVersion />
    </PreThemeLoadingPage>
  );
};
