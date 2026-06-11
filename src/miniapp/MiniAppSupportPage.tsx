import { Box, Link, Text } from "@chakra-ui/react";
import { Trans, useTranslation } from "react-i18next";
import { MiniAppInfoPageLayout } from "./MiniAppInfoPageLayout";

export const MiniAppSupportPage = () => {
  const { t } = useTranslation("miniapp", {
    keyPrefix: "profile-pages.support",
  });

  return (
    <MiniAppInfoPageLayout title={t("title")}>
      <Box
        bg="rgba(0, 0, 0, 0.45)"
        border="1px solid rgba(255, 255, 255, 0.12)"
        borderRadius="2xl"
        p={{ base: 5, md: 7 }}
      >
        <Text fontSize={{ base: "md", md: "lg" }} lineHeight="tall" mb={4}>
          {t("intro")}
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} lineHeight="tall">
          <Trans
            i18nKey="miniapp:profile-pages.support.email"
            components={{
              email: <Link href="mailto:gm@jokersofneon.com" color="purple.200" />,
            }}
          />
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} lineHeight="tall" mt={4}>
          <Trans
            i18nKey="miniapp:profile-pages.support.discord"
            components={{
              discord: (
                <Link
                  href="https://discord.gg/4y296W6jaq"
                  color="purple.200"
                  isExternal
                />
              ),
            }}
          />
        </Text>
      </Box>
    </MiniAppInfoPageLayout>
  );
};
