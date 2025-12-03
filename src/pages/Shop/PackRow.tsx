import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage";
import { LootBoxRateInfo } from "../../components/Info/LootBoxRateInfo";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { packAnimation } from "../../constants/animations";

interface PackRowProps {
  packId: number;
}

const PACK_SIZES = [0, 3, 3, 4, 4, 5, 10];

export const PackRow = ({ packId }: PackRowProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.packs",
  });
  const isLimitedEdition = packId > 4;
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
              fontSize={isSmallScreen ? 18 : 35}
              variant="italic"
              textShadow={"0 0 5px white"}
            >
              {t(`${packId}.name`)}
            </Heading>
            <Heading
              fontSize={isSmallScreen ? 11 : 18}
              lineHeight={1}
              color={isLimitedEdition ? "gold" : "lightViolet"}
              textShadow={"0 0 5px black"}
              mb={isSmallScreen ? 4 : 8}
            >
              {t(isLimitedEdition ? "limited-edition" : `player-pack`)}
            </Heading>
            <Flex
              flexDir="column"
              gap={isSmallScreen ? 1.5 : 3}
              mb={isSmallScreen ? 3 : 6}
            >
              <Text fontSize={isSmallScreen ? 12 : 18} lineHeight={1}>
                {t(`${packId}.description.1`)}
              </Text>
              <Text fontSize={isSmallScreen ? 12 : 18} lineHeight={1}>
                {t(`${packId}.description.2`)}
              </Text>
              <Text fontSize={isSmallScreen ? 12 : 18} lineHeight={1}>
                {t(`size`)}: {PACK_SIZES[packId]}
              </Text>
            </Flex>
            <Flex
              flexDir="column"
              gap={isSmallScreen ? 1 : 2}
              mb={isSmallScreen ? 2 : 4}
            >
              <Text
                fontSize={isSmallScreen ? 8 : 15}
                lineHeight={1}
                color="blueLight"
                textAlign={"center"}
              >
                {t(`transferrable-legend`)}
              </Text>
              {!isLimitedEdition && (
                <Text
                  fontSize={isSmallScreen ? 8 : 15}
                  color="blueLight"
                  textAlign={"center"}
                  lineHeight={1}
                >
                  {t("skins-legend")}
                </Text>
              )}
            </Flex>
            <LootBoxRateInfo name={t(`${packId}.name`)} details={t(`${packId}.description.1`)} packId={packId} />
            <Button
              variant={"secondarySolid"}
              w={isSmallScreen ? "70%" : "300px"}
              fontFamily="Oxanium"
              fontSize={isSmallScreen ? 13 : 16}
              mt={isSmallScreen ? 4 : 8}
              h={isSmallScreen ? "30px" : "40px"}
              onClick={() => {
                navigate(`/external-pack/${packId}`);
              }}
            >
              {t("buy")} · $9.99
            </Button>
          </Flex>
          <Flex
            w="40%"
            justifyContent={isSmallScreen ? "center" : "flex-start"}
            animation={`${packAnimation} 4s ease-in-out infinite`}
            transformOrigin="center"
            alignItems="center"
            pr={6}
          >
            <CachedImage
              w={isSmallScreen ? "90%" : "300px"}
              src={`/packs/${packId}.png`}
              boxShadow={"0 0 15px 0px white, inset 0 0 5px 0 white"}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
