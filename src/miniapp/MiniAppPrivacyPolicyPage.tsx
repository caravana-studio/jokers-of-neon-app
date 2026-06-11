import { Box } from "@chakra-ui/react";
import { MiniAppInfoPageLayout } from "./MiniAppInfoPageLayout";

const PRIVACY_POLICY_URL = "https://jokersofneon.com/privacy-policy";

export const MiniAppPrivacyPolicyPage = () => {
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
          title="Jokers of Neon privacy policy"
          src={PRIVACY_POLICY_URL}
          width="100%"
          height="100%"
          border="0"
        />
      </Box>
    </MiniAppInfoPageLayout>
  );
};
