import {
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getUserCards } from "../../api/getUserCards";
import CachedImage from "../../components/CachedImage";
import { NFTPackRateInfo } from "../../components/Info/NFTPackRateInfo";
import { packAnimation } from "../../constants/animations";
import { useDojo } from "../../dojo/DojoContext";
import { useRevenueCat } from "../../providers/RevenueCatProvider";
import { listenForPurchase } from "../../queries/listenForPurchase";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { useUsername } from "../../dojo/utils/useUsername";

interface PackRowProps {
  packId: number;
  packageId: string;
  price?: string;
}

const PACK_SIZES = [0, 3, 3, 4, 4, 5, 10];

export const PackRow = ({ packId, packageId, price }: PackRowProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "shop.packs",
  });
  const isLimitedEdition = packId > 4;
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    account: { account },
  } = useDojo();
  const username = useUsername();
  const { purchasePackageById, offerings } = useRevenueCat();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [ownedCardIds, setOwnedCardIds] = useState<string[]>([]);

  useEffect(() => {
    if (!account?.address) {
      setOwnedCardIds([]);
      return;
    }

    let cancelled = false;
    getUserCards(account.address)
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
  }, [account?.address]);

  const handlePurchase = async () => {
    if (isPurchasing) {
      return;
    }

    if (!account?.address) {
      toast({
        status: "error",
        title: t("purchase-error-title"),
        description: t("purchase-error-no-account"),
      });
      return;
    }

    try {
      setIsPurchasing(true);
      const availablePackageIds = Object.keys(
        offerings?.packPackages ?? {}
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
          })
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
            <NFTPackRateInfo name={t(`${packId}.name`)} details={t(`${packId}.description.1`)} packId={packId} />
            <Button
              variant={"secondarySolid"}
              w={isSmallScreen ? "70%" : "300px"}
              fontFamily="Oxanium"
              fontSize={isSmallScreen ? 13 : 16}
              mt={isSmallScreen ? 4 : 8}
              h={isSmallScreen ? "30px" : "40px"}
              isDisabled={isPurchasing || !price}
              onClick={handlePurchase}
            >
              {isPurchasing || !price ? (
                <Spinner size="xs" />
              ) : (
                `${t("buy")} · ${price}`
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
              boxShadow={"0 0 15px 0px white, inset 0 0 5px 0 white"}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
