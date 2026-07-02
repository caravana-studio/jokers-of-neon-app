import { Box, Flex, Image, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { Trans, useTranslation } from "react-i18next";
import { MiniAppInfoPageLayout } from "./MiniAppInfoPageLayout";

const ABOUT_US_CARDS = ["studio", "mission"] as const;

export const MiniAppAboutUsPage = () => {
  const { t } = useTranslation("miniapp", {
    keyPrefix: "profile-pages.about-us",
  });

  return (
    <MiniAppInfoPageLayout title={t("title")}>
      <Flex direction="column" gap={4}>
        <Box
          bg="rgba(0, 0, 0, 0.45)"
          border="1px solid rgba(255, 255, 255, 0.12)"
          borderRadius="2xl"
          p={{ base: 5, md: 7 }}
          textAlign="center"
        >
          <Image
            src="/logos/caravana-logo.png"
            alt={t("logo-alt")}
            maxW={{ base: "200px", md: "260px" }}
            mx="auto"
            mb={5}
          />
          <Text fontSize={{ base: "md", md: "lg" }} lineHeight="tall">
            {t("intro")}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
          {ABOUT_US_CARDS.map((card) => (
            <Box
              key={card}
              bg="rgba(0, 0, 0, 0.45)"
              border="1px solid rgba(255, 255, 255, 0.12)"
              borderRadius="2xl"
              p={{ base: 4, md: 5 }}
            >
              <Text
                fontSize="sm"
                letterSpacing="0.12em"
                textTransform="uppercase"
                color="purple.200"
                mb={2}
              >
                {t(`cards.${card}.eyebrow`)}
              </Text>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {t(`cards.${card}.title`)}
              </Text>
              <Text
                color="whiteAlpha.900"
                lineHeight="tall"
                fontSize={{ base: "md", md: "lg" }}
              >
                {t(`cards.${card}.description`)}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <Box
          bg="rgba(0, 0, 0, 0.45)"
          border="1px solid rgba(255, 255, 255, 0.12)"
          borderRadius="2xl"
          p={{ base: 5, md: 7 }}
        >
          <Text fontSize={{ base: "md", md: "lg" }} lineHeight="tall">
            <Trans
              i18nKey="miniapp:profile-pages.about-us.learn-more"
              components={{
                website: (
                  <Link
                    href="https://caravana.studio/"
                    color="purple.200"
                    isExternal
                  />
                ),
              }}
            />
          </Text>
          <Text fontSize={{ base: "md", md: "lg" }} lineHeight="tall" mt={4}>
            <Trans
              i18nKey="miniapp:profile-pages.about-us.contact"
              components={{
                email: (
                  <Link
                    href="mailto:gm@caravana.studio"
                    color="purple.200"
                  />
                ),
              }}
            />
          </Text>
        </Box>
      </Flex>
    </MiniAppInfoPageLayout>
  );
};
