import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { MiniAppTermsDocument } from "./MiniAppTermsDocument";

export const MiniAppTermsPage = () => {
  const { t } = useTranslation("miniapp", { keyPrefix: "terms-gate" });
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex
      width="100%"
      height="100%"
      minH={0}
      position="relative"
      flexDirection="column"
      overflow="hidden"
      bg="black"
    >
      <LanguageSwitcher />

      <Flex
        width="100%"
        flex={1}
        minH={0}
        flexDirection="column"
        px={{ base: 4, md: 8 }}
        pt={{ base: 16, md: 20 }}
        zIndex={10}
      >
        <Heading
          variant="italic"
          size={isSmallScreen ? "sm" : "md"}
          textAlign="center"
          mb={6}
          zIndex={10}
        >
          {t("title")}
        </Heading>

        <Box
          flex={1}
          minH={0}
          overflowY="auto"
          pr={{ base: 1, md: 3 }}
          pb={6}
          zIndex={10}
          sx={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.35) transparent",
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.35)",
              borderRadius: "999px",
            },
          }}
        >
          <MiniAppTermsDocument />
        </Box>
      </Flex>
    </Flex>
  );
};
