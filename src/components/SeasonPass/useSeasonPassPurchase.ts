import { useDisclosure, useToast } from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { DojoContext } from "../../dojo/DojoContext";
import { useCryptoPurchase } from "../../marketplace/hooks/useCryptoPurchase";
import { useShopPrice } from "../../marketplace/hooks/useShopPrice";
import { useUSDCBalance } from "../../marketplace/hooks/useUSDCBalance";
import { useSeasonPass } from "../../providers/SeasonPassProvider";
import { useUsernameStore } from "../../state/useUsernameStore";
import { isNative } from "../../utils/capacitorUtils";
import { addressKey } from "../../utils/starknetAddress";

interface UseSeasonPassPurchaseParams {
  id: string;
  price?: string;
  unlocked: boolean;
}

export interface SeasonPassPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFiatSelect: () => void;
  onCryptoSelect: () => void;
  fiatLabel: string;
  cryptoLabel: string;
  title: string;
  description: string;
  fiatDisabled: boolean;
  cryptoDisabled: boolean;
  cryptoDisabledReason?: string;
}

export const useSeasonPassPurchase = ({
  id,
  price,
  unlocked,
}: UseSeasonPassPurchaseParams) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.season-pass",
  });
  const { purchaseSeasonPass, refetchSeasonPassUnlocked } = useSeasonPass();
  const dojoCtx = useContext(DojoContext);
  const { address: connectedAddress } = useAccount();
  const dojoAddress = dojoCtx?.account.account?.address || null;
  const starknetAddress = dojoAddress || connectedAddress || null;
  const accountType = dojoCtx?.accountType ?? null;
  const usernameStatus = useUsernameStore((store) => store.status);
  const storedUsernameAddress = useUsernameStore((store) => store.address);
  const storedUsername = useUsernameStore((store) => store.username);
  const { connectors, connect } = useConnect();
  const { buy: buyWithCrypto, status: cryptoStatus } = useCryptoPurchase();
  const { priceAtoms, priceUsdc } = useShopPrice(id);
  const { balanceRaw } = useUSDCBalance();
  const paymentMethodModal = useDisclosure();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isCryptoPurchasing = ["transferring", "confirming", "submitting"].includes(
    cryptoStatus
  );
  const hasFiatOption = Boolean(price);
  const hasCryptoOption = !isNative && priceAtoms !== undefined && priceAtoms > 0n;
  const requiresRevenueCatIdentity = Boolean(starknetAddress && hasFiatOption);
  const hasReadyUsername =
    Boolean(starknetAddress) &&
    Boolean(storedUsername) &&
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
  const isButtonDisabled =
    unlocked ||
    isLoading ||
    isCryptoPurchasing ||
    (!hasFiatOption && !hasCryptoOption) ||
    (requiresRevenueCatIdentity && !isRevenueCatIdentityReady);

  const handleFiatPurchase = async () => {
    if (isLoading || isCryptoPurchasing || unlocked || !price) return;

    try {
      setIsLoading(true);
      await purchaseSeasonPass();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCryptoPurchase = async () => {
    if (isLoading || isCryptoPurchasing || unlocked || !priceAtoms) return;

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
      const result = await buyWithCrypto(id, priceAtoms, id);

      if (!result.deliveryPending) {
        await refetchSeasonPassUnlocked();
      }

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

  const handlePurchaseClick = () => {
    if (isButtonDisabled) return;

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

  const defaultButtonLabel = hasCryptoOption && priceUsdc
    ? `${t("buy")} · ${priceUsdc} USDC`
    : hasFiatOption
      ? `${t("buy")} · ${price}`
      : t("buy");

  const preferredPriceLabel = hasFiatOption
    ? price
    : hasCryptoOption && priceUsdc
      ? `${priceUsdc} USDC`
      : undefined;

  const paymentMethodModalProps: SeasonPassPaymentMethodModalProps = {
    isOpen: paymentMethodModal.isOpen,
    onClose: paymentMethodModal.onClose,
    onFiatSelect: () => {
      void handleFiatPurchase();
    },
    onCryptoSelect: () => {
      void handleCryptoPurchase();
    },
    fiatLabel: hasFiatOption
      ? `${t("pay-with-card", { defaultValue: "Pay with card" })} · ${price}`
      : t("pay-with-card", { defaultValue: "Pay with card" }),
    cryptoLabel:
      hasCryptoOption && priceUsdc
        ? `${t("pay-with-crypto", { defaultValue: "Pay with crypto" })} · ${priceUsdc} USDC`
        : t("pay-with-crypto", { defaultValue: "Pay with crypto" }),
    title: t("payment-method-title", {
      defaultValue: "Choose payment method",
    }),
    description: t("payment-method-description", {
      defaultValue: "You can complete your purchase with card or crypto.",
    }),
    fiatDisabled: !hasFiatOption || isLoading || isCryptoPurchasing,
    cryptoDisabled:
      !hasCryptoOption || isInsufficientUsdc || isLoading || isCryptoPurchasing,
    cryptoDisabledReason: isInsufficientUsdc
      ? t("insufficient-usdc", {
          defaultValue: "Insufficient USDC balance.",
        })
      : undefined,
  };

  return {
    defaultButtonLabel,
    handlePurchaseClick,
    isButtonDisabled,
    isCryptoPurchasing,
    isLoading,
    isResolvingUsername,
    paymentMethodModalProps,
    preferredPriceLabel,
  };
};
