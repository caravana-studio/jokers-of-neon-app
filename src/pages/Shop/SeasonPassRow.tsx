import {
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { useAccount, useConnect } from "@starknet-react/core";
import { useTranslation } from "react-i18next";
import CachedImage from "../../components/CachedImage";
import { SeasonPass } from "../../components/SeasonPass/SeasonPass";
import { useCryptoPurchase } from "../../marketplace/hooks/useCryptoPurchase";
import { useShopPrice } from "../../marketplace/hooks/useShopPrice";
import { useUSDCBalance } from "../../marketplace/hooks/useUSDCBalance";
import { useSeasonNumber } from "../../constants/season";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { BLUE, VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { isNative } from "../../utils/capacitorUtils";
import { PaymentMethodModal } from "./PaymentMethodModal";

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

  const { purchaseSeasonPass } = useSeasonPass();
  const { connectors, connect } = useConnect();
  const { address: starknetAddress } = useAccount();
  const { buy: buyWithCrypto, status: cryptoStatus } = useCryptoPurchase();
  const { priceAtoms, priceUsdc } = useShopPrice(id);
  const { balanceRaw } = useUSDCBalance();
  const paymentMethodModal = useDisclosure();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isCryptoPurchasing = ["transferring", "confirming", "submitting"].includes(
    cryptoStatus,
  );
  const hasFiatOption = Boolean(price);
  const hasCryptoOption = !isNative && priceAtoms !== undefined && priceAtoms > 0n;
  const hasEnoughUsdc =
    balanceRaw !== undefined && priceAtoms !== undefined
      ? balanceRaw >= priceAtoms
      : true;
  const isInsufficientUsdc = hasCryptoOption && !hasEnoughUsdc;
  const isButtonDisabled =
    unlocked ||
    isLoading ||
    isCryptoPurchasing ||
    (!hasFiatOption && !hasCryptoOption);

  const handleFiatPurchase = async () => {
    if (isLoading || isCryptoPurchasing || unlocked) return;
    if (!price) return;

    try {
      setIsLoading(true);
      await purchaseSeasonPass();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCryptoPurchase = async () => {
    if (isLoading || isCryptoPurchasing || unlocked) return;
    if (!priceAtoms) return;

    if (isInsufficientUsdc) {
      toast({
        status: "error",
        title: t("purchase-error-title", {
          defaultValue: "Purchase failed",
        }),
        description: t("insufficient-usdc", {
          defaultValue: "Insufficient USDC balance.",
        }),
      });
      return;
    }

    try {
      await buyWithCrypto(id, priceAtoms, id);
      toast({
        status: "success",
        title: t("crypto-success-title", {
          defaultValue: "Season pass purchased",
        }),
        description: t("crypto-success-description", {
          defaultValue:
            "Your season pass purchase is processing and can take a few minutes to appear in-game.",
        }),
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "userCancelled" in error
      ) {
        return;
      }

      toast({
        status: "error",
        title: t("purchase-error-title", {
          defaultValue: "Purchase failed",
        }),
        description: t("purchase-error-description", {
          defaultValue:
            "We couldn't complete your purchase. Please try again.",
        }),
      });
    }
  };

  const handleButtonClick = () => {
    if (isButtonDisabled) return;

    if (!starknetAddress) {
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
      return;
    }

    if (isNative) {
      void handleFiatPurchase();
      return;
    }

    if (hasFiatOption && hasCryptoOption) {
      paymentMethodModal.onOpen();
      return;
    }

    if (hasFiatOption) {
      void handleFiatPurchase();
      return;
    }

    if (hasCryptoOption) {
      void handleCryptoPurchase();
    }
  };

  const buttonLabel = hasFiatOption
    ? `${t("buy")} · ${price}`
    : hasCryptoOption && priceUsdc
      ? `${t("buy")} · ${priceUsdc} USDC`
      : t("buy");

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
          onClick={handleButtonClick}
        >
          {isLoading || isCryptoPurchasing ? (
            <Spinner size="xs" />
          ) : unlocked ? (
            t("unlocked")
          ) : (
            buttonLabel
          )}
        </Button>
      </Flex>
      <PaymentMethodModal
        isOpen={paymentMethodModal.isOpen}
        onClose={paymentMethodModal.onClose}
        onFiatSelect={() => {
          void handleFiatPurchase();
        }}
        onCryptoSelect={() => {
          void handleCryptoPurchase();
        }}
        fiatLabel={
          hasFiatOption
            ? `${t("pay-with-card", { defaultValue: "Pay with card" })} · ${price}`
            : t("pay-with-card", { defaultValue: "Pay with card" })
        }
        cryptoLabel={
          hasCryptoOption && priceUsdc
            ? `${t("pay-with-crypto", { defaultValue: "Pay with crypto" })} · ${priceUsdc} USDC`
            : t("pay-with-crypto", { defaultValue: "Pay with crypto" })
        }
        title={t("payment-method-title", {
          defaultValue: "Choose payment method",
        })}
        description={t("payment-method-description", {
          defaultValue:
            "You can complete your purchase with card or crypto.",
        })}
        fiatDisabled={!hasFiatOption || isLoading || isCryptoPurchasing}
        cryptoDisabled={
          !hasCryptoOption || isInsufficientUsdc || isLoading || isCryptoPurchasing
        }
        cryptoDisabledReason={
          isInsufficientUsdc
            ? t("insufficient-usdc", {
                defaultValue: "Insufficient USDC balance.",
              })
            : undefined
        }
      />
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
