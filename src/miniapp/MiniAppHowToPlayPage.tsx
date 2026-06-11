import { AspectRatio, Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MiniAppInfoPageLayout } from "./MiniAppInfoPageLayout";

const HOW_TO_PLAY_STEPS = ["01", "02", "03", "04"] as const;

const HOW_TO_PLAY_VIDEO_URL =
  "https://www.youtube.com/embed/yCac6cfDm3k?si=bZgjO0tsqdDRze42";

export const MiniAppHowToPlayPage = () => {
  const { t } = useTranslation("miniapp", {
    keyPrefix: "profile-pages.how-to-play",
  });

  return (
    <MiniAppInfoPageLayout title={t("title")}>
      <Flex direction="column" gap={4}>
        <AspectRatio
          ratio={16 / 9}
          borderRadius="2xl"
          overflow="hidden"
          border="1px solid rgba(255, 255, 255, 0.12)"
          bg="black"
        >
          <Box
            as="iframe"
            title={t("video-title")}
            src={HOW_TO_PLAY_VIDEO_URL}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </AspectRatio>

        <Flex direction="column" gap={3}>
          {HOW_TO_PLAY_STEPS.map((step) => (
            <Box
              key={step}
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
                {step}
              </Text>
              <Heading size="sm" mb={2}>
                {t(`steps.${step}.title`)}
              </Heading>
              <Text color="whiteAlpha.900" lineHeight="tall">
                {t(`steps.${step}.description`)}
              </Text>
            </Box>
          ))}
        </Flex>
      </Flex>
    </MiniAppInfoPageLayout>
  );
};
