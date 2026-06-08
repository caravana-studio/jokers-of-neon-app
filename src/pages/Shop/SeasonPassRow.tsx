import {
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { SeasonPass } from "../../components/SeasonPass/SeasonPass";
import {
  coinPulse,
  coinPulseBack,
  seasonPassPulse,
} from "../../components/SeasonPass/seasonPassAnimations";
import { useSeasonPassPurchase } from "../../components/SeasonPass/useSeasonPassPurchase";
import { useSeasonNumber } from "../../constants/season";
import { BLUE, VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { PaymentMethodModal } from "./PaymentMethodModal";

interface SeasonPassRowProps {
  price?: string;
  id: string;
  unlocked: boolean;
  fullBleed?: boolean;
}

export const SeasonPassRow = ({
  id,
  price,
  unlocked,
  fullBleed = false,
}: SeasonPassRowProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.season-pass",
  });
  const { isSmallScreen } = useResponsiveValues();
  const seasonNumber = useSeasonNumber();
  const isSeason2 = seasonNumber === 2;
  const {
    defaultButtonLabel,
    handlePurchaseClick,
    isButtonDisabled,
    isCryptoPurchasing,
    isLoading,
    isResolvingUsername,
    paymentMethodModalProps,
  } = useSeasonPassPurchase({
    id,
    price,
    unlocked,
  });

  return (
    <>
      <Flex
        borderBottom={`1px solid ${BLUE}`}
        borderTop={`1px solid ${BLUE}`}
        py={isSmallScreen ? "50px" : "120px"}
        flexDir={"column"}
        px={fullBleed ? 0 : 4}
        alignItems={"center"}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/shop/season-pass/bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: isSeason2 ? "grayscale(1)" : "none",
          zIndex: 0,
        }}
        sx={{
          "> *": {
            position: "relative",
            zIndex: 1,
          },
        }}
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
            {t("season-pass-x", { season: seasonNumber })}
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
            <SeasonPass rotate="-25deg" w={isSmallScreen ? "110px" : "230px"} unlocked />
          </Flex>
          <Flex w="50%" flexDir={"column"} gap={isSmallScreen ? 4 : 6}>
            <Fact number={1} seasonNumber={seasonNumber} />
            <Fact number={2} seasonNumber={seasonNumber} />
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
          isDisabled={isButtonDisabled}
          onClick={handlePurchaseClick}
        >
          {isLoading || isCryptoPurchasing || isResolvingUsername ? (
            <Spinner size="xs" />
          ) : unlocked ? (
            t("unlocked")
          ) : (
            defaultButtonLabel
          )}
        </Button>
      </Flex>
      <PaymentMethodModal {...paymentMethodModalProps} />
    </>
  );
};

const Fact = ({
  number,
  seasonNumber,
}: {
  number: number;
  seasonNumber: number;
}) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.season-pass.facts",
  });
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex flexDir="column" gap={isSmallScreen ? 0.5 : 1.5}>
      <Text fontSize={isSmallScreen ? 15 : 26}>{t(`${number}-title`)}</Text>
      <Text fontSize={isSmallScreen ? 10 : 17} lineHeight={1}>
        {t(`${number}-description-1`, { season: seasonNumber })}
      </Text>
      <Text fontSize={isSmallScreen ? 10 : 17} lineHeight={1}>
        {t(`${number}-description-2`, { season: seasonNumber })}
      </Text>
    </Flex>
  );
};
