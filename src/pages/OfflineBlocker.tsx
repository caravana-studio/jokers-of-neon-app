import { Flex, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { PositionedVersion } from "../components/version/PositionedVersion";
import { PreThemeLoadingPage } from "./PreThemeLoadingPage";

type OfflineBlockerProps = {
  onRetry: () => void;
};

export const OfflineBlocker = ({ onRetry }: OfflineBlockerProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "offline",
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
        {t("title")} <br />
        {t("description")}
      </Text>
      <Flex flexDirection={"row"} gap={"30px"}>
        <button
          style={{ color: "white" }}
          className="login-button"
          onClick={onRetry}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 0,
            }}
          >
            <div>{t("retry")}</div>
          </div>
        </button>
      </Flex>
      <PositionedVersion />
    </PreThemeLoadingPage>
  );
};
