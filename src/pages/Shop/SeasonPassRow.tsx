import { Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { SeasonPass } from "../../components/SeasonPass/SeasonPass";
import { SEASON_NUMBER } from "../../constants/season";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { BLUE, VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";

const coinPulse = keyframes`
  0% {
    transform: scale(1.5) rotate(0deg);
  }
  50% {
    transform: scale(1.6) rotate(3deg);
  }
  100% {
    transform: scale(1.5) rotate(0deg);
  }
`;
const coinPulseBack = keyframes`
  0% {
    transform: scale(1.3) rotate(0deg);
  }
  50% {
    transform: scale(1.4) rotate(-3deg);
  }
  100% {
    transform: scale(1.3) rotate(0deg);
  }
`;

const seasonPassPulse = keyframes`
  0% {
    transform: scale(1) translateY(0)  rotate(0deg);
  }
  50% {
    transform: scale(1.05) translateY(-5px)  rotate(-2deg);
  }
  100% {
    transform: scale(1) translateY(0)  rotate(0deg);
  }
`;

interface SeasonPassRowProps {
  price?: string;
  id: string;
  unlocked: boolean;
}

export const SeasonPassRow = ({ id, price, unlocked }: SeasonPassRowProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.season-pass",
  });
  const { isSmallScreen } = useResponsiveValues();

  const { purchaseSeasonPass } = useSeasonPass();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Flex
        borderBottom={`1px solid ${BLUE}`}
        borderTop={`1px solid ${BLUE}`}
        py={isSmallScreen ? "50px" : "120px"}
        flexDir={"column"}
        px={4}
        alignItems={"center"}
        background="url(/shop/season-pass/bg.jpg)"
        backgroundSize={"cover"}
        backgroundPosition={"center"}
      >
        <Flex position="relative" w={isSmallScreen ? "100%" : "600px"}>
          <CachedImage
            src="/shop/season-pass/coins-front.png"
            position="absolute"
            animation={`${coinPulse} 4s ease-in-out infinite`}
            transformOrigin="center"
            zIndex={2}
          />
          <CachedImage
            src="/shop/season-pass/coins-back.png"
            zIndex={0}
            opacity={0.6}
            position="absolute"
            animation={`${coinPulseBack} 4s ease-in-out infinite`}
            transformOrigin="center"
          />
        </Flex>
        <Flex
          flexDir="column"
          w="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Text
            textTransform={"uppercase"}
            fontSize={isSmallScreen ? "sm" : "md"}
            lineHeight={1.1}
            textAlign={"center"}
          >
            {t("more-jokers-with")}
          </Text>
          <Heading
            color="lightViolet"
            fontSize={isSmallScreen ? 22 : 40}
            lineHeight={1}
            textShadow={`0 0 7px ${VIOLET_LIGHT}`}
          >
            {t("season-pass-x", { season: SEASON_NUMBER })}
          </Heading>
        </Flex>
        <Flex
          w="100%"
          justifyContent="center"
          alignItems="center"
          my={isSmallScreen ? 4 : 10}
        >
          <Flex
            w="50%"
            justifyContent="flex-end"
            animation={`${seasonPassPulse} 4s ease-in-out infinite`}
            transformOrigin="center"
            alignItems="center"
            pr={isSmallScreen ? 6 : 20}
          >
            <SeasonPass rotate="-25deg" w={isSmallScreen ? "110px" : "230px"} />
          </Flex>
          <Flex w="50%" flexDir={"column"} gap={isSmallScreen ? 4 : 6}>
            <Fact number={1} />
            <Fact number={2} />
            {/* <Fact number={3} /> */}
          </Flex>
        </Flex>
        <Button
          variant={"secondarySolid"}
          w="50%"
          maxW="400px"
          fontFamily="Oxanium"
          fontSize={isSmallScreen ? 13 : 18}
          mt={isSmallScreen ? 2 : 6}
          h={isSmallScreen ? "30px" : "50px"}
          isDisabled={isLoading || !price || unlocked}
          onClick={() => {
            setIsLoading(true);
            purchaseSeasonPass()
              .then(() => setIsLoading(false))
              .catch(() => setIsLoading(false));
          }}
        >
          {isLoading || !price ? (
            <Spinner size="xs" />
          ) : unlocked ? (
            t("unlocked")
          ) : (
            <>
              {t("buy")} · {price}
            </>
          )}
        </Button>
      </Flex>
    </>
  );
};

const Fact = ({ number }: { number: number }) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.season-pass.facts",
  });
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex flexDir="column" gap={isSmallScreen ? 0.5 : 1.5}>
      <Text fontSize={isSmallScreen ? 15 : 26}>{t(`${number}-title`)}</Text>
      <Text fontSize={isSmallScreen ? 10 : 17} lineHeight={1}>
        {t(`${number}-description-1`)}
      </Text>
      <Text fontSize={isSmallScreen ? 10 : 17} lineHeight={1}>
        {t(`${number}-description-2`)}
      </Text>
    </Flex>
  );
};
