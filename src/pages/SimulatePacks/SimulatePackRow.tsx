import { Button, Flex, Heading, Spinner, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCards } from "../../api/getUserCards";
import { simulatePack } from "../../api/simulatePack";
import CachedImage from "../../components/CachedImage";
import { NFTPackRateInfo } from "../../components/Info/NFTPackRateInfo";
import {
  limitedEditionPulse,
  packAnimation,
  shopPackGlowAnimation,
} from "../../constants/animations";
import { useDojo } from "../../dojo/DojoContext";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface SimulatePackRowProps {
  packId: number;
}

const PACK_SIZES: Record<number, number> = {
  1: 3, 2: 3, 3: 4, 4: 4, 5: 5, 6: 10,
  21: 3, 22: 3, 23: 4, 24: 4, 25: 5, 26: 10,
  31: 3, 32: 3, 33: 4, 34: 4, 35: 5, 36: 10,
};
const PACK_NAMES: Record<number, string> = {
  1: "Basic Pack",
  2: "Advanced Pack",
  3: "Epic Pack",
  4: "Legendary Pack",
  5: "Collector Pack",
  6: "Collector XL Pack",
  21: "Basic Pack S2",
  22: "Advanced Pack S2",
  23: "Epic Pack S2",
  24: "Legendary Pack S2",
  25: "Collector Pack S2",
  26: "Collector XL Pack S2",
  31: "Basic Pack S3",
  32: "Advanced Pack S3",
  33: "Epic Pack S3",
  34: "Legendary Pack S3",
  35: "Collector Pack S3",
  36: "Collector XL Pack S3",
};

export const SimulatePackRow = ({ packId }: SimulatePackRowProps) => {
  const isLimitedEdition = [5, 6, 25, 26, 35, 36].includes(packId);
  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    account: { account },
  } = useDojo();
  const [isSimulating, setIsSimulating] = useState(false);
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
        console.error("SimulatePackRow: failed to load user collection", error);
        setOwnedCardIds([]);
      });

    return () => {
      cancelled = true;
    };
  }, [account?.address]);

  const handleSimulate = async () => {
    if (isSimulating) {
      return;
    }

    if (!account?.address) {
      toast({
        status: "error",
        title: "Error",
        description: "No account connected",
      });
      return;
    }

    try {
      setIsSimulating(true);

      const result = await simulatePack({
        packId,
        recipient: account.address,
      });

      const simplifiedCards =
        result.mintedCards?.map((card) => ({
          card_id: card.card_id,
          skin_id: card.skin_id,
        })) ?? [];

      navigate(`/external-pack/${packId}`, {
        state: {
          initialCards: simplifiedCards,
          packId,
          returnTo: "/test/simulate-packs",
          ownedCardIds,
        },
      });
    } catch (error) {
      console.error("Failed to simulate pack", error);

      toast({
        status: "error",
        title: "Simulation Error",
        description:
          error instanceof Error ? error.message : "Failed to simulate pack",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
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
            {PACK_NAMES[packId] ?? `Pack ${packId}`}
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
            {isLimitedEdition ? "Limited Edition" : "Player Pack"}
          </Heading>
          <Flex
            flexDir="column"
            gap={isSmallScreen ? 1.5 : 3}
            mb={isSmallScreen ? 3 : 6}
          >
            <Text fontSize={isSmallScreen ? 12 : 18} lineHeight={1}>
              Size: {PACK_SIZES[packId]} cards
            </Text>
            <Text
              fontSize={isSmallScreen ? 10 : 14}
              lineHeight={1}
              color="yellow.300"
            >
              Simulation only - No transactions
            </Text>
          </Flex>
          <NFTPackRateInfo
            name={PACK_NAMES[packId] ?? `Pack ${packId}`}
            details={`${PACK_SIZES[packId]} cards`}
            packId={packId}
          />
          <Button
            variant={"secondarySolid"}
            w={isSmallScreen ? "70%" : "300px"}
            fontFamily="Oxanium"
            fontSize={isSmallScreen ? 13 : 16}
            mt={isSmallScreen ? 4 : 8}
            h={isSmallScreen ? "30px" : "40px"}
            isDisabled={isSimulating}
            onClick={handleSimulate}
          >
            {isSimulating ? <Spinner size="xs" /> : "Simulate"}
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
  );
};
