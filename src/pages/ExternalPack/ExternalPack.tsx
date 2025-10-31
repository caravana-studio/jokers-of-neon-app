import { Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { mintPack } from "../../api/mintPack";
import { GalaxyBackground } from "../../components/backgrounds/galaxy/GalaxyBackground";
import { GalaxyBackgroundIntensity } from "../../components/backgrounds/galaxy/types";
import CachedImage from "../../components/CachedImage";
import { DelayedLoading } from "../../components/DelayedLoading";
import { LootBoxRateInfo } from "../../components/Info/LootBoxRateInfo";
import { MobileDecoration } from "../../components/MobileDecoration";
import { RARITY, RarityLabels } from "../../constants/rarity";
import { useDojo } from "../../dojo/useDojo";
import { CardTypes } from "../../enums/cardTypes";
import { useCardData } from "../../providers/CardDataProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { colorizeText } from "../../utils/getTooltip";
import Stack from "./CardStack/Stack";
import PackTear from "./PackTear";
import { SplitPackOnce } from "./SplitPackOnce";

const getIntensity = (type: CardTypes, rarity: RARITY) => {
  switch (type) {
    case CardTypes.JOKER:
      return GalaxyBackgroundIntensity.MEDIUM;
    case CardTypes.NEON:
      return GalaxyBackgroundIntensity.MEDIUM;
    case CardTypes.SPECIAL:
      switch (rarity) {
        case RARITY.C:
          return GalaxyBackgroundIntensity.MEDIUM;
        case RARITY.B:
          return GalaxyBackgroundIntensity.MEDIUM;
        case RARITY.A:
          return GalaxyBackgroundIntensity.HIGH;
        case RARITY.S:
          return GalaxyBackgroundIntensity.MAX;
        default:
          return GalaxyBackgroundIntensity.MEDIUM;
      }
    default:
      return GalaxyBackgroundIntensity.LOW;
  }
};

export interface SimplifiedCard {
  card_id: number;
  skin_id: number;
}

interface ExternalPackProps {
  initialCards?: SimplifiedCard[];
}

export const ExternalPack = ({ initialCards = [] }: ExternalPackProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "external-pack",
  });

  const params = useParams();
  const packId = Number(params.packId ?? 1);

  const { t: tDocs } = useTranslation("docs");
  const { t: tGame } = useTranslation("game");
  const { getCardData } = useCardData();

  const { account } = useDojo();

  const [allCardsSeen, setAllCardsSeen] = useState(false);

  const [step, setStep] = useState(initialCards ? 1 : 0);

  const { isSmallScreen } = useResponsiveValues();

  const packWidth = useMemo(() => (isSmallScreen ? 250 : 360), [isSmallScreen]);
  const extraPackWidth = packWidth + 50;
  const packHeight = useMemo(
    () => (isSmallScreen ? 405 : 583),
    [isSmallScreen]
  );

  const [highlightedCard, setHighlightedCard] = useState<number | null>(null);
  const {
    name,
    description,
    type,
    animation,
    price,
    rarity,
    temporaryPrice,
    details,
  } = getCardData(highlightedCard ?? 0);

  const navigate = useNavigate();

  const [buying, setBuying] = useState(false);

  const [obtainedCards, setObtainedCards] = useState<
    SimplifiedCard[]
  >(initialCards);


  return (
    <DelayedLoading ms={100}>
      <GalaxyBackground
        opacity={step >= 3 ? 1 : 0}
        intensity={getIntensity(type ?? CardTypes.NONE, rarity ?? RARITY.C)}
      />

      {allCardsSeen && (
        <Button
          position="absolute"
          bottom={isSmallScreen ? "30px" : "80px"}
          right={isSmallScreen ? "15px" : "30px"}
          onClick={() => navigate("/")}
          zIndex={20}
        >
          {isSmallScreen ? (
            <FontAwesomeIcon color="white" fontSize={13} icon={faCaretRight} />
          ) : (
            t("continue")
          )}
        </Button>
      )}
      <Flex flexDirection={"column"} width={"100%"} height={"100%"}>
        <MobileDecoration />
        <Flex
          flexDirection={"column"}
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
          p={4}
          height={"100%"}
          width={"100%"}
          transition="all 2s ease"
          backgroundColor={step === 0 ? "transparent" : "rgba(0,0,0,0.7)"}
        >
          {step === 0 && (
            <>
              <Flex flexDirection="column" textAlign="center">
                <Heading
                  fontWeight={500}
                  size="l"
                  letterSpacing={1.3}
                  variant="italic"
                  textTransform="unset"
                >
                  LEGENDARY
                </Heading>
                <Text size="l" fontWeight={600}>
                  - PLAYER PACK -
                </Text>
              </Flex>
              <LootBoxRateInfo name={"test"} details={"details"} />
            </>
          )}

          {step === 4 && (
            <Flex
              key={`${name}-${type}`}
              flexDirection="column"
              textAlign="center"
              zIndex={10}
              height={isSmallScreen ? "150px" : "250px"}
              justifyContent={"center"}
              mt={isSmallScreen ? 0 : 14}
              sx={{
                animation: "0.3s ease-out slideIn",
                "@keyframes slideIn": {
                  from: {
                    opacity: 0,
                    transform: "translateX(-30px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                },
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            >
              <Heading
                fontWeight={500}
                size="l"
                letterSpacing={1.3}
                textTransform="unset"
              >
                {name}
              </Heading>
              <Text size="l" textTransform="lowercase" fontWeight={600}>
                - {tGame(`game.card-types.${type}`)} -
              </Text>
            </Flex>
          )}

          {step === 1 && (
            <Flex
              transform="translateY(35vh)"
              opacity={0}
              transition="opacity 1s ease"
              sx={{
                "@keyframes fadeIn": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
                animation: "fadeIn 1s ease 3s forwards",
              }}
            >
              <Text size="lg">Draw a line to open</Text>
            </Flex>
          )}

          {/* PACK AREA */}
          <Flex
            h={packHeight}
            width={`${packWidth}px`}
            position="relative"
            zIndex={5}
            transform={
              step === 0
                ? "unset"
                : step === 1
                  ? "translateY(40vh)"
                  : step === 2
                    ? "translateY(40vh)"
                    : "translateY(50vh)"
            }
            transition="all 2s ease"
          >
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                position: "relative",
              }}
            >
              {/* Step < 2 → pack normal + overlay de corte */}
              {step < 2 && (
                <>
                  <PackTear
                    onOpened={() => setStep(2)}
                    width={extraPackWidth}
                    step={step}
                  />
                  <CachedImage
                    src={`/packs/${packId}.png`}
                    h="100%"
                    // boxShadow={"0 0 20px 0px white, inset 0 0 10px 0px white"}
                  />
                </>
              )}

              {/* Step 2 → pack partido en dos con animación */}
              {step >= 2 && (
                <SplitPackOnce
                  width={packWidth}
                  height={packHeight}
                    src={`/packs/${packId}.png`}
                  onDone={() => {
                    setStep(3);

                    const timer = setTimeout(() => {
                      setStep(4);
                    }, 1000);
                    return () => clearTimeout(timer);
                  }}
                  step={step}
                />
              )}
            </div>
          </Flex>

          <Flex
            position={"absolute"}
            transform={`translateY(${step >= 3 ? 0 : "60vh"})`}
            transition="all 1s ease"
            opacity={step >= 3 ? 1 : 0}
            zIndex={2}
            pointerEvents={step >= 3 ? "all" : "none"}
          >
            {obtainedCards?.length > 0 && (
              <Stack
                randomRotation={true}
                sensitivity={180}
                sendToBackOnClick={true}
                cardDimensions={{
                  width: packWidth - 10,
                  height: packHeight - 40,
                }}
                cardsData={obtainedCards.map((card, index) => ({
                  id: index,
                  cardId: card.card_id,
                  img: `/Cards/${card.card_id}${card.skin_id !== 1 ? `_sk${card.skin_id}` : ""}.png`,
                }))}
                onCardChange={(cardId) => {
                  setHighlightedCard(cardId);
                }}
                onAllSeen={() => setAllCardsSeen(true)}
              />
            )}
          </Flex>

          {step === 0 && (
            <Button
              mt={6}
              onClick={() => {
                setBuying(true);
                mintPack({
                  packId,
                  recipient: account.account?.address,
                })
                  .then((response) => {
                    setBuying(false);
                    setObtainedCards(
                      response.map((card: any) => ({
                        card_id: card.card_id,
                        skin_id: card.skin_id,
                      }))
                    );
                    setStep(1);
                  })
                  .catch((error) => {
                    setBuying(false);
                    console.log(error);
                  });
              }}
              width="40%"
              variant={"secondarySolid"}
              fontFamily="Oxanium"
              fontSize={14}
              isDisabled={buying}
            >
              {buying ? <Spinner size="sm" /> : "BUY · $9.99"}
            </Button>
          )}
          {step === 4 && (
            <Flex
              key={`${description}-${rarity}`}
              flexDir="column"
              alignItems={"center"}
              height={isSmallScreen ? "120px" : "200px"}
              mb={isSmallScreen ? 0 : 16}
              pointerEvents="none"
              zIndex={10}
              sx={{
                animation: "0.3s ease-out slideIn",
                "@keyframes slideIn": {
                  from: {
                    opacity: 0,
                    transform: "translateX(-30px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                },
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            >
              <Text
                textAlign="center"
                size="xl"
                zIndex={10}
                fontSize={"17px"}
                width={"65%"}
              >
                {colorizeText(description)}
              </Text>
              {
                <Text
                  zIndex={10}
                  textAlign="center"
                  size="l"
                  fontSize={"14px"}
                  width={"65%"}
                  opacity={rarity ? 1 : 0}
                >
                  {tDocs(`rarity.${RarityLabels[rarity as RARITY]}`)}
                </Text>
              }
            </Flex>
          )}
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
