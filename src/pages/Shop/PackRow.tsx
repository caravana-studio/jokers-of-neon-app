import {
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUserCards } from "../../api/getUserCards";
import { getUserCards as getMarketplaceUserCards } from "../../marketplace/api/userCards";
import CachedImage from "../../components/CachedImage";
import { NFTPackRateInfo } from "../../components/Info/NFTPackRateInfo";
import {
  buttonGlowAnimation,
  limitedEditionPulse,
  packAnimation,
  shopPackGlowAnimation,
} from "../../constants/animations";
import { DojoContext } from "../../dojo/DojoContext";
import { useUsername } from "../../dojo/utils/useUsername";
import type { UserCard as MarketplaceUserCard } from "../../marketplace/types/marketplace";
import { useCryptoPurchase } from "../../marketplace/hooks/useCryptoPurchase";
import { useShopPrice } from "../../marketplace/hooks/useShopPrice";
import { useUSDCBalance } from "../../marketplace/hooks/useUSDCBalance";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
import { listenForPurchase } from "../../queries/listenForPurchase";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { isNative } from "../../utils/capacitorUtils";
import { getPackSize, getPackTier, isCollectorPackId } from "../../utils/packUtils";
import { useUsernameStore } from "../../state/useUsernameStore";
import { addressKey } from "../../utils/starknetAddress";
import { PaymentMethodModal } from "./PaymentMethodModal";

interface PackRowProps {
  packId: number;
  packageId: string;
  price?: string;
  fullBleed?: boolean;
}

const PACK_INVENTORY_POLL_ATTEMPTS = 6;
const PACK_INVENTORY_POLL_DELAY_MS = 1500;

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const toMintedCards = (cards: MarketplaceUserCard[]) =>
  cards.map((card) => ({
    card_id: card.cardId,
    rarity: card.rarity,
    skin_id: card.skinId,
    marketable: card.marketable,
  }));

export const PackRow = ({
  packId,
  packageId,
  price,
  fullBleed = false,
}: PackRowProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.packs",
  });
  const translationPackId = getPackTier(packId);
  const isLimitedEdition = isCollectorPackId(packId);
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  const toast = useToast();
  const dojoCtx = useContext(DojoContext);
  const { address: connectedAddress } = useAccount();
  const dojoAccount = dojoCtx?.account.account ?? null;
  const dojoAddress = dojoAccount?.address || null;
  const starknetAddress = dojoAddress || connectedAddress || null;
  const accountType = dojoCtx?.accountType ?? null;
  const username = useUsername();
  const usernameStatus = useUsernameStore((store) => store.status);
  const storedUsernameAddress = useUsernameStore((store) => store.address);
  const { connectors, connect } = useConnect();
  const { purchasePackageById, offerings } = useRevenueCat();
  const { buy: buyWithCrypto, status: cryptoStatus } = useCryptoPurchase();
  const { priceAtoms, priceUsdc } = useShopPrice(packId);
  const { balanceRaw } = useUSDCBalance();
  const paymentMethodModal = useDisclosure();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [ownedCardIds, setOwnedCardIds] = useState<string[]>([]);
  const isCryptoPurchasing = ["transferring", "confirming", "submitting"].includes(
    cryptoStatus,
  );
  const hasFiatOption = Boolean(price);
  const hasCryptoOption = !isNative && priceAtoms !== undefined && priceAtoms > 0n;
  const requiresRevenueCatIdentity = Boolean(starknetAddress && hasFiatOption);
  const hasReadyUsername =
    Boolean(starknetAddress) &&
    Boolean(username) &&
    usernameStatus === "ready" &&
    addressKey(storedUsernameAddress) === addressKey(starknetAddress);
  const isRevenueCatIdentityReady =
    !requiresRevenueCatIdentity ||
    (accountType !== "burner" && hasReadyUsername);
  const isResolvingUsername =
    requiresRevenueCatIdentity &&
    accountType !== "burner" &&
    !hasReadyUsername &&
    (usernameStatus === "idle" || usernameStatus === "loading");
  const hasEnoughUsdc =
    balanceRaw !== undefined && priceAtoms !== undefined
      ? balanceRaw >= priceAtoms
      : true;
  const isInsufficientUsdc = hasCryptoOption && !hasEnoughUsdc;
  const isBuyDisabled =
    isPurchasing ||
    isCryptoPurchasing ||
    (!hasFiatOption && !hasCryptoOption) ||
    (requiresRevenueCatIdentity && !isRevenueCatIdentityReady);

  useEffect(() => {
    if (!starknetAddress) {
      setOwnedCardIds([]);
      return;
    }

    let cancelled = false;
    getUserCards(starknetAddress)
      .then((data) => {
        if (cancelled) return;
        setOwnedCardIds(data.ownedCardIds ?? []);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("PackRow: failed to load user collection", error);
        setOwnedCardIds([]);
      });

    return () => {
      cancelled = true;
    };
  }, [starknetAddress]);

  const resolveMintedCardsFromInventoryDiff = async (
    beforeCards: MarketplaceUserCard[],
    expectedCount: number,
  ) => {
    if (!starknetAddress) {
      return [];
    }

    const previousTokenIds = new Set(beforeCards.map((card) => card.tokenId));

    for (let attempt = 0; attempt < PACK_INVENTORY_POLL_ATTEMPTS; attempt += 1) {
      if (attempt > 0) {
        await wait(PACK_INVENTORY_POLL_DELAY_MS);
      }

      try {
        const currentCards = await getMarketplaceUserCards(starknetAddress);
        const newCards = currentCards
          .filter((card) => !previousTokenIds.has(card.tokenId))
          .sort((left, right) => {
            const leftTokenId = BigInt(left.tokenId);
            const rightTokenId = BigInt(right.tokenId);
            if (leftTokenId === rightTokenId) return 0;
            return leftTokenId > rightTokenId ? 1 : -1;
          });

        if (newCards.length > 0) {
          return toMintedCards(
            expectedCount > 0 ? newCards.slice(0, expectedCount) : newCards,
          );
        }
      } catch (error) {
        console.error(
          "[PackRow] failed to resolve purchased pack cards from inventory diff",
          error,
        );
      }
    }

    return [];
  };

  const handleFiatPurchase = async () => {
    if (isPurchasing || isCryptoPurchasing) {
      return;
    }

    if (!price) {
      toast({
        status: "error",
        title: t("purchase-error-title"),
        description: t("purchase-error-no-package"),
      });
      return;
    }

    try {
      setIsPurchasing(true);
      const availablePackageIds = Object.keys(
        offerings?.packPackages ?? {},
      ).map((key) => key.toLowerCase());
      if (
        availablePackageIds.length === 0 ||
        !availablePackageIds.includes(packageId.toLowerCase())
      ) {
        toast({
          status: "error",
          title: t("purchase-error-title"),
          description: t("purchase-error-no-package"),
        });
        return;
      }

      listenForPurchase(username ?? "", "pack_purchases", (payload) => {
        const simplifiedCards = payload.new.minted_cards.map(
          (card: { card_id: number; skin_id: number }) => ({
            card_id: card.card_id,
            skin_id: card.skin_id,
          }),
        );

        navigate(`/external-pack/${packId}`, {
          state: {
            initialCards: simplifiedCards,
            packId,
            returnTo: "/shop",
            ownedCardIds,
          },
        });
      });

      await purchasePackageById(packageId);
    } catch (error) {
      console.error("Failed to purchase pack", error);
      navigate("/shop");

      toast({
        status: "error",
        title: t("purchase-error-title"),
        description: t("purchase-error-description"),
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCryptoPurchase = async () => {
    if (isPurchasing || isCryptoPurchasing) {
      return;
    }

    if (!priceAtoms) {
      toast({
        status: "error",
        title: t("purchase-error-title"),
        description: t("purchase-error-no-package"),
      });
      return;
    }

    if (isInsufficientUsdc) {
      toast({
        status: "error",
        title: t("purchase-error-title"),
        description: t("insufficient-usdc", {
          defaultValue: "Insufficient USDC balance.",
        }),
      });
      return;
    }

    try {
      const prePurchaseCards = starknetAddress
        ? await getMarketplaceUserCards(starknetAddress).catch((error) => {
            console.error(
              "[PackRow] failed to snapshot inventory before crypto purchase",
              error,
            );
            return [];
          })
        : [];

      const result = await buyWithCrypto(packId, priceAtoms, packageId);
      const fallbackMintedCards =
        (result.mintedCards?.length ?? 0) > 0 || prePurchaseCards.length === 0
          ? []
          : await resolveMintedCardsFromInventoryDiff(
              prePurchaseCards,
              getPackSize(packId),
            );

      const resolvedMintedCards = [
        ...(
          ((result.mintedCards?.length ?? 0) > 0
            ? result.mintedCards
            : fallbackMintedCards) ?? []
        ),
      ];

      const mintedCards = resolvedMintedCards.map((card) => ({
        card_id: card.card_id,
        skin_id: card.skin_id,
      }));

      if (mintedCards.length === 0) {
        toast({
          status: "success",
          title: t("purchase-success-title", {
            defaultValue: "Purchase completed",
          }),
          description: t("purchase-success-description", {
            defaultValue:
              "Your pack purchase is processing and can take a few minutes to appear.",
          }),
        });
        navigate("/shop");
        return;
      }

      navigate(`/external-pack/${packId}`, {
        state: {
          initialCards: mintedCards,
          packId,
          returnTo: "/shop",
          ownedCardIds,
        },
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "userCancelled" in error
      ) {
        return;
      }

      console.error("Failed to purchase pack with crypto", error);
      toast({
        status: "error",
        title: t("purchase-error-title"),
        description: t("purchase-error-description"),
      });
    }
  };

  const handlePurchaseClick = () => {
    if (isBuyDisabled) return;

    if (!starknetAddress) {
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
      return;
    }

    if (requiresRevenueCatIdentity && !isRevenueCatIdentityReady) {
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

  const buyLabel = hasCryptoOption && priceUsdc
    ? `${t("buy")} · ${priceUsdc} USDC`
    : hasFiatOption
      ? `${t("buy")} · ${price}`
      : t("buy");

  return (
    <>
      <Flex
        borderBottom={`1px solid ${BLUE}`}
        borderTop={`1px solid ${BLUE}`}
        py="50px"
        flexDir={"column"}
        px={fullBleed ? 0 : 4}
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
              fontSize={isSmallScreen ? 15 : 35}
              variant="italic"
              textShadow={"0 0 5px white"}
              whiteSpace="nowrap"
              animation={
                isLimitedEdition
                  ? `${limitedEditionPulse} 2.8s ease-in-out infinite`
                  : undefined
              }
              transformOrigin="center"
              display="inline-block"
              willChange={isLimitedEdition ? "transform, filter" : undefined}
            >
              {t(`${translationPackId}.name`)}
            </Heading>
            <Heading
              fontSize={isSmallScreen ? 11 : 18}
              lineHeight={1}
              color={isLimitedEdition ? "gold" : "lightViolet"}
              textShadow={"0 0 5px black"}
              mb={isSmallScreen ? 4 : 8}
              animation={
                isLimitedEdition
                  ? `${limitedEditionPulse} 2.4s ease-in-out infinite`
                  : undefined
              }
              style={isLimitedEdition ? { animationDelay: "0.4s" } : undefined}
              transformOrigin="center"
              display="inline-block"
              willChange={isLimitedEdition ? "transform, filter" : undefined}
            >
              {t(isLimitedEdition ? "limited-edition" : `player-pack`)}
            </Heading>
            <Flex
              flexDir="column"
              gap={isSmallScreen ? 1.5 : 3}
              mb={isSmallScreen ? 3 : 6}
            >
              <Text fontSize={isSmallScreen ? 12 : 18} lineHeight={1}>
                {t(`${translationPackId}.description.1`)}
              </Text>
              <Text fontSize={isSmallScreen ? 12 : 18} lineHeight={1}>
                {t(`${translationPackId}.description.2`)}
              </Text>
              <Text fontSize={isSmallScreen ? 12 : 18} lineHeight={1}>
                {t(`size`)}: {getPackSize(packId)}
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
            <NFTPackRateInfo
              name={t(`${translationPackId}.name`)}
              details={t(`${translationPackId}.description.1`)}
              packId={packId}
            />
            <Button
              variant={"secondarySolid"}
              w={isSmallScreen ? "70%" : "300px"}
              fontFamily="Oxanium"
              fontSize={isSmallScreen ? 13 : 16}
              mt={isSmallScreen ? 4 : 8}
              h={isSmallScreen ? "30px" : "40px"}
              isDisabled={isBuyDisabled}
              animation={
                isBuyDisabled || !isLimitedEdition
                  ? undefined
                  : `${buttonGlowAnimation} 2.2s ease-in-out infinite`
              }
              willChange={
                isBuyDisabled || !isLimitedEdition ? undefined : "box-shadow"
              }
              onClick={handlePurchaseClick}
            >
              {isPurchasing || isCryptoPurchasing || isResolvingUsername ? (
                <Spinner size="xs" />
              ) : (
                buyLabel
              )}
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
              filter="drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 22px rgba(255,255,255,0.25))"
              animation={
                isLimitedEdition
                  ? `${shopPackGlowAnimation} 2.8s ease-in-out infinite`
                  : undefined
              }
              willChange={isLimitedEdition ? "filter" : undefined}
            />
          </Flex>
        </Flex>
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
        fiatDisabled={!hasFiatOption || isPurchasing || isCryptoPurchasing}
        cryptoDisabled={
          !hasCryptoOption || isInsufficientUsdc || isPurchasing || isCryptoPurchasing
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
