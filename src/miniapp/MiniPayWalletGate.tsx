import { Flex, IconButton, Text } from "@chakra-ui/react";
import { RotateCw } from "lucide-react";
import { PropsWithChildren, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { PositionedVersion } from "../components/version/PositionedVersion";
import { PreThemeLoadingPage } from "../pages/PreThemeLoadingPage";
import { hasMiniPayWalletOrFallbackAddress } from "../utils/gameLoopBurner";

export const MiniPayWalletGate = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "minipay-gate",
  });
  const [hasWallet, setHasWallet] = useState(() =>
    hasMiniPayWalletOrFallbackAddress()
  );

  const retry = useCallback(() => {
    setHasWallet(hasMiniPayWalletOrFallbackAddress());
  }, []);

  if (hasWallet) {
    return <>{children}</>;
  }

  return (
    <PreThemeLoadingPage>
      <img width="70%" src="logos/logo.png" alt="logo" />
      <Text
        color="white"
        fontSize={14}
        lineHeight={1.4}
        textAlign="center"
        w="80%"
        letterSpacing={1}
      >
        {t("title")} <br />
        {t("description")}
      </Text>
      <Flex
        position="fixed"
        right={{ base: 5, md: 8 }}
        bottom={{ base: 5, md: 8 }}
        zIndex={2}
      >
        <IconButton
          aria-label={t("retry")}
          icon={<RotateCw size={18} />}
          onClick={retry}
          variant="ghost"
          color="white"
          border="1px solid rgba(255,255,255,0.35)"
          borderRadius="full"
          _hover={{ bg: "rgba(255,255,255,0.12)" }}
          _active={{ bg: "rgba(255,255,255,0.18)" }}
        />
      </Flex>
      <PositionedVersion />
    </PreThemeLoadingPage>
  );
};
