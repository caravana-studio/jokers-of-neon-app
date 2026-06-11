import { AspectRatio, Box, Flex, Heading, Text } from "@chakra-ui/react";
import { MiniAppInfoPageLayout } from "./MiniAppInfoPageLayout";

const HOW_TO_PLAY_STEPS = [
  {
    number: "01",
    title: "Start with a basic deck",
    description:
      "Every run begins with a standard poker deck and a fresh opportunity to build something powerful.",
  },
  {
    number: "02",
    title: "Play hands and beat rounds",
    description:
      "Score points by creating poker hands and reaching the target score before running out of plays.",
  },
  {
    number: "03",
    title: "Visit shops and improve your build",
    description:
      "Between rounds, buy Special Cards and items that strengthen your deck and open new strategic paths.",
  },
  {
    number: "04",
    title: "Build synergies and push deeper",
    description:
      "The heart of the game is combining effects and scaling your score run after run, while adapting your build to tougher boss rounds called rage rounds.",
  },
] as const;

const HOW_TO_PLAY_VIDEO_URL =
  "https://www.youtube.com/embed/yCac6cfDm3k?si=bZgjO0tsqdDRze42";

export const MiniAppHowToPlayPage = () => {
  return (
    <MiniAppInfoPageLayout title="How to play">
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
            title="How to play Jokers of Neon"
            src={HOW_TO_PLAY_VIDEO_URL}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </AspectRatio>

        <Flex direction="column" gap={3}>
          {HOW_TO_PLAY_STEPS.map((step) => (
            <Box
              key={step.number}
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
                {step.number}
              </Text>
              <Heading size="sm" mb={2}>
                {step.title}
              </Heading>
              <Text color="whiteAlpha.900" lineHeight="tall">
                {step.description}
              </Text>
            </Box>
          ))}
        </Flex>
      </Flex>
    </MiniAppInfoPageLayout>
  );
};
