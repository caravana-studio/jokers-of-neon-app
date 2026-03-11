import {
  Button,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  Tooltip,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useConnect } from "@starknet-react/core";
import { useCryptoPurchase } from "../../hooks/useCryptoPurchase";
import { useUSDCBalance } from "../../hooks/useUSDCBalance";
import { useShopPrice } from "../../hooks/useShopPrice";
import { BLUE } from "../../theme/colors";

// ─── Animations ───────────────────────────────────────────────────────────────
const packAnimation = keyframes`
  0%   { transform: scale(1) translateY(0); }
  50%  { transform: scale(1) translateY(5px); }
  100% { transform: scale(1) translateY(0); }
`;

const shopPackGlowAnimation = keyframes`
  0%   { filter: drop-shadow(0 0 8px rgba(255,255,255,0.35)) drop-shadow(0 0 18px rgba(255,255,255,0.2)); }
  50%  { filter: drop-shadow(0 0 14px rgba(255,255,255,0.65)) drop-shadow(0 0 30px rgba(255,255,255,0.35)); }
  100% { filter: drop-shadow(0 0 8px rgba(255,255,255,0.35)) drop-shadow(0 0 18px rgba(255,255,255,0.2)); }
`;

const limitedEditionPulse = keyframes`
  0%   { transform: scale(1);    filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0)); }
  50%  { transform: scale(1.05); filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); }
  100% { transform: scale(1);    filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0)); }
`;

const buttonGlowAnimation = keyframes`
  0%   { box-shadow: 0 0 5px 2px rgba(161, 68, 178, 0.6); }
  50%  { box-shadow: 0 0 15px 7px rgba(161, 68, 178, 1); }
  100% { box-shadow: 0 0 5px 2px rgba(161, 68, 178, 0.6); }
`;

// ─── Pack metadata ────────────────────────────────────────────────────────────
const PACK_SIZES: Record<number, number> = {
  2: 3, 3: 4, 4: 4, 5: 5, 6: 10,
  22: 3, 23: 4, 24: 4, 25: 5, 26: 10,
};

const PACK_INFO: Record<number, { name: string; desc1: string; desc2: string }> = {
  2:  { name: "ADVANCED",     desc1: "Upgrade your collection with higher odds of rare cards.",       desc2: "Up to 50% chance to pull a Special card." },
  3:  { name: "EPIC",         desc1: "A premium pack with a strong chance of hitting Specials.",     desc2: "Up to 75% chance to get a Special card, includes A and S tiers." },
  4:  { name: "LEGENDARY",    desc1: "Guaranteed Special card in every pack.",                        desc2: "Highest odds for A and S tier Specials, truly legendary rewards." },
  5:  { name: "COLLECTOR",    desc1: "Limited-edition pack featuring ultra-rare cards and skins.",   desc2: "1 guaranteed skinned Special card with top-tier odds." },
  6:  { name: "COLLECTOR XL", desc1: "Massive pack loaded with the rarest content of the season.",  desc2: "2 guaranteed skinned Special cards with top-tier odds." },
  22: { name: "ADVANCED",     desc1: "Upgrade your collection with higher odds of rare cards.",       desc2: "Up to 50% chance to pull a Special card." },
  23: { name: "EPIC",         desc1: "A premium pack with a strong chance of hitting Specials.",     desc2: "Up to 75% chance to get a Special card, includes A and S tiers." },
  24: { name: "LEGENDARY",    desc1: "Guaranteed Special card in every pack.",                        desc2: "Highest odds for A and S tier Specials, truly legendary rewards." },
  25: { name: "COLLECTOR",    desc1: "Limited-edition pack featuring ultra-rare cards and skins.",   desc2: "1 guaranteed skinned Special card with top-tier odds." },
  26: { name: "COLLECTOR XL", desc1: "Massive pack loaded with the rarest content of the season.",  desc2: "2 guaranteed skinned Special cards with top-tier odds." },
};

const COLLECTOR_IDS = new Set([5, 6, 25, 26]);

interface PackRowProps {
  packId: number;
  shopId: string;
}

export function PackRow({ packId, shopId }: PackRowProps) {
  const isSmall = useBreakpointValue({ base: true, md: false });
  const toast = useToast();
  const navigate = useNavigate();
  const { status: accountStatus } = useAccount();
  const { connect, connectors } = useConnect();
  const { buy } = useCryptoPurchase();
  const { balanceRaw } = useUSDCBalance();
  const { priceAtoms, priceUsdc } = useShopPrice(packId);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const info = PACK_INFO[packId];
  const isLimitedEdition = COLLECTOR_IDS.has(packId);
  const hasBalance = balanceRaw !== undefined && priceAtoms !== undefined && balanceRaw >= priceAtoms;
  const isInsufficientBalance = accountStatus === "connected" && balanceRaw !== undefined && !hasBalance;
  const isBuyDisabled = isPurchasing || isInsufficientBalance || priceAtoms === undefined;

  const handlePurchase = async () => {
    if (isPurchasing) return;
    if (accountStatus !== "connected") {
      connectors[0] && connect({ connector: connectors[0] });
      return;
    }
    if (!priceAtoms) return;
    try {
      setIsPurchasing(true);
      const result = await buy(packId, priceAtoms, shopId);
      navigate("/external-packs", { state: { packId, mintedCards: result.mintedCards } });
    } catch (err: any) {
      if (err?.userCancelled) return;
      toast({ status: "error", title: "Purchase failed", description: "We couldn't complete your purchase. Please try again." });
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!info) return null;

  return (
    <>
      <Flex
        borderBottom={`1px solid ${BLUE}`}
        borderTop={`1px solid ${BLUE}`}
        py="50px"
        flexDir="column"
        px={4}
        alignItems="center"
        background={`url(/packs/bg/${packId}.jpg)`}
        backgroundSize="cover"
        backgroundPosition="center"
      >
        <Flex w="100%" justifyContent="center" alignItems="center" my={4}>
          {/* Left — text info */}
          <Flex
            w="60%"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            px={2}
          >
            <Heading
              fontSize={isSmall ? 15 : 35}
              variant="italic"
              textShadow="0 0 5px white"
              whiteSpace="nowrap"
              animation={isLimitedEdition ? `${limitedEditionPulse} 2.8s ease-in-out infinite` : undefined}
              transformOrigin="center"
              display="inline-block"
              willChange={isLimitedEdition ? "transform, filter" : undefined}
            >
              {info.name}
            </Heading>
            <Heading
              fontSize={isSmall ? 11 : 18}
              lineHeight={1}
              color={isLimitedEdition ? "gold" : "#DCA2EA"}
              textShadow="0 0 5px black"
              mb={isSmall ? 4 : 8}
              animation={isLimitedEdition ? `${limitedEditionPulse} 2.4s ease-in-out infinite` : undefined}
              style={isLimitedEdition ? { animationDelay: "0.4s" } : undefined}
              transformOrigin="center"
              display="inline-block"
              willChange={isLimitedEdition ? "transform, filter" : undefined}
            >
              {isLimitedEdition ? "Limited edition" : "Player pack"}
            </Heading>

            <Flex flexDir="column" gap={isSmall ? 1.5 : 3} mb={isSmall ? 3 : 6}>
              <Text fontSize={isSmall ? 12 : 18} lineHeight={1}>{info.desc1}</Text>
              <Text fontSize={isSmall ? 12 : 18} lineHeight={1}>{info.desc2}</Text>
              <Text fontSize={isSmall ? 12 : 18} lineHeight={1}>
                Size: {PACK_SIZES[packId]}
              </Text>
            </Flex>

            <Flex flexDir="column" gap={isSmall ? 1 : 2} mb={isSmall ? 2 : 4}>
              <Text fontSize={isSmall ? 8 : 15} lineHeight={1} color="#20C6ED" textAlign="center">
                All items in purchased packs are transferrable.
              </Text>
              {!isLimitedEdition && (
                <Text fontSize={isSmall ? 8 : 15} color="#20C6ED" textAlign="center" lineHeight={1}>
                  Player packs do not contain skinned cards.
                </Text>
              )}
            </Flex>

            <Tooltip
              label="You don't have enough USDC"
              isDisabled={!isInsufficientBalance}
              shouldWrapChildren
            >
              <Button
                variant="secondarySolid"
                w={isSmall ? "70%" : "300px"}
                fontFamily="Oxanium"
                fontSize={isSmall ? 13 : 16}
                mt={isSmall ? 4 : 8}
                h={isSmall ? "30px" : "40px"}
                isDisabled={isBuyDisabled}
                animation={isBuyDisabled || !isLimitedEdition ? undefined : `${buttonGlowAnimation} 2.2s ease-in-out infinite`}
                willChange={isBuyDisabled || !isLimitedEdition ? undefined : "box-shadow"}
                onClick={handlePurchase}
              >
                {isPurchasing ? <Spinner size="xs" /> : priceUsdc ? `BUY · ${priceUsdc} USDC` : <Spinner size="xs" />}
              </Button>
            </Tooltip>
          </Flex>

          {/* Right — pack image */}
          <Flex
            w="40%"
            justifyContent={isSmall ? "center" : "flex-start"}
            animation={`${packAnimation} 4s ease-in-out infinite`}
            transformOrigin="center"
            alignItems="center"
            pr={6}
          >
            <Image
              w={isSmall ? "90%" : "300px"}
              src={`/packs/${packId}.png`}
              alt={info.name}
              filter="drop-shadow(0 0 10px rgba(255,255,255,0.5)) drop-shadow(0 0 22px rgba(255,255,255,0.25))"
              animation={isLimitedEdition ? `${shopPackGlowAnimation} 2.8s ease-in-out infinite` : undefined}
              willChange={isLimitedEdition ? "filter" : undefined}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
