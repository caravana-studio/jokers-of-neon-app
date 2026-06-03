import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { BackgroundType } from "../../components/Background";
import BackgroundVideo from "../../components/BackgroundVideo";
import CachedImage from "../../components/CachedImage";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { SeasonPass } from "../../components/SeasonPass/SeasonPass";
import {
  coinPulse,
  coinPulseBack,
  seasonPassPulse,
} from "../../components/SeasonPass/seasonPassAnimations";
import { useSeasonPassPurchase } from "../../components/SeasonPass/useSeasonPassPurchase";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { useShopDistribution } from "../../queries/useShopDistribution";
import { useGameStore } from "../../state/useGameStore";
import { VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { isNativeAndroid } from "../../utils/capacitorUtils";
import { PaymentMethodModal } from "../Shop/PaymentMethodModal";

export const SeasonPassOfferPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSmallScreen } = useResponsiveValues();
  const pageRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.season-pass",
  });
  const isClassic = useGameStore((store) => store.isClassic);
  const { distribution, loading: distributionLoading } = useShopDistribution();
  const { offerings, loading: revenueCatLoading } = useRevenueCat();
  const { seasonPassUnlocked, loading: seasonPassLoading } = useSeasonPass();

  const seasonPassId = distribution?.season_pass ?? "season_pass";
  const seasonPassPrice = offerings?.seasonPass?.formattedPrice;
  const isScreenLoading =
    distributionLoading || revenueCatLoading || seasonPassLoading;

  const {
    defaultButtonLabel,
    handlePurchaseClick,
    isButtonDisabled,
    isCryptoPurchasing,
    isLoading,
    isResolvingUsername,
    paymentMethodModalProps,
    preferredPriceLabel,
  } = useSeasonPassPurchase({
    id: seasonPassId,
    price: seasonPassPrice,
    unlocked: seasonPassUnlocked,
  });

  const benefits = useMemo(
    () => [
      {
        title: t("offer.benefits.1.title"),
        description: t("offer.benefits.1.description"),
      },
      {
        title: t("offer.benefits.2.title"),
        description: t("offer.benefits.2.description"),
      },
      {
        title: t("offer.benefits.3.title"),
        description: t("offer.benefits.3.description"),
      },
    ],
    [t],
  );

  const buyLabel = preferredPriceLabel ? defaultButtonLabel : t("buy");
  const returnTo =
    (location.state as { returnTo?: string } | null)?.returnTo ??
    (location.pathname.startsWith("/test/") ? "/test" : "/");

  useEffect(() => {
    const resetScrollPosition = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      let current = pageRef.current?.parentElement ?? null;
      while (current) {
        if (current.scrollHeight > current.clientHeight) {
          current.scrollTop = 0;
        }
        current = current.parentElement;
      }
    };

    resetScrollPosition();
    const frameId = window.requestAnimationFrame(resetScrollPosition);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <Flex
      ref={pageRef}
      position="relative"
      w="100%"
      h="100dvh"
      minH="100dvh"
      overflow="hidden"
      color="white"
      sx={{
        "> *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <Box
        position="absolute"
        inset={0}
        backgroundImage="url(/bg/store-bg.jpg)"
        backgroundSize="cover"
        backgroundPosition="center"
        zIndex={0}
      />
      {isClassic && !isNativeAndroid && (
        <BackgroundVideo
          type={BackgroundType.Store}
          useTournamentTheme={false}
        />
      )}
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.78) 100%)"
        zIndex={0}
      />
      <MobileDecoration bottom={isSmallScreen ? "50px" : 1} />
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        w="100%"
        h="100%"
        minH="100%"
        px={isSmallScreen ? 4 : 8}
        pt={isSmallScreen ? "70px" : "64px"}
        pb={isSmallScreen ? "188px" : "150px"}
      >
        <Flex
          position="relative"
          alignItems="center"
          justifyContent="center"
          w="100%"
          maxW="560px"
          minH={isSmallScreen ? "220px" : "260px"}
          mb={isSmallScreen ? 4 : 5}
          zIndex={2}
        >
          <Flex
            position="absolute"
            insetX={0}
            justifyContent="center"
            top={isSmallScreen ? "220px" : "82px"}
          >
            <CachedImage
              src="/shop/season-pass/coins-back.png"
              w={isSmallScreen ? "350px" : "560px"}
              opacity={isSmallScreen ? 0.42 : 0.68}
              animation={`${coinPulseBack} 4s ease-in-out infinite`}
              transformOrigin="center"
            />
          </Flex>
          <Flex
            animation={`${seasonPassPulse} 4s ease-in-out infinite`}
            transformOrigin="center"
            zIndex={2}
          >
            <SeasonPass
              rotate="-10deg"
              w={isSmallScreen ? "180px" : "300px"}
              unlocked
            />
          </Flex>
          <Flex
            position="absolute"
            insetX={0}
            justifyContent="center"
            top={isSmallScreen ? "150px" : "54px"}
          >
            <CachedImage
              src="/shop/season-pass/coins-front.png"
              w={isSmallScreen ? "340px" : "640px"}
              opacity={isSmallScreen ? 0.86 : 1}
              animation={`${coinPulse} 4s ease-in-out infinite`}
              transformOrigin="center"
              zIndex={3}
            />
          </Flex>
        </Flex>

        <Text
          position="relative"
          zIndex={4}
          textTransform="uppercase"
          textAlign="center"
          fontSize={isSmallScreen ? "11px" : "md"}
          letterSpacing="0.24em"
          lineHeight={1.1}
          mb={1}
        >
          {t("offer.title-prefix")}
        </Text>
        <Heading
          position="relative"
          zIndex={4}
          textAlign="center"
          color="lightViolet"
          fontSize={isSmallScreen ? "31px" : "56px"}
          lineHeight={0.95}
          textShadow={`0 0 12px ${VIOLET_LIGHT}`}
        >
          {t("season-pass")}
        </Heading>

        <Flex
          position="relative"
          zIndex={4}
          w="100%"
          maxW={isSmallScreen ? "290px" : "440px"}
          mt={isSmallScreen ? 5 : 8}
          flexDir="column"
          gap={isSmallScreen ? 4 : 5}
        >
          {benefits.map((benefit) => (
            <Flex key={benefit.title} gap={3} alignItems="flex-start">
              <Text
                color="lightViolet"
                fontSize={isSmallScreen ? "22px" : "28px"}
                lineHeight={1}
                pt={0.5}
                textShadow="0 0 4px black"
              >
                •
              </Text>
              <Flex flexDir="column" gap={1}>
                <Text
                  fontSize={isSmallScreen ? "15px" : "22px"}
                  fontWeight={700}
                  lineHeight={1.05}
                  textTransform="uppercase"
                  textShadow="0 0 4px black"
                >
                  {benefit.title}
                </Text>
                <Text
                  fontSize={isSmallScreen ? "12px" : "17px"}
                  lineHeight={1.2}
                  color="whiteAlpha.900"
                  textShadow="0 0 4px black"
                >
                  {benefit.description}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>

      <Flex
        position="fixed"
        left={0}
        right={0}
        bottom={isSmallScreen ? "50px" : 0}
        zIndex={10}
        justifyContent="center"
        pointerEvents="none"
      >
        <Flex
          w="100%"
          flexDir="column"
          alignItems="center"
          pointerEvents="auto"
          background="transparent"
          pt={4}
        >
          <MobileBottomBar
            firstButton={{
              label: t("offer.skip"),
              onClick: () => navigate(returnTo, { replace: true }),
              variant: "ghost",
              color: "whiteAlpha.700",
              _hover: {
                color: "whiteAlpha.900",
              },
            }}
            secondButton={{
              label:
                isScreenLoading ||
                isLoading ||
                isCryptoPurchasing ||
                isResolvingUsername ? (
                  <Spinner size="xs" />
                ) : seasonPassUnlocked ? (
                  t("unlocked")
                ) : (
                  buyLabel
                ),
              onClick: handlePurchaseClick,
              disabled: isButtonDisabled,
            }}
          />
        </Flex>
      </Flex>

      <PaymentMethodModal {...paymentMethodModalProps} />
    </Flex>
  );
};
