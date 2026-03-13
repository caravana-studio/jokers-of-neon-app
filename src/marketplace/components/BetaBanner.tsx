import { Box, Flex, Text, IconButton, Link } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "marketplace_beta_banner_dismissed";

export function BetaBanner() {
  const { t } = useTranslation("marketplace");
  const [visible, setVisible] = useState(
    () => localStorage.getItem(STORAGE_KEY) !== "true"
  );

  if (!visible) return null;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={100}
      bg="rgba(10, 20, 45, 0.92)"
      backdropFilter="blur(8px)"
      borderTop="1px solid rgba(255, 147, 75, 0.4)"
      boxShadow="0 -4px 24px rgba(255, 147, 75, 0.15)"
    >
      <Flex
        maxW="1400px"
        mx="auto"
        px={{ base: 4, sm: 8 }}
        py={3}
        alignItems="center"
        gap={4}
      >
        {/* Warning icon */}
        <Text fontSize={18} flexShrink={0}>⚠️</Text>

        {/* Text */}
        <Text
          fontFamily="Oxanium"
          fontSize={{ base: 11, sm: 13 }}
          color="whiteAlpha.800"
          flex={1}
        >
          <Text as="span" color="#ff934b" fontWeight="bold">
            {t("beta.warning")}{" "}
          </Text>
          {t("beta.description")}{" "}
          <Link
            href="https://jokersofneon.com/terms-and-conditions"
            isExternal
            color="#20c6ed"
            textDecoration="underline"
            _hover={{ color: "white" }}
          >
            {t("beta.terms")}
          </Link>
          .
        </Text>

        {/* Close */}
        <IconButton
          aria-label={t("beta.dismiss")}
          icon={<Text fontSize={14} lineHeight={1}>✕</Text>}
          size="xs"
          variant="ghost"
          color="whiteAlpha.600"
          _hover={{ color: "white", bg: "whiteAlpha.100" }}
          flexShrink={0}
          onClick={handleDismiss}
        />
      </Flex>
    </Box>
  );
}
