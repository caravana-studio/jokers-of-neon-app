import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MiniAppInfoPageLayout } from "./MiniAppInfoPageLayout";

const PRIVACY_POLICY_URL = "https://jokersofneon.com/privacy-policy";

export const MiniAppPrivacyPolicyPage = () => {
  const { t } = useTranslation("miniapp", {
    keyPrefix: "profile-pages.privacy-policy",
  });

  return (
    <MiniAppInfoPageLayout>
      <Box
        borderRadius="2xl"
        overflow="hidden"
        bg="white"
        h={{ base: "72vh", md: "76vh" }}
      >
        <Box
          as="iframe"
          title={t("iframe-title")}
          src={PRIVACY_POLICY_URL}
          width="100%"
          height="100%"
          border="0"
        />
      </Box>
    </MiniAppInfoPageLayout>
  );
};
