import { Button, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MintedCard } from "../../hooks/useCryptoPurchase";
import { cardImageUrl } from "../../utils/formatPrice";
import PackTear from "./PackTear";
import { SplitPackOnce } from "./SplitPackOnce";
import Stack, { Intensity } from "./CardStack/Stack";

const packFloat = keyframes`
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

function getIntensity(rarity: number, skinned: boolean): Intensity {
  if (skinned) return Intensity.MAX;
  if (rarity >= 3) return Intensity.MAX;
  if (rarity === 2) return Intensity.HIGH;
  if (rarity === 1) return Intensity.MEDIUM;
  return Intensity.LOW;
}

export function ExternalPacksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSmall = useBreakpointValue({ base: true, md: false }) ?? false;
  const packId: number | undefined = location.state?.packId;
  const mintedCards: MintedCard[] | undefined = location.state?.mintedCards ?? location.state?.initialCards;

  const [step, setStep] = useState(0);
  const [allCardsSeen, setAllCardsSeen] = useState(false);

  const hasCards = mintedCards && mintedCards.length > 0;

  const packWidth = isSmall ? 250 : 292;
  const packHeight = isSmall ? 405 : 472;
  const extraPackWidth = packWidth + 50;
  const packArtHeight = packWidth * 1.5;
  const packArtOffsetY = (packHeight - packArtHeight) / 2;
  const tearColor: "white" | "black" = packId && packId >= 25 ? "white" : "black";

  const cardsData = useMemo(() => {
    if (!mintedCards) return [];
    return [...mintedCards].reverse().map((card, index) => ({
      id: index,
      cardId: card.card_id,
      skinId: card.skin_id,
      img: cardImageUrl(card.card_id, card.skin_id),
      intensity: getIntensity(card.rarity, (card.skin_id ?? 0) > 0),
    }));
  }, [mintedCards]);

  // Fallback when no animation data available
  if (!hasCards || !packId) {
    return (
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        py={isSmall ? 10 : 20}
        gap={isSmall ? 6 : 10}
        minH="60vh"
      >
        <Text fontSize={isSmall ? 22 : 36} fontWeight="bold" color="neonGreen">
          Purchase Complete!
        </Text>
        {packId && (
          <Text fontSize={isSmall ? 13 : 17} color="whiteAlpha.800" maxW="500px" lineHeight={1.5}>
            Your pack has been purchased. Open the{" "}
            <Text as="span" color="neonGreen" fontWeight="bold">Jokers of Neon</Text>{" "}
            app to open your pack and see your new cards.
          </Text>
        )}
        <Flex gap={3} flexDir={isSmall ? "column" : "row"}>
          <Button variant="secondarySolid" fontFamily="Oxanium" fontSize={isSmall ? 13 : 15} h={isSmall ? "34px" : "42px"} px={6} onClick={() => navigate("/shop")}>
            Back to Shop
          </Button>
          <Button variant="outline" fontFamily="Oxanium" fontSize={isSmall ? 13 : 15} h={isSmall ? "34px" : "42px"} px={6} onClick={() => navigate("/")}>
            Browse Marketplace
          </Button>
        </Flex>
      </Flex>
    );
  }

  const packTransform =
    step === 0 ? "none"
    : step <= 2 ? "translateY(40vh)"
    : "translateY(50vh)";

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      minH="100svh"
      width="100%"
      position="relative"
      overflow="hidden"
      backgroundColor={step === 0 ? "transparent" : "rgba(0,0,0,0.85)"}
      transition="background-color 2s ease"
    >
      {/* Scratch hint — appears after pack moves down */}
      {step === 1 && (
        <Flex
          transform="translateY(35vh)"
          opacity={0}
          pointerEvents="none"
          sx={{
            "@keyframes fadeInHint": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
            animation: "fadeInHint 1s ease 3s forwards",
          }}
        >
          <Text fontSize={isSmall ? 14 : 18} color="whiteAlpha.700">
            Draw a line across the pack to open it
          </Text>
        </Flex>
      )}

      {/* Pack area */}
      <Flex
        h={`${packHeight}px`}
        width={`${packWidth}px`}
        position="relative"
        zIndex={5}
        transform={packTransform}
        transition="transform 2s ease"
      >
        <div style={{ display: "flex", alignItems: "stretch", position: "relative", width: "100%", height: "100%" }}>
          {step < 2 && (
            <>
              <PackTear
                onOpened={() => setStep(2)}
                width={extraPackWidth}
                packWidth={packWidth}
                step={step}
                color={tearColor}
              />
              <Flex
                position="absolute"
                top={`${packArtOffsetY}px`}
                left={0}
                h={`${packArtHeight}px`}
                w={`${packWidth}px`}
                animation={step === 0 ? `${packFloat} 3s ease-in-out infinite` : "none"}
              >
                <img
                  src={`/packs/${packId}.png`}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  alt="Pack"
                />
              </Flex>
            </>
          )}
          {step >= 2 && (
            <SplitPackOnce
              width={packWidth}
              height={packHeight}
              src={`/packs/${packId}.png`}
              onDone={() => {
                setStep(3);
                setTimeout(() => setStep(4), 1000);
              }}
              step={step}
            />
          )}
        </div>
      </Flex>

      {/* Card stack — slides up when pack is opened */}
      <Flex
        position="absolute"
        transform={step >= 3 ? "translateY(0)" : "translateY(60vh)"}
        transition="all 1s ease"
        opacity={step >= 3 ? 1 : 0}
        zIndex={2}
        pointerEvents={step >= 3 ? "all" : "none"}
      >
        <Flex animation={`${packFloat} 2s ease-in-out infinite`}>
          <Stack
            randomRotation
            sensitivity={180}
            sendToBackOnClick
            cardDimensions={{ width: packWidth - 10, height: packHeight - 40 }}
            cardsData={cardsData}
            onAllSeen={() => setAllCardsSeen(true)}
          />
        </Flex>
      </Flex>

      {/* Open button (step 0) */}
      {step === 0 && (
        <Button
          mt={6}
          onClick={() => setStep(1)}
          width={isSmall ? "40%" : "200px"}
          variant="secondarySolid"
          fontFamily="Oxanium"
          fontSize={14}
        >
          Open Pack
        </Button>
      )}

      {/* Back to shop — appears after all cards have been swiped */}
      {allCardsSeen && (
        <Button
          position="absolute"
          bottom={isSmall ? "30px" : "80px"}
          right={isSmall ? "15px" : "30px"}
          zIndex={20}
          variant="secondarySolid"
          fontFamily="Oxanium"
          fontSize={isSmall ? 13 : 15}
          h={isSmall ? "34px" : "42px"}
          px={6}
          onClick={() => navigate("/shop")}
        >
          Back to Shop
        </Button>
      )}
    </Flex>
  );
}
