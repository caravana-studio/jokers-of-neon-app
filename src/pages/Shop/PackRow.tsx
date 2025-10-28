import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { SeasonPass } from "../../components/SeasonPass/SeasonPass";
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
    transform: scale(1) translateY(0) ;
  }
  50% {
    transform: scale(1) translateY(5px);
  }
  100% {
    transform: scale(1) translateY(0) ;
  }
`;

interface PackRowProps {
  packId: number;
}

export const PackRow = ({ packId }: PackRowProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.pack",
  });
  const { isSmallScreen } = useResponsiveValues();
  return (
    <>
      <Flex
        borderBottom={`1px solid ${BLUE}`}
        borderTop={`1px solid ${BLUE}`}
        py="50px"
        flexDir={"column"}
        px={4}
        alignItems={"center"}
        background={`url(/packs/bg/${packId}.jpg)`}
        backgroundSize={"cover"}
        backgroundPosition={"center"}
      >
        <Flex w="100%" justifyContent="center" alignItems="center" my={4}>
          <Flex w="60%" flexDir={"column"} gap={4}>
            <Fact number={1} />
            <Fact number={2} />
            <Fact number={3} />
        <Button
          variant={"secondarySolid"}
          w="50%"
          fontFamily="Oxanium"
          fontSize={13}
          mt={2}
          h={isSmallScreen ? "30px" : "40px"}
        >
          {t("buy")} · $9.99
        </Button>
          </Flex>
          <Flex
            w="40%"
            justifyContent="flex-end"
            animation={`${seasonPassPulse} 4s ease-in-out infinite`}
            transformOrigin="center"
            alignItems="center"
            pr={6}
          >
            <CachedImage src={`/packs/${packId}.png`} boxShadow={"0 0 15px 0px white, inset 0 0 5px 0 white"} />
          </Flex>
        </Flex>
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
    <Flex flexDir="column" gap={0.5}>
      <Text fontSize={isSmallScreen ? 15 : 20}>{t(`${number}-title`)}</Text>
      <Text fontSize={isSmallScreen ? 10 : 12} lineHeight={1}>
        {t(`${number}-description-1`)}
      </Text>
      <Text fontSize={isSmallScreen ? 10 : 12} lineHeight={1}>
        {t(`${number}-description-2`)}
      </Text>
    </Flex>
  );
};
