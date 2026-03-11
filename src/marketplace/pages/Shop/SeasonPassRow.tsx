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
import { useAccount, useConnect } from "@starknet-react/core";
import { useCryptoPurchase } from "../../hooks/useCryptoPurchase";
import { useUSDCBalance } from "../../hooks/useUSDCBalance";
import { useShopPrice } from "../../hooks/useShopPrice";
import { BLUE, VIOLET_LIGHT } from "../../theme/colors";

// ─── Animations (identical to app) ───────────────────────────────────────────
const coinPulse = keyframes`
  0%   { transform: scale(1.5) rotate(0deg); }
  50%  { transform: scale(1.6) rotate(3deg); }
  100% { transform: scale(1.5) rotate(0deg); }
`;

const coinPulseBack = keyframes`
  0%   { transform: scale(1.3) rotate(0deg); }
  50%  { transform: scale(1.4) rotate(-3deg); }
  100% { transform: scale(1.3) rotate(0deg); }
`;

const seasonPassPulse = keyframes`
  0%   { transform: scale(1) translateY(0) rotate(0deg); }
  50%  { transform: scale(1.05) translateY(-5px) rotate(-2deg); }
  100% { transform: scale(1) translateY(0) rotate(0deg); }
`;

const SEASON_NUMBER = 2;

interface SeasonPassRowProps {
  productId: string;
}

function Fact({ number }: { number: number }) {
  const isSmall = useBreakpointValue({ base: true, md: false });
  const FACTS: Record<number, { title: string; desc1: string; desc2: string }> = {
    1: {
      title: "Exclusive rewards",
      desc1: `Progressing through season ${SEASON_NUMBER} gives you extra rewards.`,
      desc2: "All your rewards are transferrable.",
    },
    2: {
      title: "More games per day",
      desc1: "You can play 6 games of Jokers per day instead of 3.",
      desc2: "Every game recovers every 4 hours instead of 8.",
    },
  };
  const f = FACTS[number];
  if (!f) return null;
  return (
    <Flex flexDir="column" gap={isSmall ? 0.5 : 1.5}>
      <Text fontSize={isSmall ? 15 : 26}>{f.title}</Text>
      <Text fontSize={isSmall ? 10 : 17} lineHeight={1}>{f.desc1}</Text>
      <Text fontSize={isSmall ? 10 : 17} lineHeight={1}>{f.desc2}</Text>
    </Flex>
  );
}

export function SeasonPassRow({ productId }: SeasonPassRowProps) {
  const isSmall = useBreakpointValue({ base: true, md: false });
  const toast = useToast();
  const { status: accountStatus } = useAccount();
  const { connect, connectors } = useConnect();
  const { buy } = useCryptoPurchase();
  const { balanceRaw } = useUSDCBalance();
  const { priceAtoms, priceUsdc } = useShopPrice(productId);
  const [isLoading, setIsLoading] = useState(false);

  const hasBalance = balanceRaw !== undefined && priceAtoms !== undefined && balanceRaw >= priceAtoms;
  const isInsufficientBalance = accountStatus === "connected" && balanceRaw !== undefined && !hasBalance;

  const handlePurchase = async () => {
    if (accountStatus !== "connected") {
      connectors[0] && connect({ connector: connectors[0] });
      return;
    }
    if (!priceAtoms) return;
    try {
      setIsLoading(true);
      await buy(productId, priceAtoms);
      toast({ status: "success", title: "Season Pass unlocked!", description: "Your Season Pass is now active. It may take a few minutes to appear in-game." });
    } catch (err: any) {
      if (err?.userCancelled) return;
      toast({ status: "error", title: "Purchase failed", description: "We couldn't complete your purchase. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Flex
        borderBottom={`1px solid ${BLUE}`}
        borderTop={`1px solid ${BLUE}`}
        py={isSmall ? "50px" : "120px"}
        flexDir="column"
        px={4}
        alignItems="center"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/shop/season-pass/bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
        sx={{ "> *": { position: "relative", zIndex: 1 } }}
      >
        {/* Floating coins */}
        <Flex position="relative" w={isSmall ? "100%" : "600px"} h="0" overflow="visible">
          <Image
            src="/shop/season-pass/coins-front.png"
            w="100%"
            position="absolute"
            animation={`${coinPulse} 4s ease-in-out infinite`}
            transformOrigin="center"
            zIndex={2}
            alt=""
          />
          <Image
            src="/shop/season-pass/coins-back.png"
            w="100%"
            zIndex={0}
            opacity={0.6}
            position="absolute"
            animation={`${coinPulseBack} 4s ease-in-out infinite`}
            transformOrigin="center"
            alt=""
          />
        </Flex>

        {/* Title */}
        <Flex flexDir="column" w="100%" justifyContent="center" alignItems="center">
          <Text textTransform="uppercase" fontSize={isSmall ? "sm" : "md"} lineHeight={1.1} textAlign="center">
            More Jokers with
          </Text>
          <Heading
            color="#DCA2EA"
            fontSize={isSmall ? 22 : 40}
            lineHeight={1}
            textShadow={`0 0 7px ${VIOLET_LIGHT}`}
          >
            SEASON {SEASON_NUMBER} PASS
          </Heading>
        </Flex>

        {/* Pass image + facts */}
        <Flex w="100%" justifyContent="center" alignItems="center" my={isSmall ? 4 : 10}>
          <Flex
            w="50%"
            justifyContent="flex-end"
            animation={`${seasonPassPulse} 4s ease-in-out infinite`}
            transformOrigin="center"
            alignItems="center"
            pr={isSmall ? 6 : 20}
          >
            <Image
              src={`/season-pass${SEASON_NUMBER}.png`}
              w={isSmall ? "110px" : "230px"}
              transform="rotate(-25deg)"
              filter={`drop-shadow(0 0 7px rgba(255,255,255,0.7)) drop-shadow(0 0 5px rgba(255,255,255,0.7))`}
              alt="Season Pass"
            />
          </Flex>
          <Flex w="50%" flexDir="column" gap={isSmall ? 4 : 6}>
            <Fact number={1} />
            <Fact number={2} />
          </Flex>
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
            mt={isSmall ? 2 : 6}
            h={isSmall ? "30px" : "40px"}
            isDisabled={isLoading || isInsufficientBalance || priceAtoms === undefined}
            onClick={handlePurchase}
          >
            {isLoading ? <Spinner size="xs" /> : priceUsdc ? `BUY · ${priceUsdc} USDC` : <Spinner size="xs" />}
          </Button>
        </Tooltip>
      </Flex>
    </>
  );
}
