import { Flex, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { PositionedVersion } from "../components/version/PositionedVersion";
import { APP_URL } from "../utils/capacitorUtils";
import { PreThemeLoadingPage } from "./PreThemeLoadingPage";

export const VersionMismatch = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "version-mismatch",
  });
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
        {t("new-version-available")} <br />
        {t("please-update")}
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
            <div>{t("update")}</div>
          </div>
        </button>
      </Flex>
      <PositionedVersion />
    </PreThemeLoadingPage>
  );
};
