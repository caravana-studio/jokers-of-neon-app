import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage";
import { LootBoxRateInfo } from "../../components/Info/LootBoxRateInfo";
import { BLUE } from "../../theme/colors";
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

const PACK_SIZES = [3, 3, 4, 4, 4, 6];

export const PackRow = ({ packId }: PackRowProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.packs",
  });
  const isLimitedEdition = packId > 3;
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
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
          <Flex
            w="60%"
            flexDir={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            px={2}
          >
            <Heading
              fontSize={isSmallScreen ? 18 : 20}
              variant="italic"
              textShadow={"0 0 5px white"}
            >
              {t(`${packId}.name`)}
            </Heading>
            <Heading
              fontSize={isSmallScreen ? 11 : 14}
              lineHeight={1}
              color={isLimitedEdition ? "gold" : "lightViolet"}
              textShadow={"0 0 5px black"}
              mb={4}
            >
              {t(isLimitedEdition ? "limited-edition" : `player-pack`)}
            </Heading>
            <Flex flexDir="column" gap={1.5} mb={3}>
              <Text fontSize={isSmallScreen ? 12 : 15} lineHeight={1}>
                {t(`${packId}.description.1`)}
              </Text>
              <Text fontSize={isSmallScreen ? 12 : 15} lineHeight={1}>
                {t(`${packId}.description.2`)}
              </Text>
              <Text fontSize={isSmallScreen ? 12 : 15} lineHeight={1}>
                {t(`size`)}: {PACK_SIZES[packId]}
              </Text>
            </Flex>
            <Flex flexDir="column" gap={1} mb={2}>
              <Text
                fontSize={isSmallScreen ? 8 : 12}
                lineHeight={1}
                color="blueLight"
                textAlign={"center"}
              >
                {t(`transferrable-legend`)}
              </Text>
              {!isLimitedEdition && (
                <Text
                  fontSize={isSmallScreen ? 8 : 12}
                  color="blueLight"
                  textAlign={"center"}
                  lineHeight={1}
                >
                  {t("skins-legend")}
                </Text>
              )}
            </Flex>
            <LootBoxRateInfo name={"test"} details={"details"} />
            <Button
              variant={"secondarySolid"}
              w="70%"
              fontFamily="Oxanium"
              fontSize={13}
              mt={4}
              h={isSmallScreen ? "30px" : "40px"}
              onClick={() => {
                navigate(`/external-pack/${packId}`)
              }}
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
            <CachedImage
            w="90%"
              src={`/packs/${packId}.png`}
              boxShadow={"0 0 15px 0px white, inset 0 0 5px 0 white"}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
